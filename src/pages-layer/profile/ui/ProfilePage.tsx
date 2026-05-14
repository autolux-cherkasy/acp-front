"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { changePassword, getProfile, updateProfile } from "@/src/entities/user";
import { ApiError } from "@/src/shared/api/http";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import LocaleLink from "@/src/shared/i18n/Link";
import Button from "@/src/shared/ui/Button/Button";
import {
  buildProfilePayload,
  createProfileValidationRules,
  EMPTY_PROFILE_FORM,
  hasPasswordChange,
  normalizeProfileFormData,
  type ProfileFormData,
} from "../model/validation";
import styles from "./profile-page.module.css";
import ProfileWrapper from "./ProfileWrapper";

function shouldRequireLogin(error: unknown) {
  if (error instanceof ApiError) {
    return error.status === 401;
  }

  const message = error instanceof Error ? error.message : "";
  const normalizedMessage = message.trim().toLowerCase();

  return (
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("forbidden") ||
    normalizedMessage.includes("token") ||
    normalizedMessage.includes("session")
  );
}

export default function ProfilePage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [profileEmail, setProfileEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    getValues,
    formState: { errors: fieldErrors, isDirty, dirtyFields, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: EMPTY_PROFILE_FORM,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const validationRules = createProfileValidationRules(t, getValues);

  const isFormDisabled = isLoading || isSubmitting || requiresLogin;

  const clearNotices = () => {
    if (serverError) {
      setServerError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);
      setServerError("");
      setSuccessMessage("");
      setRequiresLogin(false);

      try {
        const profile = await getProfile();

        if (isCancelled) {
          return;
        }

        reset({
          name: profile.name ?? "",
          phone: profile.phone ?? "",
          newPassword: "",
          confirmPassword: "",
        });
        setProfileEmail(profile.email ?? "");
      } catch (err) {
        if (isCancelled) {
          return;
        }

        const message =
          err instanceof Error ? err.message : t("profile.page.errors.load");
        setServerError(message);
        setRequiresLogin(shouldRequireLogin(err));
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
  }, [reloadKey, reset, t]);

  const registerInput = (
    field: keyof ProfileFormData,
    options?: Parameters<typeof register>[1],
  ) =>
    register(field, {
      ...options,
      onChange: () => {
        clearNotices();

        if (field === "newPassword" || field === "confirmPassword") {
          clearErrors(["newPassword", "confirmPassword"]);
          return;
        }

        clearErrors(field);
      },
    });

  const onSubmit: SubmitHandler<ProfileFormData> = async (submittedData) => {
    setServerError("");
    setSuccessMessage("");

    const normalizedData = normalizeProfileFormData(submittedData);
    const wantsPasswordChange = hasPasswordChange(
      normalizedData.newPassword,
      normalizedData.confirmPassword,
    );
    const profilePayload = buildProfilePayload(normalizedData, dirtyFields);

    const hasProfileChanges = Object.keys(profilePayload).length > 0;

    if (!hasProfileChanges && !wantsPasswordChange) {
      setSuccessMessage(t("profile.page.messages.noChanges"));
      return;
    }

    const successMessages: string[] = [];
    const failureMessages: string[] = [];
    let nextProfileDefaults: Pick<ProfileFormData, "name" | "phone"> | null =
      null;
    let didUpdateProfile = false;
    let didChangePassword = false;

    if (hasProfileChanges) {
      try {
        const response = await updateProfile(profilePayload);

        nextProfileDefaults = {
          name: response.user.name ?? "",
          phone: response.user.phone ?? "",
        };
        setProfileEmail(response.user.email ?? "");
        didUpdateProfile = true;
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
          password: normalizedData.newPassword,
          confirmPassword: normalizedData.confirmPassword,
        });

        didChangePassword = true;
        successMessages.push(response.message);
      } catch (err) {
        failureMessages.push(
          err instanceof Error
            ? err.message
            : t("profile.page.errors.changePassword"),
        );
      }
    }

    if (didUpdateProfile && nextProfileDefaults) {
      reset({
        ...nextProfileDefaults,
        newPassword:
          wantsPasswordChange && !didChangePassword
            ? normalizedData.newPassword
            : "",
        confirmPassword:
          wantsPasswordChange && !didChangePassword
            ? normalizedData.confirmPassword
            : "",
      });
    } else if (didChangePassword) {
      reset({
        ...normalizedData,
        newPassword: "",
        confirmPassword: "",
      });
    }

    if (successMessages.length > 0) {
      setSuccessMessage(successMessages.join(" "));
    }

    if (failureMessages.length > 0) {
      setServerError(failureMessages.join(" "));
      setRequiresLogin(
        failureMessages.some((message) =>
          shouldRequireLogin(new Error(message)),
        ),
      );
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
        {serverError ? (
          <div
            className={`${styles.notice} ${styles.noticeError}`}
            role="alert"
          >
            <span>{serverError}</span>

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

        {successMessage ? (
          <div
            className={`${styles.notice} ${styles.noticeSuccess}`}
            role="status"
          >
            {successMessage}
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

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.name")}
              </span>
              <input
                type="text"
                placeholder={t("profile.page.placeholders.name")}
                autoComplete="name"
                aria-invalid={fieldErrors.name ? "true" : "false"}
                aria-describedby={
                  fieldErrors.name ? "profile-name-error" : undefined
                }
                className={`${styles.input} ${
                  fieldErrors.name ? styles.inputInvalid : ""
                }`}
                disabled={isFormDisabled}
                {...registerInput("name", validationRules.name)}
              />
              {fieldErrors.name?.message ? (
                <span
                  id="profile-name-error"
                  className={styles.fieldError}
                  role="alert"
                >
                  {fieldErrors.name.message}
                </span>
              ) : null}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.phone")}
              </span>
              <input
                type="tel"
                placeholder="+380XXXXXXXXX"
                autoComplete="tel"
                aria-invalid={fieldErrors.phone ? "true" : "false"}
                aria-describedby={
                  fieldErrors.phone ? "profile-phone-error" : undefined
                }
                className={`${styles.input} ${
                  fieldErrors.phone ? styles.inputInvalid : ""
                }`}
                disabled={isFormDisabled}
                {...registerInput("phone", validationRules.phone)}
              />
              {fieldErrors.phone?.message ? (
                <span
                  id="profile-phone-error"
                  className={styles.fieldError}
                  role="alert"
                >
                  {fieldErrors.phone.message}
                </span>
              ) : null}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.emailConfirm")}
              </span>
              <input
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                value={profileEmail}
                readOnly
                className={styles.input}
                disabled={true}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.newPassword")}
              </span>
              <span className={styles.inputWrap}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t("profile.page.placeholders.newPassword")}
                  autoComplete="new-password"
                  aria-invalid={fieldErrors.newPassword ? "true" : "false"}
                  aria-describedby={
                    fieldErrors.newPassword
                      ? "profile-new-password-error"
                      : undefined
                  }
                  className={`${styles.input} ${styles.inputWithIcon} ${
                    fieldErrors.newPassword ? styles.inputInvalid : ""
                  }`}
                  disabled={isFormDisabled}
                  {...registerInput("newPassword", validationRules.newPassword)}
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
                  disabled={isFormDisabled}
                >
                  <span
                    className={`${styles.passwordToggleIcon} ${
                      showNewPassword
                        ? styles.passwordToggleIconOpen
                        : styles.passwordToggleIconClosed
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </span>
              {fieldErrors.newPassword?.message ? (
                <span
                  id="profile-new-password-error"
                  className={styles.fieldError}
                  role="alert"
                >
                  {fieldErrors.newPassword.message}
                </span>
              ) : null}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>
                {t("profile.page.labels.confirmPassword")}
              </span>
              <span className={styles.inputWrap}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("profile.page.placeholders.confirmPassword")}
                  autoComplete="new-password"
                  aria-invalid={fieldErrors.confirmPassword ? "true" : "false"}
                  aria-describedby={
                    fieldErrors.confirmPassword
                      ? "profile-confirm-password-error"
                      : undefined
                  }
                  className={`${styles.input} ${styles.inputWithIcon} ${
                    fieldErrors.confirmPassword ? styles.inputInvalid : ""
                  }`}
                  disabled={isFormDisabled}
                  {...registerInput(
                    "confirmPassword",
                    validationRules.confirmPassword,
                  )}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  aria-label={
                    showConfirmPassword
                      ? t("common.password.hide")
                      : t("common.password.show")
                  }
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={isFormDisabled}
                >
                  <span
                    className={`${styles.passwordToggleIcon} ${
                      showConfirmPassword
                        ? styles.passwordToggleIconOpen
                        : styles.passwordToggleIconClosed
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </span>
              {fieldErrors.confirmPassword?.message ? (
                <span
                  id="profile-confirm-password-error"
                  className={styles.fieldError}
                  role="alert"
                >
                  {fieldErrors.confirmPassword.message}
                </span>
              ) : null}
            </label>
          </div>

          <div className={styles.submitButtonWrap}>
            <Button
              type="submit"
              variant="primary"
              text={
                isLoading
                  ? t("profile.page.actions.loading")
                  : isSubmitting
                    ? t("profile.page.actions.saving")
                    : t("profile.page.actions.save")
              }
              disabled={isFormDisabled || !isDirty}
              onClick={() => {}}
            />
          </div>
        </form>
      </section>
    </ProfileWrapper>
  );
}
