"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "@/src/pages-layer/auth/ui/auth-page.module.css";
import { closeAuthRoute } from "@/src/features/auth/model/auth-flow";
import { login, usePostAuthNavigation } from "@/src/features/auth";
import LocaleLink from "@/src/shared/i18n/Link";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { setAccessToken } from "@/src/shared/api/session";
import Button from "@/src/shared/ui/Button/Button";
import TextField from "@/src/shared/ui/TextField/TextField";
import GoogleAuthButton from "@/src/features/auth/google/ui/GoogleAuthButton";
import Notification from "@/src/shared/ui/Notification/Notification";
import AuthShell from "@/src/shared/ui/AuthShell/AuthShell";

type LoginFormData = {
  identifier: string;
  password: string;
};

type LoginPageProps = {
  onClose?: () => void;
};

export default function LoginPage({ onClose }: LoginPageProps) {
  const router = useRouter();
  const { t } = useI18n();
  const resolveHref = useLocalizedHref();

  const [formData, setFormData] = useState<LoginFormData>({ identifier: "", password: "" });
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

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handlePostAuthSuccess = usePostAuthNavigation(handleCloseAuthFlow);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      const data = await login(formData);
      if (!data?.access_token) {
        throw new Error(t("auth.login.errors.missingToken"));
      }

      setAccessToken(data.access_token);
      await handlePostAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.login.errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const isBusy = isLoading || isGoogleLoading;
  const benefitItems = [
    t("auth.login.benefits.reserve"),
    t("auth.login.benefits.buy"),
    t("auth.login.benefits.manage"),
  ];

  return (
    <AuthShell
      logoAlt={t("header.logoAlt")}
      closeLabel={t("common.close")}
      brandDescription={t("auth.common.brandDesc")}
      promoItems={benefitItems}
      backgroundImage="/(auth)/login/login-bus.png"
      onClose={handleCloseAuthFlow}
      variant="login"
      reverse
      brandDescriptionClassName={styles.loginBrandDesc}
      cardClassName={styles.loginCard}
    >
          <h1 className={styles.loginTitle}>{t("auth.login.title")}</h1>

          <form className={styles.loginBlock} onSubmit={handleSubmit}>
            {error ? (
              <Notification
                variant="error"
                size="small"
                message={error}
                onClose={() => setError("")}
                closeLabel={t("common.close")}
                className={styles.loginNotice}
              />
            ) : null}

            <label className={styles.field}>
              <span className={styles.label}>{t("auth.login.identifierLabel")}</span>
              <TextField
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                autoComplete="username"
                className={styles.loginInput}
                required
              />
            </label>

            <div className={styles.loginPasswordGroup}>
              <div className={styles.field}>
                <span className={styles.label}>{t("auth.login.passwordLabel")}</span>
                <TextField
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={styles.loginInput}
                  required
                  passwordToggle
                  showPasswordLabel={t("common.password.show")}
                  hidePasswordLabel={t("common.password.hide")}
                />
              </div>

              <div className={styles.rowBetween}>
                <label className={styles.remember}>
                  <input className={styles.rememberInput} type="checkbox" />
                  <span className={styles.checkboxUi} aria-hidden="true" />
                  <span className={styles.rememberText}>{t("auth.login.remember")}</span>
                </label>

                <LocaleLink className={styles.forgot} href="/forgot-password">
                  {t("auth.login.forgotPassword")}
                </LocaleLink>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <Button
                text={isLoading ? t("auth.login.submitLoading") : t("auth.login.submit")}
                variant="primary"
                type="submit"
                disabled={isBusy}
                onClick={() => {}}
              />

              <Button
                text={t("auth.login.register")}
                variant="secondary"
                type="button"
                disabled={isBusy}
                onClick={() => router.replace(resolveHref("/register"))}
              />
            </div>

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
          </form>
    </AuthShell>
  );
}
