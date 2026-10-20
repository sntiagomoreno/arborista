import { RefreshCw } from "react-feather";
import styles from "./SectionHeading.module.css";
import clsx from "clsx";

interface SectionHeadingProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function SectionHeading({ children, onRefresh, isRefreshing }: SectionHeadingProps) {
  return (
    <h2 className={styles.SectionHeading}>
      {children}
      {onRefresh && (
        <button
          className={clsx(styles.RefreshButton, isRefreshing && styles.spinning)}
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={11} />
        </button>
      )}
    </h2>
  );
}
