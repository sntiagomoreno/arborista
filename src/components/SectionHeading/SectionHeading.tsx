import styles from "./SectionHeading.module.css";

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className={styles.SectionHeading}>{children}</h2>;
}
