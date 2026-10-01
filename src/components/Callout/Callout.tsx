import clsx from "clsx";
import styles from "./Callout.module.css";

interface CalloutProps {
  type?: "success" | "error";
  content: string;
}

export function Callout({ type = "success", content }: CalloutProps) {
  return (
    <div
      className={clsx(styles.Callout, {
        [styles.success]: type === "success",
        [styles.error]: type === "error",
      })}
    >
      {content}
    </div>
  );
}
