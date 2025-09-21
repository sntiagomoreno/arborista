import { useView } from "@/context/ViewContext";
import { Avatar } from "@base-ui-components/react";
import { Plus, X } from "react-feather";
import styles from "./SettingsView.module.css";
import { Button } from "@/components/Button";
import clsx from "clsx";
import { useFigmaData } from "@/context/FigmaDataContext";
import { Dialog as BaseDialog } from "@base-ui-components/react";
import { Dialog } from "@/components/Dialog";
import { use, useState } from "react";
import { Field } from "@/components/Field";

type SettingsViewProps =
  | { asDialog?: false; open?: never; onClose?: never }
  | { asDialog: true; open: boolean; onClose?: () => void };

export default function SettingsView({
  asDialog,
  open,
  onClose,
}: SettingsViewProps) {
  const { setView } = useView();
  const { currentUser } = useFigmaData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProjectId, setNewProjectId] = useState("");

  if (asDialog) {
    return (
      <BaseDialog.Root
        open={open}
        onOpenChange={(open) => !open && onClose?.()}
      >
        <BaseDialog.Portal>
          {/* <BaseDialog.Backdrop className={styles.Backdrop} /> */}
          <BaseDialog.Popup className={styles.View}>
            <header className={styles.Header}>
              <h1 className={styles.PageHeading}>Settings</h1>
              <BaseDialog.Close className={styles.CloseButton}>
                <X />
              </BaseDialog.Close>
            </header>
            <main className="main-content">
              {currentUser.data && (
                <div className={styles.UserInformation}>
                  <Avatar.Root>
                    <Avatar.Image
                      src={currentUser.data.img_url}
                      alt={currentUser.data.handle}
                      style={{ width: 52, height: 52, borderRadius: 26 }}
                    />
                    <Avatar.Fallback>U</Avatar.Fallback>
                  </Avatar.Root>
                  <div className={styles.UserDetails}>
                    <h2 className={styles.SectionHeading}>Connected account</h2>
                    <span className={styles.AccountName}>
                      {currentUser.data.handle}
                    </span>
                  </div>
                </div>
              )}
              <div className={styles.Section}>
                <h2 className={styles.SectionHeading}>Added projects</h2>

                <ul className={styles.SectionList}>
                  <li className={styles.SectionListItem}>
                    <div>
                      <h3 className={styles.ItemLabel}>Project Name</h3>
                    </div>
                  </li>
                  <li
                    className={clsx(styles.SectionListItem, styles.Interactive)}
                    onClick={() => {
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <button className={clsx(styles.ItemLabel, styles.Add)}>
                      <Plus size={16} strokeWidth={1.5} />
                      Add project
                    </button>
                  </li>
                </ul>
              </div>
              <div className={styles.Section}>
                <h2 className={styles.SectionHeading}>Manage access</h2>

                <ul className={styles.SectionList}>
                  <li className={styles.SectionListItem}>
                    <div>
                      <h3 className={styles.ItemLabel}>Update access token</h3>
                      <p className={styles.ItemDescription}>
                        Update your token if is soon to expire or need to update
                        access scopes.
                      </p>
                    </div>
                    <Button fullWidth type="secondary" size="small">
                      Update token
                    </Button>
                  </li>
                  <li className={styles.SectionListItem}>
                    <div>
                      <h3 className={styles.ItemLabel}>Clear access token</h3>
                      <p className={styles.ItemDescription}>
                        Clearing your token will remove all your projects too.
                      </p>
                    </div>
                    <Button fullWidth type="secondary" size="small" destructive>
                      Clear token
                    </Button>
                  </li>
                </ul>
              </div>
              <footer className={styles.Footer}>
                Made with love in Colombia by Santiago Moreno
              </footer>
              <Dialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                title="New project"
              >
                <Field
                  label="Figma Project ID or URL"
                  required
                  value={newProjectId}
                  onChange={(value) => setNewProjectId(value)}
                />
                <Button type="secondary" align="end" onClick={() => {}}>
                  Add project
                </Button>
              </Dialog>
            </main>
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    );
  }

  return (
    <div className={styles.View}>
      <header className={styles.Header}>
        <h1 className={styles.PageHeading}>Settings</h1>
        <button
          onClick={() => setView("dashboard")}
          className={styles.CloseButton}
        >
          <X />
        </button>
      </header>
      <main className="main-content">
        {currentUser.data && (
          <div className={styles.UserInformation}>
            <Avatar.Root>
              <Avatar.Image
                src={currentUser.data.img_url}
                alt={currentUser.data.handle}
                style={{ width: 52, height: 52, borderRadius: 26 }}
              />
              <Avatar.Fallback>U</Avatar.Fallback>
            </Avatar.Root>
            <div className={styles.UserDetails}>
              <h2 className={styles.SectionHeading}>Connected account</h2>
              <span className={styles.AccountName}>Name</span>
            </div>
          </div>
        )}
        <div className={styles.Section}>
          <h2 className={styles.SectionHeading}>Added projects</h2>

          <ul className={styles.SectionList}>
            <li className={styles.SectionListItem}>
              <div>
                <h3 className={styles.ItemLabel}>Project Name</h3>
              </div>
            </li>
            <li className={clsx(styles.SectionListItem, styles.Interactive)}>
              <button
                //   onClick={() => {
                //     setIsDialogOpen(true);
                //     setIsSelectOpen(false);
                //   }}
                className={clsx(styles.ItemLabel, styles.Add)}
              >
                <Plus size={16} strokeWidth={1.5} />
                Add project
              </button>
            </li>
          </ul>
        </div>
        <div className={styles.Section}>
          <h2 className={styles.SectionHeading}>Manage access</h2>

          <ul className={styles.SectionList}>
            <li className={styles.SectionListItem}>
              <div>
                <h3 className={styles.ItemLabel}>Update access token</h3>
                <p className={styles.ItemDescription}>
                  Update your token if is soon to expire or need to update
                  access scopes.
                </p>
              </div>
              <Button fullWidth type="secondary" size="small">
                Update token
              </Button>
            </li>
            <li className={styles.SectionListItem}>
              <div>
                <h3 className={styles.ItemLabel}>Clear access token</h3>
                <p className={styles.ItemDescription}>
                  Clearing your token will remove all your projects too.
                </p>
              </div>
              <Button fullWidth type="secondary" size="small" destructive>
                Clear token
              </Button>
            </li>
          </ul>
        </div>
        <footer className={styles.Footer}>
          Made with love in Colombia by Santiago Moreno
        </footer>
      </main>
    </div>
  );
}
