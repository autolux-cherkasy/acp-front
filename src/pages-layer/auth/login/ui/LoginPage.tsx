"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { usePostAuthNavigation } from "@/src/features/auth";
import { useLoginMutation } from "@/src/features/auth/api/useAuthQueries";
import GoogleAuthButton from "@/src/features/auth/google/ui/GoogleAuthButton";
import { closeAuthRoute } from "@/src/features/auth/model/auth-flow";
import styles from "@/src/pages-layer/auth/ui/auth-page.module.css";
import { setAccessToken } from "@/src/shared/api/session";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import LocaleLink from "@/src/shared/i18n/Link";
import AuthShell from "@/src/shared/ui/AuthShell/AuthShell";
import Button from "@/src/shared/ui/Button/Button";
import Notification from "@/src/shared/ui/Notification/Notification";
import TextField from "@/src/shared/ui/TextField/TextField";

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

  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    password: "",
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const loginMutation = useLoginMutation(setAccessToken);

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
    if (loginMutation.isError) loginMutation.reset();
  };

  const handlePostAuthSuccess = usePostAuthNavigation(handleCloseAuthFlow);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.reset();

    try {
      loginMutation.mutate(formData);
      await handlePostAuthSuccess();
    } catch (_) {
      //mutation handles errors
    }
  };

  const isBusy = loginMutation.isPending || isGoogleLoading;
  const promoItems = [
    t("auth.login.benefits.reserve"),
    t("auth.login.benefits.buy"),
    t("auth.login.benefits.manage"),
  ];

  return (
    <AuthShell
      logoAlt={t("header.logoAlt")}
      closeLabel={t("common.close")}
      brandDescription={t("auth.common.brandDesc")}
      promoItems={promoItems}
      backgroundImage="/(auth)/login/login-bus.png"
      onClose={handleCloseAuthFlow}
      variant="login"
      reverse
      brandDescriptionClassName={styles.loginBrandDesc}
      promoClassName={styles.loginTextBlock}
      cardClassName={styles.loginCard}
    >
      <h1 className={styles.loginTitle}>{t("auth.login.title")}</h1>

      <form className={styles.loginBlock} onSubmit={handleSubmit}>
        {loginMutation.isError ? (
          <Notification
            variant="error"
            size="small"
            message={loginMutation.error.message}
            onClose={() => loginMutation.reset()}
            closeLabel={t("common.close")}
            className={styles.loginNotice}
          />
        ) : null}

        <label className={styles.field}>
          <span className={styles.label}>
            {t("auth.login.identifierLabel")}
          </span>
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
            <span className={styles.label}>
              {t("auth.login.passwordLabel")}
            </span>
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
              <span className={styles.rememberText}>
                {t("auth.login.remember")}
              </span>
            </label>

            <LocaleLink className={styles.forgot} href="/forgot-password">
              {t("auth.login.forgotPassword")}
            </LocaleLink>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <Button
            text={
              loginMutation.isPending
                ? t("auth.login.submitLoading")
                : t("auth.login.submit")
            }
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
            disabled={loginMutation.isPending}
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
