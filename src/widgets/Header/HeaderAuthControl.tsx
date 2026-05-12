import Image from "next/image";

import styles from "./HeaderAuthControl.module.css";

type HeaderAuthControlProps = {
  className?: string;
  isAuthorized: boolean;
  loginLabel: string;
  profileAriaLabel: string;
  onLoginClick: () => void;
  onAvatarClick: () => void;
};

export default function HeaderAuthControl({
  className,
  isAuthorized,
  loginLabel,
  profileAriaLabel,
  onLoginClick,
  onAvatarClick,
}: HeaderAuthControlProps) {
  const rootClassName = className
    ? `${styles.authControl} ${className}`
    : styles.authControl;

  return (
    <div className={rootClassName}>
      {isAuthorized ? (
        <button
          className={`${styles.avatarBtn}`}
          aria-label={profileAriaLabel}
          type="button"
          onClick={onAvatarClick}
        >
          <Image
            className={styles.avatarIcon}
            src="/icons/Header/user/avatar_login.svg"
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
          />
        </button>
      ) : (
        <button
          className={styles.loginBtn}
          type="button"
          aria-haspopup="dialog"
          onClick={onLoginClick}
        >
          {loginLabel}
        </button>
      )}
    </div>
  );
}
