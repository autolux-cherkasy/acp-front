"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useForgotPasswordMutation } from "@/src/features/auth/api/useAuthQueries";
import {
  closeAuthModal,
  openAuthModal,
} from "@/src/features/auth/model/auth-flow";
import { usePostAuthNavigation } from "@/src/features/auth";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { useServerToast } from "@/src/shared/lib/toast";
import GoogleAuthButton from "@/src/features/auth/google/ui/GoogleAuthButton";
import Button from "@/src/shared/ui/Button/Button";
import FormField from "@/src/shared/ui/FormField/FormField";
import TextField from "@/src/shared/ui/TextField/TextField";
import PasswordRecoveryShell from "@/src/widgets/password-recovery-shell/ui/PasswordRecoveryShell";
import styles from "@/src/widgets/password-recovery-shell/ui/password-recovery-shell.module.css";

type ForgotPasswordPageProps = {
  onClose?: () => void;
};

export default function ForgotPasswordPage({
  onClose,
}: ForgotPasswordPageProps) {
  const router = useRouter();
  const { t, raw } = useI18n();
  const resolveHref = useLocalizedHref();

  const { register, handleSubmit } = useForm({ defaultValues: { email: "" } });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const forgotPasswordMutation = useForgotPasswordMutation();
  const { notifyError, notifySuccess } = useServerToast();

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

    closeAuthModal(router, resolveHref);
  };

  const isBusy = forgotPasswordMutation.isPending || isGoogleLoading;
  const handlePostAuthSuccess = usePostAuthNavigation();

  const onSubmit = async ({ email }: { email: string }) => {
    forgotPasswordMutation.reset();

    try {
      const result = await forgotPasswordMutation.mutateAsync({ email: email.trim() });
      notifySuccess(result, t("common.toast.forgotPasswordSuccess"));
    } catch (error) {
      notifyError(error, t("common.toast.forgotPasswordError"));
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
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.formSection}>
          <FormField
            className={styles.field}
            label={t("auth.forgotPassword.emailLabel")}
            labelClassName={styles.label}
          >
            <TextField
              {...register("email", {
                onChange: () => { if (forgotPasswordMutation.isError) forgotPasswordMutation.reset(); },
              })}
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              disabled={forgotPasswordMutation.isPending}
              leadingAdornment={"/icons/Footer/email.svg"}
            />
          </FormField>
        </div>

        <div className={`${styles.actions} ${styles.compactActions}`}>
          <div className={styles.actionSection}>
            <Button
              text={
                forgotPasswordMutation.isPending
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
                  disabled={forgotPasswordMutation.isPending}
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
                onClick={() =>
                  openAuthModal(router, resolveHref, "login", { replace: true })
                }
              />
            </div>
          </div>
        </div>
      </form>
    </PasswordRecoveryShell>
  );
}
