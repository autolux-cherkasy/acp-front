"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import styles from "@/src/pages-layer/auth/ui/auth-page.module.css";
import { useRegisterMutation, useResendConfirmMutation, useVerifyEmailOtpMutation } from "@/src/features/auth/api/useAuthQueries";
import { closeAuthModal, openAuthModal } from "@/src/features/auth/model/auth-flow";
import { usePostAuthNavigation } from "@/src/features/auth";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { useServerToast } from "@/src/shared/lib/toast";
import Button from "@/src/shared/ui/Button/Button";
import FormField from "@/src/shared/ui/FormField/FormField";
import TextField from "@/src/shared/ui/TextField/TextField";
import GoogleAuthButton from "@/src/features/auth/google/ui/GoogleAuthButton";
import Notification from "@/src/shared/ui/Notification/Notification";
import AuthShell from "@/src/shared/ui/AuthShell/AuthShell";
import { ApiError } from "@/src/shared/api/http";
import {
  EMAIL_MAX_LENGTH,
  mapRegisterServerError,
  PASSWORD_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  sanitizeRegisterFieldInput,
  validateRegisterField,
  type RegisterField,
  type RegisterFormData,
} from "../model/validation";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import EmailConfirmationModal from "@/src/features/email-confirmation/ui/EmailConfirmationModal";

type RegisterPageProps = {
  onClose?: () => void;
};

export default function RegisterPage({ onClose }: RegisterPageProps) {
  const router = useRouter();
  const { t } = useI18n();
  const resolveHref = useLocalizedHref();
  // const verifyOpt = useVerifyEmailOtpMutation()
  const emailConfirmModal = useDisclosure<string>()
  const resendConfirm = useResendConfirmMutation()

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    getValues,
    formState: { errors: fieldErrors },
  } = useForm<RegisterFormData>({
    defaultValues: { phone: "", email: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const registerMutation = useRegisterMutation();
  const { notifySuccess } = useServerToast();

  const handleCloseAuthFlow = () => {
    if (onClose) {
      onClose();
      return;
    }

    closeAuthModal(router, resolveHref);
  };

  function makeSanitizedOnChange(
    field: RegisterField,
    rhfOnChange: React.ChangeEventHandler<HTMLInputElement>,
  ) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = sanitizeRegisterFieldInput(field, e.target.value);
      void rhfOnChange(e);
      if (error) setError("");
      if (registerMutation.isError) registerMutation.reset();
    };
  }

  const handlePostAuthSuccess = usePostAuthNavigation();

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    registerMutation.reset();

    try {
      const result = await registerMutation.mutateAsync({
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone.trim(),
      });
      notifySuccess(result, t("common.toast.registerSuccess"));

      emailConfirmModal.open(data.email.trim())
      // openAuthModal(router, resolveHref, "login", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      const status = err instanceof ApiError ? err.status : undefined;
      const { fieldErrors: nextFieldErrors, formError } = mapRegisterServerError(
        message,
        t,
        status,
      );

      for (const [field, msg] of Object.entries(nextFieldErrors)) {
        setFieldError(field as RegisterField, { message: msg });
      }
      setError(formError);
    }
  };

  const phoneReg = register("phone", {
    validate: (v) => validateRegisterField("phone", { ...getValues(), phone: v }, t) || true,
  });
  const emailReg = register("email", {
    validate: (v) => validateRegisterField("email", { ...getValues(), email: v }, t) || true,
  });
  const passwordReg = register("password", {
    validate: (v) => validateRegisterField("password", { ...getValues(), password: v }, t) || true,
  });
  const confirmPasswordReg = register("confirmPassword", {
    validate: (v) =>
      validateRegisterField("confirmPassword", { ...getValues(), confirmPassword: v }, t) || true,
  });

  const isBusy = registerMutation.isPending || isGoogleLoading;
  const promoItems = [
    t("auth.common.promo.one"),
    t("auth.common.promo.two"),
    t("auth.common.promo.three"),
  ];

  return (
    <AuthShell
      logoAlt={t("header.logoAlt")}
      closeLabel={t("common.close")}
      brandDescription={t("auth.common.brandDesc")}
      promoItems={promoItems}
      backgroundImage="/(auth)/register/register-bus.jpg"
      onClose={handleCloseAuthFlow}
      variant="register"
      brandDescriptionClassName={styles.registerBrandDesc}
      promoClassName={styles.registerTextBlock}
      cardClassName={styles.registerCard}
    >
      <h1 className={styles.registerTitle}>{t("auth.register.title")}</h1>

      {error ? (
        <Notification
          variant="error"
          size="small"
          message={error}
          onClose={() => setError("")}
          closeLabel={t("common.close")}
          className={styles.registerInlineToast}
        />
      ) : null}

      <form className={styles.registerBlock} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          className={styles.field}
          label={t("auth.register.phoneLabel")}
          error={fieldErrors.phone?.message}
          errorId="register-phone-error"
        >
          <TextField
            {...phoneReg}
            onChange={makeSanitizedOnChange("phone", phoneReg.onChange)}
            type="text"
            placeholder="+380991234567"
            autoComplete="tel"
            inputMode="tel"
            maxLength={PHONE_MAX_LENGTH}
            required
            aria-invalid={fieldErrors.phone ? "true" : "false"}
            aria-describedby={fieldErrors.phone ? "register-phone-error" : undefined}
            className={fieldErrors.phone ? styles.fieldControlInvalid : undefined}
          />
        </FormField>

        <FormField
          className={styles.field}
          label={t("auth.register.emailLabel")}
          error={fieldErrors.email?.message}
          errorId="register-email-error"
        >
          <TextField
            {...emailReg}
            onChange={makeSanitizedOnChange("email", emailReg.onChange)}
            type="text"
            placeholder="name@example.com"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            inputMode="email"
            maxLength={EMAIL_MAX_LENGTH}
            spellCheck={false}
            required
            aria-invalid={fieldErrors.email ? "true" : "false"}
            aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
            className={fieldErrors.email ? styles.fieldControlInvalid : undefined}
          />
        </FormField>

        <FormField
          className={styles.field}
          label={t("auth.register.passwordLabel")}
          error={fieldErrors.password?.message}
          errorId="register-password-error"
        >
          <TextField
            {...passwordReg}
            onChange={makeSanitizedOnChange("password", passwordReg.onChange)}
            type="password"
            autoComplete="new-password"
            maxLength={PASSWORD_MAX_LENGTH}
            required
            passwordToggle
            showPasswordLabel={t("common.password.show")}
            hidePasswordLabel={t("common.password.hide")}
            aria-invalid={fieldErrors.password ? "true" : "false"}
            aria-describedby={fieldErrors.password ? "register-password-error" : undefined}
            className={fieldErrors.password ? styles.fieldControlInvalid : undefined}
          />
        </FormField>

        <div className={styles.passwordBlock}>
          <FormField
            className={styles.field}
            label={t("auth.register.confirmPasswordLabel")}
            error={fieldErrors.confirmPassword?.message}
            errorId="register-confirm-password-error"
          >
            <TextField
              {...confirmPasswordReg}
              onChange={makeSanitizedOnChange("confirmPassword", confirmPasswordReg.onChange)}
              type="password"
              autoComplete="new-password"
              maxLength={PASSWORD_MAX_LENGTH}
              required
              passwordToggle
              showPasswordLabel={t("common.password.show")}
              hidePasswordLabel={t("common.password.hide")}
              aria-invalid={fieldErrors.confirmPassword ? "true" : "false"}
              aria-describedby={
                fieldErrors.confirmPassword ? "register-confirm-password-error" : undefined
              }
              className={fieldErrors.confirmPassword ? styles.fieldControlInvalid : undefined}
            />
          </FormField>

          <div className={styles.hint}>{t("auth.register.passwordHint")}</div>
        </div>

        <div className={styles.registerActions}>
          <div className={styles.buttonRegister}>
            <Button
              text={
                registerMutation.isPending
                  ? t("auth.register.submitLoading")
                  : t("auth.register.submit")
              }
              variant="primary"
              type="submit"
              size="full"
              disabled={isBusy}
              onClick={() => {}}
            />
          </div>

          <div className={styles.registerFooterRow}>
            <div className={styles.socialRowRegister}>
              <GoogleAuthButton
                intent="register"
                disabled={registerMutation.isPending}
                onBusyChange={setIsGoogleLoading}
                onSuccess={() => {
                  void handlePostAuthSuccess();
                }}
              />
            </div>

            <button
              className={styles.underLink}
              type="button"
              onClick={() => openAuthModal(router, resolveHref, "login", { replace: true })}
            >
              {t("auth.register.existingAccount")}
            </button>
          </div>
        </div>

        {emailConfirmModal.isOpen && emailConfirmModal.data && (
        <EmailConfirmationModal
          context="registration"
          onClose={emailConfirmModal.close}
          onResend={() => {
            if (typeof emailConfirmModal.data === "string") {
               resendConfirm.mutate({ email: emailConfirmModal.data });
            }
          }}
          email={emailConfirmModal.data}
          onChangeEmail={emailConfirmModal.close}
          onConfirm={async() => {await handlePostAuthSuccess();}}
        />
      )}
      </form>
    </AuthShell>
  );
}
