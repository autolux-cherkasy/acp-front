"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useResetPasswordMutation } from "@/src/features/auth/api/useAuthQueries";
import { openAuthModal } from "@/src/features/auth/model/auth-flow";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { useServerToast } from "@/src/shared/lib/toast";
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

export default function ResetPasswordPage({
  onClose,
  token,
}: ResetPasswordPageProps) {
  const router = useRouter();
  const { t } = useI18n();
  const resolveHref = useLocalizedHref();

  const { register, handleSubmit, setError, clearErrors, reset, formState: { errors } } =
    useForm({ defaultValues: { newPassword: "", confirmPassword: "" } });
  const [isSuccess, setIsSuccess] = useState(false);
  const resetPasswordMutation = useResetPasswordMutation();
  const { notifyError, notifySuccess } = useServerToast();

  const trimmedToken = token.trim();
  const hasToken = trimmedToken.length > 0;

  const onSubmit = async ({ newPassword, confirmPassword }: { newPassword: string; confirmPassword: string }) => {
    if (!hasToken) return;

    if (newPassword !== confirmPassword) {
      setError("root", { message: t("auth.resetPassword.errors.passwordMismatch") });
      return;
    }

    clearErrors("root");
    resetPasswordMutation.reset();

    try {
      const result = await resetPasswordMutation.mutateAsync({
        token: trimmedToken,
        newPassword,
      });

      reset();
      setIsSuccess(true);
      notifySuccess(result, t("common.toast.resetPasswordSuccess"));
    } catch (error) {
      notifyError(error, t("common.toast.resetPasswordError"));
    }
  };

  const feedbackMessage = errors.root?.message ?? (!hasToken ? t("auth.resetPassword.errors.missingToken") : null);
  const derivedFeedback = feedbackMessage ? { variant: "error" as const, message: feedbackMessage } : null;

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
          onClose={errors.root ? () => clearErrors("root") : undefined}
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
            size="full"
            onClick={() =>
              openAuthModal(router, resolveHref, "login", { replace: true })
            }
          />
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <FormField
            className={styles.field}
            label={t("auth.resetPassword.newPasswordLabel")}
          >
            <TextField
              {...register("newPassword", {
                onChange: () => {
                  clearErrors("root");
                  if (resetPasswordMutation.isError) resetPasswordMutation.reset();
                },
              })}
              type="password"
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
              {...register("confirmPassword", {
                onChange: () => {
                  clearErrors("root");
                  if (resetPasswordMutation.isError) resetPasswordMutation.reset();
                },
              })}
              type="password"
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
              size="full"
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
