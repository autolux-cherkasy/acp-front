import type {
  FieldNamesMarkedBoolean,
  RegisterOptions,
  UseFormGetValues,
} from "react-hook-form";

export type ProfileFormData = {
  name: string;
  phone: string;
  newPassword: string;
  confirmPassword: string;
};

type Translate = (key: string) => string;
type ProfilePayload = Partial<Pick<ProfileFormData, "name" | "phone">>;

const PHONE_PATTERN = /^\+380\d{9}$/;

export const EMPTY_PROFILE_FORM: ProfileFormData = {
  name: "",
  phone: "",
  newPassword: "",
  confirmPassword: "",
};

export function normalizeProfileFormData(
  values: ProfileFormData,
): ProfileFormData {
  return {
    ...values,
    name: values.name.trim(),
    phone: values.phone.trim(),
  };
}

function validatePasswordPair(
  newPassword: string,
  confirmPassword: string,
  t: Translate,
) {
  const wantsPasswordChange = Boolean(newPassword || confirmPassword);

  if (!wantsPasswordChange) {
    return { isValid: true as const };
  }

  if (!newPassword || !confirmPassword) {
    return {
      isValid: false as const,
      message: t("profile.page.errors.passwordBothRequired"),
    };
  }

  if (newPassword.length < 6) {
    return {
      isValid: false as const,
      message: t("profile.page.errors.passwordMin"),
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      isValid: false as const,
      message: t("profile.page.errors.passwordSame"),
    };
  }

  return { isValid: true as const };
}

function validateNewPasswordValue(
  newPassword: string,
  confirmPassword: string,
  t: Translate,
) {
  const result = validatePasswordPair(newPassword, confirmPassword, t);

  if (!result.isValid && result.message === t("profile.page.errors.passwordSame")) {
    return true;
  }

  return result.isValid ? true : result.message;
}

function validateConfirmPasswordValue(
  newPassword: string,
  confirmPassword: string,
  t: Translate,
) {
  const result = validatePasswordPair(newPassword, confirmPassword, t);

  if (!result.isValid && result.message === t("profile.page.errors.passwordMin")) {
    return true;
  }

  return result.isValid ? true : result.message;
}

export function createProfileValidationRules(
  t: Translate,
  getValues: UseFormGetValues<ProfileFormData>,
) {
  const validateName: RegisterOptions<ProfileFormData, "name">["validate"] = (
    value,
  ) => value.trim().length >= 2 || t("profile.page.errors.nameMin");

  const validatePhone: RegisterOptions<ProfileFormData, "phone">["validate"] = (
    value,
  ) => PHONE_PATTERN.test(value.trim()) || t("profile.page.errors.phoneFormat");

  const validateNewPassword: RegisterOptions<
    ProfileFormData,
    "newPassword"
  >["validate"] = (value) => {
    return validateNewPasswordValue(value, getValues("confirmPassword"), t);
  };

  const validateConfirmPassword: RegisterOptions<
    ProfileFormData,
    "confirmPassword"
  >["validate"] = (value) => {
    return validateConfirmPasswordValue(getValues("newPassword"), value, t);
  };

  return {
    name: { validate: validateName },
    phone: { validate: validatePhone },
    newPassword: { validate: validateNewPassword },
    confirmPassword: { validate: validateConfirmPassword },
  } satisfies Record<
    keyof ProfileFormData,
    RegisterOptions<ProfileFormData, keyof ProfileFormData>
  >;
}

export function buildProfilePayload(
  values: ProfileFormData,
  dirtyFields: FieldNamesMarkedBoolean<ProfileFormData>,
) {
  const normalizedValues = normalizeProfileFormData(values);
  const payload: ProfilePayload = {};

  if (dirtyFields.name) {
    payload.name = normalizedValues.name;
  }

  if (dirtyFields.phone) {
    payload.phone = normalizedValues.phone;
  }
  return payload;
}

export function hasPasswordChange(
  newPassword: string,
  confirmPassword: string,
) {
  return Boolean(newPassword || confirmPassword);
}
