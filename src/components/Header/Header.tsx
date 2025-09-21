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

interface HeaderProps {
  name: string;
  options?: { value: string; label: string }[];
  loading?: boolean;
  currentUserData?: UseQueryResult<GetMeResponse, Error>;
}

export function Header({
  name,
  options,
  loading,
  currentUserData,
}: HeaderProps) {
  const { setView } = useView();

  const [newProjectId, setNewProjectId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  function handleAddProject() {
    console.log("Add project:", newProjectId);
    // Add your logic to handle adding the project here
    setIsDialogOpen(false);
    setNewProjectId("");
  }

  return (
    <header data-tauri-drag-region className={styles.HeaderContainer}>
      <div>
        <Select.Root
          open={isSelectOpen}
          onOpenChange={(open) => !open && setIsSelectOpen(!isSelectOpen)}
          value={name}
          disabled={loading}
          onValueChange={() => {}}
        >
          <Select.Trigger
            className={clsx(styles.SelectTrigger)}
            onClick={() => setIsSelectOpen(!isSelectOpen)}
          >
            {loading ? (
              <Skeleton width={120} height={24} radius={4} />
            ) : (
              <>
                <Select.Value className={styles.SelectValue} />
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
                  Projects • {options?.length}
                </span>
                <Select.Item
                  key={1}
                  value={name}
                  className={styles.SelectOption}
                >
                  <Select.ItemText>{name}</Select.ItemText>
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
                <button
                  onClick={() => {
                    setIsDialogOpen(true);
                    setIsSelectOpen(false);
                  }}
                  className={clsx(styles.SelectOption, styles.Add)}
                >
                  <Plus size={16} strokeWidth={1.5} />
                  Add project
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
        onClose={() => setIsDialogOpen(false)}
        title="New project"
      >
        <Field
          label="Figma Project ID or URL"
          required
          value={newProjectId}
          onChange={(value) => setNewProjectId(value)}
        />
        <Button type="secondary" align="end" onClick={handleAddProject}>
          Add project
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
