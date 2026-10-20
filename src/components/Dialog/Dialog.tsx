import { Dialog as BaseDialog } from "@base-ui-components/react";
import styles from "./Dialog.module.css";
import { X } from "react-feather";

interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onClose?: () => void;
  zIndex?: number;
}

export function Dialog({ children, open, title, onClose, zIndex = 1000 }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={(open) => !open && onClose?.()}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.Backdrop} style={{ zIndex: zIndex - 1 }} />
        <BaseDialog.Popup className={styles.Popup} style={{ zIndex }}>
          <header className={styles.Header}>
            <BaseDialog.Title className={styles.Title}>
              {title}
            </BaseDialog.Title>
            <BaseDialog.Close className={styles.Button}>
              <X size={20} strokeWidth={2} />
            </BaseDialog.Close>
          </header>
          {/* <BaseDialog.Description className={styles.Description}>
            You are all caught up. Good job!
          </BaseDialog.Description> */}
          <div className={styles.Content}>
            {children}
            {/* <BaseField.Root>
              <BaseField.Label>Name</BaseField.Label>
              <BaseField.Control required placeholder="Required" />

              <BaseField.Error match="valueMissing">
                Please enter your name
              </BaseField.Error>

              <BaseField.Description>
                Visible on your profile
              </BaseField.Description>
            </BaseField.Root> */}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
