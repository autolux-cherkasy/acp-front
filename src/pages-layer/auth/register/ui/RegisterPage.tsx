"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "@/src/pages-layer/auth/ui/auth-page.module.css";
import { closeAuthRoute } from "@/src/features/auth/model/auth-flow";
import { register, usePostAuthNavigation } from "@/src/features/auth";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import FormField from "@/src/shared/ui/FormField/FormField";
import TextField from "@/src/shared/ui/TextField/TextField";
import GoogleAuthButton from "@/src/features/auth/google/ui/GoogleAuthButton";
import Notification from "@/src/shared/ui/Notification/Notification";
import AuthShell from "@/src/shared/ui/AuthShell/AuthShell";
import {
  EMAIL_MAX_LENGTH,
  mapRegisterServerError,
  PASSWORD_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  sanitizeRegisterFieldInput,
  type RegisterField,
  type RegisterFieldErrors,
  type RegisterFormData,
  validateRegisterForm,
} from "../model/validation";

type RegisterPageProps = {
  onClose?: () => void;
};

export default function RegisterPage({ onClose }: RegisterPageProps) {
  const router = useRouter();
  const { t } = useI18n();
  const resolveHref = useLocalizedHref();

  const [formData, setFormData] = useState<RegisterFormData>({
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<RegisterField, boolean>>
  >({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleCloseAuthFlow = () => {
    if (onClose) {
      onClose();
      return;
    }

    closeAuthRoute(router);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!["phone", "email", "password", "confirmPassword"].includes(name)) {
      return;
    }

    const field = name as RegisterField;
    const sanitizedValue = sanitizeRegisterFieldInput(field, value);

    setFormData((prev) => {
      const nextFormData = { ...prev, [field]: sanitizedValue };
      const hasTouchedFields = Object.keys(touchedFields).length > 0;

      if (hasTouchedFields) {
        setFieldErrors(validateRegisterForm(nextFormData, t));
      } else {
        setFieldErrors({});
      }

      return nextFormData;
    });

    if (error) {
      setError("");
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const field = event.target.name as RegisterField;

    if (!["phone", "email", "password", "confirmPassword"].includes(field)) {
      return;
    }

    const nextFormData = {
      ...formData,
      [field]: sanitizeRegisterFieldInput(field, event.target.value),
    };

    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    setFieldErrors(validateRegisterForm(nextFormData, t));
  };

  const handlePostAuthSuccess = usePostAuthNavigation(handleCloseAuthFlow);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const normalizedFormData: RegisterFormData = {
      ...formData,
      email,
      phone,
    };
    const validationErrors = validateRegisterForm(normalizedFormData, t);

    if (Object.keys(validationErrors).length > 0) {
      setTouchedFields({
        phone: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      setFieldErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone,
      });

      router.replace(resolveHref("/login"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      const { fieldErrors: nextFieldErrors, formError } =
        mapRegisterServerError(message, t);

      setFieldErrors(nextFieldErrors);
      setTouchedFields({
        phone: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      setError(formError);
    } finally {
      setIsLoading(false);
    }
  };

  const isBusy = isLoading || isGoogleLoading;
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
      promoItemClassName={styles.registerTextLine}
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

      <form className={styles.registerBlock} onSubmit={handleSubmit} noValidate>
        <FormField
          className={styles.field}
          label={t("auth.register.phoneLabel")}
          error={fieldErrors.phone}
          errorId="register-phone-error"
        >
          <TextField
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+380991234567"
            autoComplete="tel"
            inputMode="tel"
            maxLength={PHONE_MAX_LENGTH}
            required
            onBlur={handleBlur}
            aria-invalid={fieldErrors.phone ? "true" : "false"}
            aria-describedby={
              fieldErrors.phone ? "register-phone-error" : undefined
            }
            className={
              fieldErrors.phone ? styles.fieldControlInvalid : undefined
            }
          />
        </FormField>

        <FormField
          className={styles.field}
          label={t("auth.register.emailLabel")}
          error={fieldErrors.email}
          errorId="register-email-error"
        >
          <TextField
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            inputMode="email"
            maxLength={EMAIL_MAX_LENGTH}
            spellCheck={false}
            required
            onBlur={handleBlur}
            aria-invalid={fieldErrors.email ? "true" : "false"}
            aria-describedby={
              fieldErrors.email ? "register-email-error" : undefined
            }
            className={
              fieldErrors.email ? styles.fieldControlInvalid : undefined
            }
          />
        </FormField>

        <FormField
          className={styles.field}
          label={t("auth.register.passwordLabel")}
          error={fieldErrors.password}
          errorId="register-password-error"
        >
          <TextField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            maxLength={PASSWORD_MAX_LENGTH}
            required
            passwordToggle
            showPasswordLabel={t("common.password.show")}
            hidePasswordLabel={t("common.password.hide")}
            onBlur={handleBlur}
            aria-invalid={fieldErrors.password ? "true" : "false"}
            aria-describedby={
              fieldErrors.password ? "register-password-error" : undefined
            }
            className={
              fieldErrors.password ? styles.fieldControlInvalid : undefined
            }
          />
        </FormField>

        <div className={styles.passwordBlock}>
          <FormField
            className={styles.field}
            label={t("auth.register.confirmPasswordLabel")}
            error={fieldErrors.confirmPassword}
            errorId="register-confirm-password-error"
          >
            <TextField
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              maxLength={PASSWORD_MAX_LENGTH}
              required
              passwordToggle
              showPasswordLabel={t("common.password.show")}
              hidePasswordLabel={t("common.password.hide")}
              onBlur={handleBlur}
              aria-invalid={fieldErrors.confirmPassword ? "true" : "false"}
              aria-describedby={
                fieldErrors.confirmPassword
                  ? "register-confirm-password-error"
                  : undefined
              }
              className={
                fieldErrors.confirmPassword
                  ? styles.fieldControlInvalid
                  : undefined
              }
            />
          </FormField>

          <div className={styles.hint}>{t("auth.register.passwordHint")}</div>
        </div>

        <div className={styles.registerActions}>
          <div className={styles.buttonRegister}>
            <Button
              text={
                isLoading
                  ? t("auth.register.submitLoading")
                  : t("auth.register.submit")
              }
              variant="primary"
              type="submit"
              disabled={isBusy}
              onClick={() => {}}
            />
          </div>

          <div className={styles.registerFooterRow}>
            <div className={styles.socialRowRegister}>
              <GoogleAuthButton
                intent="register"
                disabled={isLoading}
                onBusyChange={setIsGoogleLoading}
                onSuccess={() => {
                  void handlePostAuthSuccess();
                }}
              />
            </div>

            <button
              className={styles.underLink}
              type="button"
              onClick={() => router.replace(resolveHref("/login"))}
            >
              {t("auth.register.existingAccount")}
            </button>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
