"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { usePostAuthNavigation } from "@/src/features/auth";
import { useLoginMutation } from "@/src/features/auth/api/useAuthQueries";
import GoogleAuthButton from "@/src/features/auth/google/ui/GoogleAuthButton";
import {
  closeAuthModal,
  openAuthModal,
} from "@/src/features/auth/model/auth-flow";
import styles from "@/src/pages-layer/auth/ui/auth-page.module.css";
import {
  useI18n,
  useLocalizedHref,
} from "@/src/shared/i18n/I18nProvider";
import { useServerToast } from "@/src/shared/lib/toast";
import AuthShell from "@/src/shared/ui/AuthShell/AuthShell";
import Button from "@/src/shared/ui/Button/Button";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";

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
  const searchParams = useSearchParams();

  const { register, handleSubmit } = useForm<LoginFormData>({
    defaultValues: { identifier: "", password: "" },
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const loginMutation = useLoginMutation();
  const { notifyError, notifySuccess } = useServerToast();

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (!oauthError) return;

    notifyError(
      null,
      oauthError === "account_blocked"
        ? t("common.toast.userBlocked")
        : t("common.toast.loginError"),
    );

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("error");
    router.replace(
      `${window.location.pathname}${nextParams.toString() ? `?${nextParams}` : ""}`,
      { scroll: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseAuthFlow = () => {
    if (onClose) {
      onClose();
      return;
    }

    closeAuthModal(router, resolveHref);
  };

  const handlePostAuthSuccess = usePostAuthNavigation();

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.reset();

    try {
      const result = await loginMutation.mutateAsync(data);
      notifySuccess(result, t("common.toast.loginSuccess"));
      await handlePostAuthSuccess();
    } catch (error) {
      notifyError(error, t("common.toast.loginError"));
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

      <form className={styles.loginBlock} onSubmit={handleSubmit(onSubmit)}>
        <InputWithLabel
          label={t("auth.login.identifierLabel")}
          {...register("identifier", {
            onChange: () => { if (loginMutation.isError) loginMutation.reset(); },
          })}
          type="text"
          autoComplete="username"
          className={styles.loginInput}
          required
        />

        <div className={styles.loginPasswordGroup}>
          <InputWithLabel
            label={t("auth.login.passwordLabel")}
            {...register("password", {
              onChange: () => { if (loginMutation.isError) loginMutation.reset(); },
            })}
            type="password"
            autoComplete="current-password"
            className={styles.loginInput}
            required
            passwordToggle
            showPasswordLabel={t("common.password.show")}
            hidePasswordLabel={t("common.password.hide")}
          />

          <div className={styles.rowBetween}>
            <label className={styles.remember}>
              <input className={styles.rememberInput} type="checkbox" />
              <span className={styles.checkboxUi} aria-hidden="true" />
              <span className={styles.rememberText}>
                {t("auth.login.remember")}
              </span>
            </label>

            <button
              type="button"
              className={styles.forgot}
              onClick={() =>
                openAuthModal(router, resolveHref, "forgot-password", {
                  replace: true,
                })
              }
            >
              {t("auth.login.forgotPassword")}
            </button>
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
            size="full"
            disabled={isBusy}
            onClick={() => {}}
          />

          <Button
            text={t("auth.login.register")}
            variant="secondary"
            type="button"
            size="full"
            disabled={isBusy}
            onClick={() =>
              openAuthModal(router, resolveHref, "register", { replace: true })
            }
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
