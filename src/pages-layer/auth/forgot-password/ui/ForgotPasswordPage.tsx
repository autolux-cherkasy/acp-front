"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { closeAuthRoute } from "@/src/features/auth/model/auth-flow";
import { forgotPassword, usePostAuthNavigation } from "@/src/features/auth";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import GoogleAuthButton from "@/src/features/auth/google/ui/GoogleAuthButton";
import Button from "@/src/shared/ui/Button/Button";
import FormField from "@/src/shared/ui/FormField/FormField";
import TextField from "@/src/shared/ui/TextField/TextField";
import Notification from "@/src/shared/ui/Notification/Notification";
import PasswordRecoveryShell from "@/src/widgets/password-recovery-shell/ui/PasswordRecoveryShell";
import styles from "@/src/widgets/password-recovery-shell/ui/password-recovery-shell.module.css";

type ForgotPasswordPageProps = {
  onClose?: () => void;
};

type FeedbackState = {
  message: string;
  variant: "error" | "info";
} | null;

export default function ForgotPasswordPage({
  onClose,
}: ForgotPasswordPageProps) {
  const router = useRouter();
  const { t, raw } = useI18n();
  const resolveHref = useLocalizedHref();

  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const rememberedPassword = raw("auth.forgotPassword.rememberedPassword");
  const loginAction =
    raw("auth.forgotPassword.loginAction") ??
    raw("auth.resetPassword.loginAction");
  const loginButtonText =
    typeof rememberedPassword === "string" && typeof loginAction === "string"
      ? `${rememberedPassword} ${loginAction}`
      : t("auth.forgotPassword.existingAccount");

  const handleCloseAuthFlow = () => {
    if (onClose) {
      onClose();
      return;
    }

    closeAuthRoute(router);
  };

  const isBusy = isLoading || isGoogleLoading;
  const handlePostAuthSuccess = usePostAuthNavigation(handleCloseAuthFlow);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFeedback(null);
    setIsLoading(true);

    try {
      await forgotPassword({
        email: email.trim(),
      });

      setFeedback({
        variant: "info",
        message: t("auth.forgotPassword.successMessage"),
      });
    } catch (error) {
      setFeedback({
        variant: "error",
        message:
          error instanceof Error
            ? error.message
            : t("auth.forgotPassword.errors.generic"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PasswordRecoveryShell
      titleId="forgot-password-title"
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
      onClose={onClose}
      shellClassName={styles.compactShell}
      contentClassName={styles.compactContent}
      asideClassName={styles.compactAside}
      cardClassName={styles.compactCard}
    >
      <form
        className={`${styles.form} ${styles.compactForm}`}
        onSubmit={handleSubmit}
      >
        <div className={styles.formSection}>
          {feedback ? (
            <Notification
              variant={feedback.variant}
              size="small"
              message={feedback.message}
              onClose={() => setFeedback(null)}
              closeLabel={t("common.close")}
              className={styles.notice}
            />
          ) : null}

          <FormField
            className={styles.field}
            label={t("auth.forgotPassword.emailLabel")}
          >
            <TextField
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (feedback) {
                  setFeedback(null);
                }
              }}
              autoComplete="email"
              placeholder="name@example.com"
              required
              disabled={isLoading}
              leadingAdornment={"/icons/Footer/email.svg"}
            />
          </FormField>
        </div>

        <div className={`${styles.actions} ${styles.compactActions}`}>
          <div className={styles.actionSection}>
            <Button
              text={
                isLoading
                  ? t("auth.forgotPassword.submitLoading")
                  : t("auth.forgotPassword.submitButton")
              }
              variant="primary"
              type="submit"
              disabled={isBusy}
              onClick={() => {}}
            />

            <div className={styles.bottomRow}>
              <div className={styles.socialRow}>
                <GoogleAuthButton
                  intent="login"
                  disabled={isLoading}
                  onBusyChange={setIsGoogleLoading}
                  onSuccess={() => {
                    void handlePostAuthSuccess();
                  }}
                />
              </div>

              <Button
                text={loginButtonText}
                variant="secondary"
                type="button"
                disabled={isBusy}
                onClick={() => router.replace(resolveHref("/login"))}
              />
            </div>
          </div>
        </div>
      </form>
    </PasswordRecoveryShell>
  );
}
