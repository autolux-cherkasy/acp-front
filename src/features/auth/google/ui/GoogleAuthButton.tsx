"use client";

import {
  authenticateWithGoogleCredential,
  getGoogleClientId,
  loadGoogleIdentityScript,
} from "@/src/features/auth/google/api/google-auth";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Image from "next/image";
import { useEffect, useEffectEvent, useState } from "react";
import styles from "./GoogleAuthButton.module.css";
// import Logo from "@/public/google-logo.svg";

type GoogleAuthIntent = "login" | "register";

type GoogleCredentialResponse = {
  credential?: string;
};

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
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportBusyChange = useEffectEvent((busy: boolean) => {
    onBusyChange?.(busy);
  });

  const reportError = useEffectEvent((message: string) => {
    onError?.(message);
  });

  const reportSuccess = useEffectEvent(() => {
    onSuccess?.();
  });

  const handleCredentialResponse = useEffectEvent(async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      reportError(t("googleAuth.errors.noCredential"));
      return;
    }

    reportError("");
    reportBusyChange(true);
    setIsSubmitting(true);

    try {
      await authenticateWithGoogleCredential(response.credential);
      reportSuccess();
    } catch (err) {
      reportError(err instanceof Error ? err.message : t("googleAuth.errors.complete"));
    } finally {
      reportBusyChange(false);
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    let isActive = true;

    const initializeGoogleButton = async () => {
      try {
        const clientId = await getGoogleClientId();
        await loadGoogleIdentityScript();

        if (!isActive || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: GoogleCredentialResponse) => {
            void handleCredentialResponse(response);
          },
        });

        if (isActive) {
          setIsReady(true);
        }
      } catch {
        if (isActive) {
          setIsReady(false);
        }
      }
    };

    void initializeGoogleButton();

    return () => {
      isActive = false;
    };
  }, [intent, t]);

  const isButtonDisabled = disabled || isSubmitting || !isReady;
  const buttonClassName = `${styles.host} ${isButtonDisabled ? styles.disabled : ""}`.trim();

  return (
    <div className={styles.root} aria-busy={isSubmitting}>
      <button
        className={buttonClassName}
        onClick={() => window.google?.accounts?.id?.prompt()}
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

      {isSubmitting ? <div className={styles.overlay}>{t("googleAuth.submitting")}</div> : null}
    </div>
  );
}
