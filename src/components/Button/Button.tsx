import clsx from "clsx";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  type?: "primary" | "secondary";
  size?: "small" | "regular" | "large";
  align?: "start" | "center" | "end";
  destructive?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  type = "primary",
  size = "regular",
  destructive,
  fullWidth = false,
  align,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={clsx(styles.Button, {
        [styles.Primary]: type === "primary",
        [styles.Secondary]: type === "secondary",
        [styles.Small]: size === "small",
        [styles.Regular]: size === "regular",
        [styles.Large]: size === "large",
        [styles.FullWidth]: fullWidth,
        [styles.AlignStart]: align === "start",
        [styles.AlignCenter]: align === "center",
        [styles.AlignEnd]: align === "end",
        [styles.Destructive]: destructive,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
