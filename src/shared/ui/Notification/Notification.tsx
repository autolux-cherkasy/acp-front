import ModalCloseButton from "../ModalCloseButton/ModalCloseButton";
import styles from "./Notification.module.css";

export type NotificationVariant = "info" | "error" | "success";
export type NotificationSize = "small" | "large";

type NotificationProps = {
  variant?: NotificationVariant;
  size?: NotificationSize;
  title?: string;
  message: string;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
};

function NotificationIcon({ variant }: { variant: NotificationVariant }) {
  if (variant === "error") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={styles.iconSvg}
      >
        <path
          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15 9L9 15M9 9L15 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "success") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={styles.iconSvg}
      >
        <path
          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 12.5L10.5 15L16 9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.iconSvg}
    >
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 10V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 8.25C11.8619 8.25 11.75 8.13807 11.75 8C11.75 7.86193 11.8619 7.75 12 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 8.25C12.1381 8.25 12.25 8.13807 12.25 8C12.25 7.86193 12.1381 7.75 12 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Notification({
  variant = "info",
  size = "small",
  title,
  message,
  onClose,
  closeLabel = "Close",
  className,
}: NotificationProps) {
  const classNames = [
    styles.notification,
    styles[`variant${variant[0].toUpperCase()}${variant.slice(1)}`],
    styles[`size${size[0].toUpperCase()}${size.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} role="status" aria-live="polite">
      <div className={styles.iconWrap}>
        <NotificationIcon variant={variant} />
      </div>

      <div className={styles.content}>
        {title ? <div className={styles.title}>{title}</div> : null}
        <div className={styles.message}>{message}</div>
      </div>

      {onClose ? (
        <ModalCloseButton
          onClose={onClose}
          ariaLabel={closeLabel}
          className={styles.closeButton}
        />
      ) : null}
    </div>
  );
}
