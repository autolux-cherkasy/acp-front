import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  iconUrl: string;
  title: string;
  description?: string | string[];
};

export default function EmptyState({ iconUrl, title, description }: EmptyStateProps) {
  const lines = description === undefined ? [] : Array.isArray(description) ? description : [description];

  return (
    <div className={styles.emptyState} aria-live="polite">
      <div className={styles.emptyCard}>
        <div
          className={styles.icon}
          aria-hidden="true"
          style={{ WebkitMaskImage: `url(${iconUrl})`, maskImage: `url(${iconUrl})` }}
        />
        <p className={styles.emptyTitle}>{title}</p>
        {lines.map((line, i) => (
          <p key={i} className={styles.emptyText}>{line}</p>
        ))}
      </div>
    </div>
  );
}
