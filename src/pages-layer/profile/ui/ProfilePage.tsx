"use client";

import { openAuthModal } from "@/src/features/auth/model/auth-flow";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  useChangePasswordMutation,
  useProfileQuery,
  useUpdateProfileMutation,
} from "@/src/entities/user/api/useUserQueries";
import { hasAccessToken } from "@/src/shared";
import { ApiError } from "@/src/shared/api/http";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { useServerToast } from "@/src/shared/lib/toast";
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
  const router = useRouter();
  const resolveHref = useLocalizedHref();
  const { t } = useI18n();
  // const [profileEmail, setProfileEmail] = useState("");
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { notifyError, notifyInfo, notifySuccess } = useServerToast();
  const profileQuery = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    getValues,
    formState: { errors: fieldErrors, isDirty, dirtyFields },
  } = useForm<ProfileFormData>({
    defaultValues: EMPTY_PROFILE_FORM,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const validationRules = useMemo(
    () => createProfileValidationRules(t, getValues),
    [t, getValues],
  );
  const isLoading = profileQuery.isPending;
  const isSubmitting =
    updateProfileMutation.isPending || changePasswordMutation.isPending;
  const isAuthenticated = hasAccessToken();

  const isFormDisabled = isLoading || isSubmitting || requiresLogin;

  useEffect(() => {
    const setter = () => {
      setRequiresLogin(true);
    };
    if (!isAuthenticated) {
      setter();

      return;
    }

    if (profileQuery.data) {
      reset({
        name: profileQuery.data.name ?? "",
        phone: profileQuery.data.phone ?? "",
        newPassword: "",
        confirmPassword: "",
      });
      const set = () => {
        setRequiresLogin(false);
      };
      set();
    }
  }, [isAuthenticated, profileQuery.data, reset]);

  useEffect(() => {
    if (!profileQuery.error) {
      return;
    }

    const set = () => {
      setRequiresLogin(shouldRequireLogin(profileQuery.error));
    };
    set();
  }, [profileQuery.error]);
  const clearNotices = useCallback(() => {
    if (updateProfileMutation.error) {
      updateProfileMutation.reset();
    }

    if (changePasswordMutation.error) {
      changePasswordMutation.reset();
    }
  }, [
    updateProfileMutation,
    changePasswordMutation,
  ]);

  const registerInput = useCallback(
    (field: keyof ProfileFormData, options?: Parameters<typeof register>[1]) =>
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
      }),
    [register, clearErrors, clearNotices],
  );

  const onSubmit: SubmitHandler<ProfileFormData> = async (submittedData) => {
    const normalizedData = normalizeProfileFormData(submittedData);
    const wantsPasswordChange = hasPasswordChange(
      normalizedData.newPassword,
      normalizedData.confirmPassword,
    );
    const profilePayload = buildProfilePayload(normalizedData, dirtyFields);

    const hasProfileChanges = Object.keys(profilePayload).length > 0;

    if (!hasProfileChanges && !wantsPasswordChange) {
      notifyInfo(t("common.toast.noChanges"));
      return;
    }
    let nextProfileDefaults: Pick<ProfileFormData, "name" | "phone"> | null =
      null;
    let didUpdateProfile = false;
    let didChangePassword = false;

    if (hasProfileChanges) {
      try {
        const response =
          await updateProfileMutation.mutateAsync(profilePayload);

        nextProfileDefaults = {
          name: response.user.name ?? "",
          phone: response.user.phone ?? "",
        };
        didUpdateProfile = true;
        notifySuccess(response, t("common.toast.profileUpdateSuccess"));
      } catch (err) {
        notifyError(err, t("common.toast.profileUpdateError"));
        setRequiresLogin(shouldRequireLogin(err));
      }
    }

    if (wantsPasswordChange) {
      try {
        const response = await changePasswordMutation.mutateAsync({
          password: normalizedData.newPassword,
          confirmPassword: normalizedData.confirmPassword,
        });

        didChangePassword = true;
        notifySuccess(response, t("common.toast.passwordChangeSuccess"));
      } catch (err) {
        notifyError(err, t("common.toast.passwordChangeError"));
        setRequiresLogin(shouldRequireLogin(err));
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
  };

  const retryLoad = () => {
    updateProfileMutation.reset();
    changePasswordMutation.reset();
    void profileQuery.refetch();
  };

  const loadErrorMessage = profileQuery.error
    ? profileQuery.error instanceof Error
      ? profileQuery.error.message
      : t("profile.page.errors.load")
    : "";
  const displayedError = loadErrorMessage;

  return (
    <ProfileWrapper mode="profile">
      <section className={styles.card} aria-labelledby="profile-title">
        <h1 id="profile-title" className={styles.title}>
          {t("profile.page.title")}
        </h1>
        {displayedError ? (
          <div
            className={`${styles.notice} ${styles.noticeError}`}
            role="alert"
          >
            <span>{displayedError}</span>

            {!isLoading && isAuthenticated ? (
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

        {requiresLogin && !isLoading ? (
          <div className={styles.loginState}>
            <p className={styles.loginStateText}>
              {t("profile.page.messages.sessionInactive")}
            </p>
            <button
              type="button"
              className={styles.loginStateButton}
              onClick={() =>
                openAuthModal(router, resolveHref, "login", {
                  next: "/profile",
                })
              }
            >
              {t("profile.page.actions.login")}
            </button>
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
                value={profileQuery.data?.email}
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
              size="full"
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
