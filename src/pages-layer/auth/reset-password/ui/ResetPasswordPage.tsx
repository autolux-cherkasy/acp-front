"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useResetPasswordMutation } from "@/src/features/auth/api/useAuthQueries";
import { openAuthModal } from "@/src/features/auth/model/auth-flow";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import FormField from "@/src/shared/ui/FormField/FormField";
import Notification from "@/src/shared/ui/Notification/Notification";
import PasswordRecoveryShell from "@/src/widgets/password-recovery-shell/ui/PasswordRecoveryShell";
import styles from "@/src/widgets/password-recovery-shell/ui/password-recovery-shell.module.css";
import TextField from "@/src/shared/ui/TextField/TextField";

type ResetPasswordPageProps = {
  onClose?: () => void;
  token: string;
};

type FeedbackState = {
  message: string;
  variant: "error" | "success";
} | null;

export default function ResetPasswordPage({
  onClose,
  token,
}: ResetPasswordPageProps) {
  const router = useRouter();
  const { t } = useI18n();
  const resolveHref = useLocalizedHref();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const resetPasswordMutation = useResetPasswordMutation();

  const trimmedToken = token.trim();
  const hasToken = trimmedToken.length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasToken) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({
        variant: "error",
        message: t("auth.resetPassword.errors.passwordMismatch"),
      });
      return;
    }

    setFeedback(null);
    resetPasswordMutation.reset();

    try {
      await resetPasswordMutation.mutateAsync({
        token: trimmedToken,
        newPassword,
      });

      setNewPassword("");
      setConfirmPassword("");
      setIsSuccess(true);
      setFeedback({
        variant: "success",
        message: t("auth.resetPassword.successMessage"),
      });
    } catch (error) {
      setFeedback({
        variant: "error",
        message: error instanceof Error ? error.message : t("auth.resetPassword.errors.generic"),
      });
    }
  };

  const derivedFeedback =
    feedback ??
    (!hasToken
      ? {
          variant: "error" as const,
          message: t("auth.resetPassword.errors.missingToken"),
        }
      : null);

  return (
    <PasswordRecoveryShell
      titleId="reset-password-title"
      title={t("auth.resetPassword.title")}
      subtitle={
        hasToken
          ? t("auth.resetPassword.subtitle")
          : t("auth.resetPassword.invalidLinkSubtitle")
      }
      onClose={onClose}
    >
      {derivedFeedback ? (
        <Notification
          variant={derivedFeedback.variant}
          size="small"
          message={derivedFeedback.message}
          onClose={feedback ? () => setFeedback(null) : undefined}
          closeLabel={t("common.close")}
          className={styles.notice}
        />
      ) : null}

      {isSuccess ? (
        <div className={styles.actions}>
          <Button
            text={t("auth.resetPassword.loginAction")}
            variant="primary"
            type="button"
            onClick={() =>
              openAuthModal(router, resolveHref, "login", { replace: true })
            }
          />
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <FormField
            className={styles.field}
            label={t("auth.resetPassword.newPasswordLabel")}
          >
            <TextField
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                if (feedback) {
                  setFeedback(null);
                }
                if (resetPasswordMutation.isError) {
                  resetPasswordMutation.reset();
                }
              }}
              autoComplete="new-password"
              required
              disabled={resetPasswordMutation.isPending || !hasToken}
              passwordToggle
              showPasswordLabel={t("common.password.show")}
              hidePasswordLabel={t("common.password.hide")}
            />
          </FormField>

          <FormField
            className={styles.field}
            label={t("auth.resetPassword.confirmPasswordLabel")}
          >
            <TextField
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (feedback) {
                  setFeedback(null);
                }
                if (resetPasswordMutation.isError) {
                  resetPasswordMutation.reset();
                }
              }}
              autoComplete="new-password"
              required
              disabled={resetPasswordMutation.isPending || !hasToken}
              passwordToggle
              showPasswordLabel={t("common.password.show")}
              hidePasswordLabel={t("common.password.hide")}
            />
          </FormField>

          <p className={styles.helperText}>{t("auth.resetPassword.passwordHint")}</p>

          <div className={styles.actions}>
            <Button
              text={
                resetPasswordMutation.isPending
                  ? t("auth.resetPassword.submitLoading")
                  : t("auth.resetPassword.submitButton")
              }
              variant="primary"
              type="submit"
              disabled={resetPasswordMutation.isPending || !hasToken}
              onClick={() => {}}
            />

            <button
              type="button"
              className={styles.actionLink}
              onClick={() =>
                openAuthModal(router, resolveHref, "login", { replace: true })
              }
            >
              {t("auth.resetPassword.backToLogin")}
            </button>
          </div>
        </form>
      )}
    </PasswordRecoveryShell>
  );
}
