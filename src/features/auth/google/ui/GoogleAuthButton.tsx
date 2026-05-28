"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Image from "next/image";
import { useState } from "react";
import styles from "./GoogleAuthButton.module.css";
import { API_URL } from "@/src/shared";
// import Logo from "@/public/google-logo.svg";

type GoogleAuthIntent = "login" | "register";

type GoogleAuthButtonProps = {
  intent: GoogleAuthIntent;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function getGoogleButtonText(intent: GoogleAuthIntent) {
  return intent === "register" ? "Вхід через" : "Вхід через";
}

export default function GoogleAuthButton({
  intent,
  disabled = false,
  onBusyChange,
  onError,
  onSuccess,
}: GoogleAuthButtonProps) {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isButtonDisabled = disabled || isSubmitting;
  const buttonClassName =
    `${styles.host} ${isButtonDisabled ? styles.disabled : ""}`.trim();

  return (
    <div className={styles.root} aria-busy={isSubmitting}>
      <button
        className={buttonClassName}
        type="button"
        onClick={() => {
          try {
            onBusyChange?.(true);
            window.location.href = `${API_URL}/auth/google`;
          } catch {
            onBusyChange?.(false);
          }
        }}
        disabled={isButtonDisabled}
      >
        {getGoogleButtonText(intent)}
        <Image
          src="/(auth)/flat-color-icons_google.svg"
          alt=""
          className={styles.googleIcon}
          width={24}
          height={24}
          aria-hidden="true"
        />
      </button>

      {isSubmitting ? (
        <div className={styles.overlay}>{t("googleAuth.submitting")}</div>
      ) : null}
    </div>
  );
}
