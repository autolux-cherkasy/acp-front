import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  iconUrl: string;
  title?: string;
  description?: string | string[];
  className?: string;
  cardClassName?: string;
};

export default function EmptyState({
  iconUrl,
  title = "Немає даних",
  description,
  className,
  cardClassName,
}: EmptyStateProps) {
  const lines =
    description === undefined ? [] : Array.isArray(description) ? description : [description];

  return (
    <div className={`${styles.emptyState}${className ? ` ${className}` : ""}`} aria-live="polite">
      <div className={`${styles.emptyCard}${cardClassName ? ` ${cardClassName}` : ""}`}>
        <div
          className={styles.icon}
          aria-hidden="true"
          style={{ WebkitMaskImage: `url(${iconUrl})`, maskImage: `url(${iconUrl})` }}
        />
        <div>
          <p className={styles.emptyTitle}>{title}</p>
          {lines.map((line, i) => (
            <p key={i} className={styles.emptyText}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
