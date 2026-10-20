import { Avatar, Select } from "@base-ui-components/react";
import { Check, ChevronDown, ChevronUp, Plus, User } from "react-feather";
import styles from "./Header.module.css";
import clsx from "clsx";
import { Skeleton } from "../Skeleton";
import { GetMeResponse } from "@figma/rest-api-spec";
import { UseQueryResult } from "@tanstack/react-query";
import { Dialog } from "../Dialog";
import { Field } from "../Field";
import { useState } from "react";
import { Button } from "../Button";
import SettingsView from "@/views/SettingsView";
import { useStoredData } from "@/context/StoredDataContext";
import { fetchProject } from "@/utils/fetchProject";
import { parseFolderId } from "@/utils/parseFolderId";
import { Callout } from "../Callout";
import { useUpdater } from "@/context/UpdaterContext";

interface HeaderProps {
  selectedProjectId: string;
  onProjectChange: (id: string) => void;
  loading?: boolean;
  currentUserData?: UseQueryResult<GetMeResponse, Error>;
}

export function Header({
  selectedProjectId,
  onProjectChange,
  loading,
  currentUserData,
}: HeaderProps) {
  const { storedAccessToken, saveProject, storedProjects } = useStoredData();
  const selectedProjectName =
    storedProjects
      .map((p) => JSON.parse(p) as { id: string; name: string })
      .find((p) => p.id === selectedProjectId)?.name ?? "";

  const [newProjectId, setNewProjectId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [addProjectError, setAddProjectError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { updateAvailable } = useUpdater();

  async function handleAddProject() {
    setAddProjectError(null);
    setIsAdding(true);
    const folderId = parseFolderId(newProjectId);
    try {
      const projectResponse = await fetchProject(storedAccessToken, folderId);
      await saveProject(folderId, projectResponse.name);
      onProjectChange(folderId);
      setIsDialogOpen(false);
      setNewProjectId("");
    } catch {
      setAddProjectError(
        "Folder doesn't exist with that ID or you don't have permission to view.",
      );
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <header data-tauri-drag-region className={styles.HeaderContainer}>
      {/* <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}> */}
      {/* <img
          src="/icon.png"
          className={styles.Logo}
          width={36}
          height="auto"
          alt="Arborista"
        /> */}
      <div>
        <Select.Root
          open={isSelectOpen}
          onOpenChange={setIsSelectOpen}
          value={selectedProjectId}
          disabled={loading}
          onValueChange={onProjectChange}
        >
          <Select.Trigger className={clsx(styles.SelectTrigger)}>
            {loading ? (
              <Skeleton width={120} height={24} radius={4} />
            ) : (
              <>
                <span className={styles.SelectValue}>
                  {selectedProjectName}
                </span>
                <Select.Icon className={styles.SelectIcon}>
                  <ChevronUp size={18} className={styles.IconOpen} />
                  <ChevronDown size={18} className={styles.IconClosed} />
                </Select.Icon>
              </>
            )}
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner
              sideOffset={5}
              alignOffset={0}
              align="end"
              side="bottom"
              alignItemWithTrigger={false}
            >
              <Select.ScrollUpArrow />
              <Select.Popup className={styles.SelectPopup}>
                <span className={styles.SelectPopupHeading}>
                  Folders • {storedProjects.length}
                </span>
                {storedProjects.map((project) => {
                  const { id: projectId, name: projectName } =
                    JSON.parse(project);
                  return (
                    <Select.Item
                      key={projectId}
                      value={projectId}
                      className={styles.SelectOption}
                    >
                      <Select.ItemText>{projectName}</Select.ItemText>
                      <Select.ItemIndicator
                        className={styles.SelectOptionIndicator}
                      >
                        <Check
                          size={8}
                          strokeWidth={4}
                          className={styles.OptionIndicatorIcon}
                        />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                })}
                <button
                  onClick={() => {
                    setIsDialogOpen(true);
                    setIsSelectOpen(false);
                  }}
                  className={clsx(styles.SelectOption, styles.Add)}
                >
                  <Plus size={16} strokeWidth={1.5} />
                  Add folder
                </button>
              </Select.Popup>
              <Select.ScrollDownArrow />
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
      {/* </div> */}
      <div className={styles.UserSection}>
        {/* <MoreHorizontal size={24} /> */}
        {currentUserData &&
          (currentUserData.isLoading ? (
            <Skeleton width={28} height={28} radius={16} />
          ) : (
            <Avatar.Root
              className={styles.SettingsAvatar}
              data-update-available={updateAvailable || undefined}
              onClick={() => setIsSettingsOpen(true)}
            >
              <Avatar.Image
                src={currentUserData.data?.img_url}
                alt={currentUserData.data?.handle}
                style={{ width: 28, height: 28, borderRadius: 16 }}
              />
              <Avatar.Fallback
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 16,
                  backgroundColor: "#3a3a3a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#9d9d9d",
                }}
              >
                <User size={14} />
              </Avatar.Fallback>
            </Avatar.Root>
          ))}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setAddProjectError(null);
        }}
        title="New folder"
      >
        {addProjectError && <Callout type="error" content={addProjectError} />}
        <Field
          label="Figma Folder ID or URL"
          required
          value={newProjectId}
          onChange={(value) => setNewProjectId(value)}
        />
        <Button
          type="secondary"
          align="end"
          onClick={handleAddProject}
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add folder"}
        </Button>
      </Dialog>
      <SettingsView
        asDialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onFolderAdded={onProjectChange}
      />
    </header>
  );
}
