import clsx from "clsx";
import styles from "./Tag.module.css";

interface TagProps {
  type?: "neutral" | "alert" | "negative";
  children: React.ReactNode;
}

export function Tag({ children, type = "neutral" }: TagProps) {
  return (
    <div
      className={clsx(styles.Tag, {
        [styles.alert]: type === "alert",
        [styles.negative]: type === "negative",
      })}
    >
      {children}
    </div>
  );
}
