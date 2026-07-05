"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import styles from "./AddOrderButton.module.css";

type Props = {
    onClick: () => void;
};

export default function AddOrderButton({ onClick }: Props) {
  const { t } = useI18n();

  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {t("dispatcherArea.tickets.actions.addOrder")}
    </button>
  );
}
