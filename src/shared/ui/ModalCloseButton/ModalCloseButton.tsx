"use client";

import Icon from "../Icon/Icon";
import styles from "./ModalCloseButton.module.css";

type Props = {
  className?: string;
  ariaLabel?: string;
  onClose?: () => void;
};

export default function ModalCloseButton({ className, ariaLabel = "Close", onClose }: Props) {
  const buttonClassName = className ? `${styles.button} ${className}` : styles.button;

  return (
    <button
      type="button"
      className={buttonClassName}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose?.();
      }}
    >
      <Icon src="/icons/close-light.svg" size={24} />
    </button>
  );
}
