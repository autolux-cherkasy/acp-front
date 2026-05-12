"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { changePassword, getProfile, updateProfile } from "@/src/entities/user";
import { hasAccessToken } from "@/src/shared/api/session";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import LocaleLink from "@/src/shared/i18n/Link";
import Button from "@/src/shared/ui/Button/Button";
import styles from "./profile-page.module.css";
import ProfileWrapper from "./ProfileWrapper";

const PHONE_PATTERN = /^\+380\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ProfileFormData = {
  name: string;
  phone: string;
  email: string;
  currentPassword: string;
  newPassword: string;
};

type PersistedProfileFields = Pick<ProfileFormData, "name" | "phone" | "email">;

const EMPTY_FORM: ProfileFormData = {
  name: "",
  phone: "",
  email: "",
  currentPassword: "",
  newPassword: "",
};

function shouldRequireLogin(message: string) {
  const normalizedMessage = message.trim().toLowerCase();

  if (
    normalizedMessage.includes("failed to fetch") ||
    normalizedMessage.includes("network") ||
    normalizedMessage.includes("next_public_api_url")
  ) {
    return false;
  }

  return !hasAccessToken();
}

export default function ProfilePage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState<ProfileFormData>(EMPTY_FORM);
  const [initialValues, setInitialValues] = useState<PersistedProfileFields>({
    name: "",
    phone: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);
      setError("");
      setSuccess("");
      setRequiresLogin(false);

      try {
        const profile = await getProfile();

        if (isCancelled) return;

        const nextValues = {
          name: profile.name ?? "",
          phone: profile.phone ?? "",
          email: profile.email ?? "",
        };

        setInitialValues(nextValues);
        setFormData((prev) => ({
          ...prev,
          ...nextValues,
          currentPassword: "",
          newPassword: "",
        }));
      } catch (err) {
        if (isCancelled) return;

        const message =
          err instanceof Error ? err.message : t("profile.page.errors.load");
        setError(message);
        setRequiresLogin(shouldRequireLogin(message));
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, [reloadKey, t]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedEmail = formData.email.trim();
    const wantsPasswordChange = Boolean(
      formData.currentPassword || formData.newPassword,
    );

    if (!trimmedName || trimmedName.length < 2) {
      setError(t("profile.page.errors.nameMin"));
      return;
    }

    if (!PHONE_PATTERN.test(trimmedPhone)) {
      setError(t("profile.page.errors.phoneFormat"));
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError(t("profile.page.errors.emailInvalid"));
      return;
    }

    if (wantsPasswordChange) {
      if (!formData.currentPassword || !formData.newPassword) {
        setError(t("profile.page.errors.passwordBothRequired"));
        return;
      }

      if (formData.newPassword.length < 6) {
        setError(t("profile.page.errors.passwordMin"));
        return;
      }

      if (formData.currentPassword === formData.newPassword) {
        setError(t("profile.page.errors.passwordSame"));
        return;
      }
    }

    const profilePayload: {
      email?: string;
      name?: string;
      phone?: string;
    } = {};

    if (trimmedName !== initialValues.name) {
      profilePayload.name = trimmedName;
    }

    if (trimmedPhone !== initialValues.phone) {
      profilePayload.phone = trimmedPhone;
    }

    if (trimmedEmail !== initialValues.email) {
      profilePayload.email = trimmedEmail;
    }

    const hasProfileChanges = Object.keys(profilePayload).length > 0;

    if (!hasProfileChanges && !wantsPasswordChange) {
      setSuccess(t("profile.page.messages.noChanges"));
      return;
    }

    setIsSaving(true);

    const successMessages: string[] = [];
    const failureMessages: string[] = [];

    if (hasProfileChanges) {
      try {
        const response = await updateProfile(profilePayload);
        const nextValues = {
          name: response.user.name ?? "",
          phone: response.user.phone ?? "",
          email: response.user.email ?? "",
        };

        setInitialValues(nextValues);
        setFormData((prev) => ({
          ...prev,
          ...nextValues,
        }));
        successMessages.push(response.message);
      } catch (err) {
        failureMessages.push(
          err instanceof Error
            ? err.message
            : t("profile.page.errors.updateProfile"),
        );
      }
    }

    if (wantsPasswordChange) {
      try {
        const response = await changePassword({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });

        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
        successMessages.push(response.message);
      } catch (err) {
        failureMessages.push(
          err instanceof Error
            ? err.message
            : t("profile.page.errors.changePassword"),
        );
      }
    }

    setIsSaving(false);

    if (successMessages.length > 0) {
      setSuccess(successMessages.join(" "));
    }

    if (failureMessages.length > 0) {
      const combinedMessage = failureMessages.join(" ");
      setError(combinedMessage);
      setRequiresLogin(shouldRequireLogin(combinedMessage));
    }
  };

  const retryLoad = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <ProfileWrapper mode="profile">
      <section className={styles.card} aria-labelledby="profile-title">
        <h1 id="profile-title" className={styles.title}>
          {t("profile.page.title")}
        </h1>
        {error ? (
          <div
            className={`${styles.notice} ${styles.noticeError}`}
            role="alert"
          >
            <span>{error}</span>

            {!isLoading ? (
              <button
                type="button"
                className={styles.noticeAction}
                onClick={retryLoad}
              >
                {t("profile.page.actions.retry")}
              </button>
            ) : null}
          </div>
        ) : null}

        {success ? (
          <div
            className={`${styles.notice} ${styles.noticeSuccess}`}
            role="status"
          >
            {success}
          </div>
        ) : null}

        {requiresLogin && !isLoading ? (
          <div className={styles.loginState}>
            <p className={styles.loginStateText}>
              {t("profile.page.messages.sessionInactive")}
            </p>
            <LocaleLink href="/login" className={styles.loginStateButton}>
              {t("profile.page.actions.login")}
            </LocaleLink>
          </div>
        ) : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.name")}
              </span>
              <input
                className={styles.input}
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("profile.page.placeholders.name")}
                autoComplete="name"
                disabled={isLoading || isSaving || requiresLogin}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.phone")}
              </span>
              <input
                className={styles.input}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+380XXXXXXXXX"
                autoComplete="tel"
                disabled={isLoading || isSaving || requiresLogin}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.emailConfirm")}
              </span>
              <input
                className={styles.input}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                autoComplete="email"
                disabled={isLoading || isSaving || requiresLogin}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.currentPassword")}
              </span>
              <span className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder={t("profile.page.placeholders.currentPassword")}
                  autoComplete="current-password"
                  disabled={isLoading || isSaving || requiresLogin}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  aria-label={
                    showCurrentPassword
                      ? t("common.password.hide")
                      : t("common.password.show")
                  }
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  disabled={isLoading || isSaving || requiresLogin}
                >
                  <Image
                    src={
                      showCurrentPassword
                        ? "/icons/eye-open.svg"
                        : "/icons/eye-off-light.svg"
                    }
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                  />
                </button>
              </span>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.newPassword")}
              </span>
              <span className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder={t("profile.page.placeholders.newPassword")}
                  autoComplete="new-password"
                  disabled={isLoading || isSaving || requiresLogin}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  aria-label={
                    showNewPassword
                      ? t("common.password.hide")
                      : t("common.password.show")
                  }
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  disabled={isLoading || isSaving || requiresLogin}
                >
                  <Image
                    src={
                      showNewPassword
                        ? "/icons/eye-open.svg"
                        : "/icons/eye-off-light.svg"
                    }
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                  />
                </button>
              </span>
            </label>
          </div>

          <div className={styles.submitButtonWrap}>
            <Button
              type="submit"
              variant="primary"
              text={
                isLoading
                  ? t("profile.page.actions.loading")
                  : isSaving
                    ? t("profile.page.actions.saving")
                    : t("profile.page.actions.save")
              }
              disabled={isLoading || isSaving || requiresLogin}
              onClick={() => {}}
            />
          </div>
        </form>
      </section>
    </ProfileWrapper>
  );
}
