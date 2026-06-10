import styles from "./ChevronIcon.module.css";

type Props = {
  open?: boolean;
  className?: string;
};

export default function ChevronIcon({ open, className }: Props) {
  return (
    <span
      className={[styles.chevron, open && styles.open, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}
