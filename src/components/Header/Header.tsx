import { Avatar, Select } from "@base-ui-components/react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Settings,
} from "react-feather";
import styles from "./Header.module.css";
import clsx from "clsx";
import { Skeleton } from "../Skeleton";
import { GetMeResponse } from "@figma/rest-api-spec";
import { UseQueryResult } from "@tanstack/react-query";
import { Dialog } from "../Dialog";
import { Field } from "../Field";
import { useState } from "react";
import { Button } from "../Button";
import { useView } from "@/context/ViewContext";
import SettingsView from "@/views/SettingsView";
import { useStoredData } from "@/context/StoredDataContext";
import { fetchProject } from "@/utils/fetchProject";
import { Callout } from "../Callout";

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
  const { setView } = useView();
  const { storedAccessToken, saveProject, storedProjects } = useStoredData();
  const selectedProjectName = storedProjects
    .map((p) => JSON.parse(p) as { id: string; name: string })
    .find((p) => p.id === selectedProjectId)?.name ?? "";

  const [newProjectId, setNewProjectId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [addProjectError, setAddProjectError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddProject() {
    setAddProjectError(null);
    setIsAdding(true);
    try {
      const projectResponse = await fetchProject(storedAccessToken, newProjectId);
      await saveProject(newProjectId, projectResponse.name);
      setIsDialogOpen(false);
      setNewProjectId("");
    } catch {
      setAddProjectError("Folder doesn't exist with that ID or you don't have permission to view.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <header data-tauri-drag-region className={styles.HeaderContainer}>
      <div>
        <Select.Root
          open={isSelectOpen}
          onOpenChange={(open) => !open && setIsSelectOpen(!isSelectOpen)}
          value={selectedProjectId}
          disabled={loading}
          onValueChange={onProjectChange}
        >
          <Select.Trigger
            className={clsx(styles.SelectTrigger)}
            onClick={() => setIsSelectOpen(!isSelectOpen)}
          >
            {loading ? (
              <Skeleton width={120} height={24} radius={4} />
            ) : (
              <>
                <span className={styles.SelectValue}>{selectedProjectName}</span>
                <Select.Icon className={styles.SelectIcon}>
                  <ChevronUp size={18} className={styles.IconOpen} />
                  <ChevronDown size={18} className={styles.IconClosed} />
                </Select.Icon>
              </>
            )}
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={5} alignOffset={0} align="start">
              <Select.ScrollUpArrow />
              <Select.Popup className={styles.SelectPopup}>
                <span className={styles.SelectPopupHeading}>
                  Folders • {storedProjects.length}
                </span>
                {storedProjects.map((project) => {
                  const { id: projectId, name: projectName } = JSON.parse(project);
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
      <div className={styles.UserSection}>
        {/* <MoreHorizontal size={24} /> */}
        {currentUserData &&
          (currentUserData.isLoading ? (
            <Skeleton width={28} height={28} radius={16} />
          ) : (
            <Avatar.Root onClick={() => setIsSettingsOpen(true)}>
              <Avatar.Image
                src={currentUserData.data?.img_url}
                alt={currentUserData.data?.handle}
                style={{ width: 28, height: 28, borderRadius: 16 }}
              />
            </Avatar.Root>
          ))}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setAddProjectError(null); }}
        title="New folder"
      >
        {addProjectError && <Callout type="error" content={addProjectError} />}
        <Field
          label="Figma Folder ID or URL"
          required
          value={newProjectId}
          onChange={(value) => setNewProjectId(value)}
        />
        <Button type="secondary" align="end" onClick={handleAddProject} disabled={isAdding}>
          {isAdding ? "Adding..." : "Add folder"}
        </Button>
      </Dialog>
      <SettingsView
        asDialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </header>
  );
}
