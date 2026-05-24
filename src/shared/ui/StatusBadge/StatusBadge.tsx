import styles from "./StatusBadge.module.css";

export type StatusBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "softDanger";

type Props = {
  label: string;
  variant: StatusBadgeVariant;
  className?: string;
  withDot?: boolean;
};

export default function StatusBadge({
  label,
  variant,
  className,
  withDot = true,
}: Props) {
  return (
    <span
      className={[styles.badge, styles[variant], className].filter(Boolean).join(" ")}
      role="status"
    >
      {withDot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {label}
    </span>
  );
}
