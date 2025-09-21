import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width: number | string;
  height: number | string;
  radius: number | string;
}

export function Skeleton({ width, height, radius, ...props }: SkeletonProps) {
  return (
    <div
      className={styles.Skeleton}
      style={{
        width,
        height,
        borderRadius: `${radius}px`,
      }}
      {...props}
    />
  );
}
