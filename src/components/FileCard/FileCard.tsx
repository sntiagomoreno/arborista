import { ArrowRight, Clock, GitBranch } from "react-feather";
import { Tag } from "../Tag";
import {
  GetFileVersionsResponse,
  GetProjectFilesResponse,
  GetFileResponse,
} from "@figma/rest-api-spec";
import { ProjectQueryData } from "@/utils/fetchProject";
import { useFileQuery, useFileVersionQuery } from "@/hooks/useFigmaQueries";
import { formatDate, getStatus } from "@/utils/formatDate";
import styles from "./FileCard.module.css";
import { Avatar, ContextMenu, Tooltip } from "@base-ui-components/react";
import clsx from "clsx";
import { openPath, openUrl } from "@tauri-apps/plugin-opener";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useState } from "react";
import { Skeleton } from "../Skeleton";
import { useStoredData } from "../../context/StoredDataContext";

interface FileCardProps {
  file: ProjectQueryData["files"][number];
}

export function FileCard({
  file: { key, name, last_modified },
}: FileCardProps) {
  return (
    <div className={styles.CardContainer}>
      <div className={styles.FileHeader}>
        <div>
          <a
            className={styles.FileName}
            onClick={() => openUrl(`https://www.figma.com/file/${key}`)}
          >
            {name}
          </a>
          {/* <ArrowRight size={16} /> */}
        </div>
        <span className={styles.FileLastUpdated}>
          Last updated on {formatDate(last_modified)}
        </span>
      </div>
      {/* Branch List */}
      <BranchList fileKey={key} />
    </div>
  );
}

interface BranchListProps {
  fileKey: string;
}

function BranchList({ fileKey }: BranchListProps) {
  const { storedAccessToken } = useStoredData();
  const { data, isLoading, error } = useFileQuery(storedAccessToken, fileKey);
  if (isLoading) {
    return (
      <div>
        <header className={styles.BranchListHeader}>
          <div className={styles.TableHeading}>
            <Skeleton width={80} height={12} radius={4} />
          </div>
          <div className={styles.TableHeading}>
            <Skeleton width={80} height={12} radius={4} />
          </div>
        </header>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return <div>Error loading branches.</div>;
  }

  return (
    <div>
      {!data?.branches || data?.branches.length < 1 ? (
        <span className={clsx(styles.BranchListItem, styles.noBranches)}>
          No branches found
        </span>
      ) : (
        <div>
          <header className={styles.BranchListHeader}>
            <div className={styles.TableHeading}>
              <GitBranch size={12} />

              <span>Branches • {data.branches.length} </span>
            </div>
            <div className={styles.TableHeading}>
              <Clock size={12} /> <span>Last updated</span>
            </div>
          </header>
          <SortedBranchList branches={data.branches} accessToken={storedAccessToken} />
        </div>
      )}
    </div>
  );
}

interface SortedBranchListProps {
  branches: GetFileResponse["branches"];
  accessToken: string;
}

function SortedBranchList({ branches, accessToken }: SortedBranchListProps) {
  // Get version data for all branches using consistent hook calls
  const versionQueries = branches!.map((branch) =>
    useFileVersionQuery(accessToken, branch.key),
  );

  const allVersionsLoaded = versionQueries.every((query) => !query.isLoading);

  // Create branch-version pairs for sorting
  const branchesWithVersionData = branches!.map((branch, index) => ({
    branch,
    versionData: versionQueries[index].data,
    isLoading: versionQueries[index].isLoading,
    error: versionQueries[index].error,
  }));

  // Sort by latest version date
  const sortedBranches = [...branchesWithVersionData].sort((a, b) => {
    const aLatestDate = a.versionData?.versions[0]?.created_at;
    const bLatestDate = b.versionData?.versions[0]?.created_at;

    if (!aLatestDate && !bLatestDate) return 0;
    if (!aLatestDate) return 1;
    if (!bLatestDate) return -1;

    return new Date(bLatestDate).getTime() - new Date(aLatestDate).getTime();
  });

  if (!allVersionsLoaded) {
    return (
      <div>
        <li className={clsx(styles.BranchListItem)}>
          <div className={styles.BranchName}>
            <Skeleton width={100} height={20} radius={4} />
          </div>

          <div className={styles.BranchListItemLastUpdated}>
            <Skeleton width={80} height={24} radius={40} />

            <Skeleton width={24} height={24} radius={12} />
          </div>
        </li>
      </div>
    );
  }

  return (
    <ul>
      {sortedBranches.map(({ branch, versionData }) => (
        <BranchListItem
          name={branch.name}
          branchKey={branch.key}
          versionData={versionData}
          key={branch.key}
        />
      ))}
    </ul>
  );
}

interface BranchListItemProps {
  name: string;
  branchKey: string;
  versionData?: GetFileVersionsResponse;
}

function BranchListItem({ name, branchKey, versionData }: BranchListItemProps) {
  const [isContextOpen, setIsContextOpen] = useState(false);

  if (!versionData) {
    return <div>No version data available.</div>;
  }

  return (
    <ContextMenu.Root onOpenChange={(open) => setIsContextOpen(open)}>
      <ContextMenu.Trigger
        className={styles.ContextMenuTrigger}
        onClick={() => openUrl(`https://www.figma.com/file/${branchKey}`)}
      >
        <li
          className={clsx(styles.BranchListItem, {
            [styles.contextOpen]: isContextOpen,
          })}
        >
          {(() => {
            const TooltipWithScroll: React.FC = () => {
              const [isTooltipOpen, setIsTooltipOpen] = useState(false);

              const handleOpenChange = (open: boolean) => {
                setIsTooltipOpen(open);

                if (open) {
                  const onScroll = () => {
                    setIsTooltipOpen(false);
                    // remove this handler after it fires so we don't leak listeners
                    document.removeEventListener("scroll", onScroll, true);
                  };
                  // listen in capture phase so we catch scrolls on any scrollable ancestor
                  document.addEventListener("scroll", onScroll, true);
                }
              };

              return (
                <Tooltip.Root
                  delay={1000}
                  hoverable={false}
                  open={isTooltipOpen}
                  onOpenChange={handleOpenChange}
                >
                  <div className={styles.BranchName}>
                    <Tooltip.Trigger
                      aria-label={name}
                      className={styles.TooltipTrigger}
                    >
                      <span>{name}</span>
                    </Tooltip.Trigger>
                  </div>
                  <Tooltip.Portal>
                    <Tooltip.Positioner
                      sideOffset={8}
                      align="center"
                      alignOffset={-8}
                      collisionAvoidance={{
                        side: "shift",
                        align: "shift",
                        fallbackAxisSide: "none",
                      }}
                      collisionPadding={16}
                    >
                      <Tooltip.Popup className={styles.BranchNameTooltipPopup}>
                        <span className={styles.TooltipContent}>{name}</span>
                      </Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root>
              );
            };

            return <TooltipWithScroll />;
          })()}

          <div className={styles.BranchListItemLastUpdated}>
            {versionData?.versions[0].created_at && (
              <Tag type={getStatus(versionData?.versions[0].created_at)}>
                {formatDate(versionData?.versions[0].created_at)}
              </Tag>
            )}
            <Tooltip.Root delay={200} hoverable={false}>
              <Tooltip.Trigger
                aria-label={`Last edited by ${versionData?.versions[0].user.handle}`}
                className={styles.TooltipTrigger}
              >
                <Avatar.Root className={styles.Avatar}>
                  <Avatar.Image
                    width={24}
                    height={24}
                    src={versionData?.versions[0].user.img_url}
                    alt={versionData?.versions[0].user.handle}
                  />
                  <Avatar.Fallback className={styles.Fallback}>
                    {versionData?.versions[0].user.handle.charAt(0)}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Positioner sideOffset={8} align="end" alignOffset={-8}>
                  <Tooltip.Popup className={styles.TooltipPopup}>
                    {/* <Tooltip.Arrow className={styles.TooltipArrow}>
                  <ArrowSvg />
                </Tooltip.Arrow> */}
                    <div className={styles.TooltipContent}>
                      <span>{versionData?.versions[0].user.handle}</span>
                      <span className={styles.label}>Latest editor</span>
                    </div>
                  </Tooltip.Popup>
                </Tooltip.Positioner>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>
        </li>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner className={styles.Positioner}>
          <ContextMenu.Popup className={styles.ContextMenuPopup}>
            <ContextMenu.Item
              className={styles.ContextMenuItem}
              onClick={() => openUrl(`https://www.figma.com/file/${branchKey}`)}
            >
              Open in Figma
            </ContextMenu.Item>
            <ContextMenu.Item
              className={styles.ContextMenuItem}
              onClick={async () =>
                await writeText(`https://www.figma.com/file/${branchKey}`)
              }
            >
              Copy branch link
            </ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

function TooltipWithScroll({ name }: { name: string }) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsTooltipOpen(open);

    if (open) {
      const onScroll = () => {
        setIsTooltipOpen(false);
        document.removeEventListener("scroll", onScroll, true);
      };
      document.addEventListener("scroll", onScroll, true);
    }
  };

  return (
    <Tooltip.Root
      delay={1000}
      hoverable={false}
      open={isTooltipOpen}
      onOpenChange={handleOpenChange}
    >
      <div className={styles.BranchName}>
        <Tooltip.Trigger aria-label={name} className={styles.TooltipTrigger}>
          <span>{name}</span>
        </Tooltip.Trigger>
      </div>
      <Tooltip.Portal>
        <Tooltip.Positioner
          sideOffset={8}
          align="center"
          alignOffset={-8}
          collisionAvoidance={{
            side: "shift",
            align: "shift",
            fallbackAxisSide: "none",
          }}
          collisionPadding={16}
        >
          <Tooltip.Popup className={styles.BranchNameTooltipPopup}>
            <span className={styles.TooltipContent}>{name}</span>
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
