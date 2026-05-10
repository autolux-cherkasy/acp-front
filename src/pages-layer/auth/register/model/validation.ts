export type RegisterField = "phone" | "email" | "password" | "confirmPassword";

export type RegisterFormData = {
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

type Translate = (key: string) => string;

export const PHONE_MAX_LENGTH = 13;
export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MAX_LENGTH = 64;

const PHONE_REGEX = /^\+380\d{9}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const COMMON_EMAIL_DOMAIN_TYPOS = new Set([
  "gmail.co",
  "gmail.con",
  "gmail.comm",
  "gmai.com",
  "gmial.com",
  "hotmial.com",
  "hotmail.co",
  "hotmail.con",
  "outlok.com",
  "outlook.co",
  "outlook.con",
  "yahoo.co",
  "yahoo.con",
  "iclod.com",
  "icloud.co",
  "icloud.con",
]);

const REGISTER_FIELDS: RegisterField[] = [
  "phone",
  "email",
  "password",
  "confirmPassword",
];

function includesAny(value: string, variants: readonly string[]) {
  return variants.some((variant) => value.includes(variant));
}

function normalizeValue(value: string) {
  return value.trim();
}

function hasKnownEmailDomainTypo(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return COMMON_EMAIL_DOMAIN_TYPOS.has(domain);
}

export function sanitizeRegisterFieldInput(
  field: RegisterField,
  value: string,
) {
  switch (field) {
    case "phone": {
      const hasLeadingPlus = value.startsWith("+");
      const digitsOnly = value.replace(/\D/g, "");
      return `${hasLeadingPlus ? "+" : ""}${digitsOnly}`.slice(
        0,
        PHONE_MAX_LENGTH,
      );
    }
    case "email": {
      let hasAtSymbol = false;

      return Array.from(value)
        .filter((char) => {
          if (/[A-Za-z0-9._%+-]/.test(char)) {
            return true;
          }

          if (char === "@") {
            if (hasAtSymbol) {
              return false;
            }

            hasAtSymbol = true;
            return true;
          }

          return false;
        })
        .join("")
        .slice(0, EMAIL_MAX_LENGTH);
    }
    case "password":
    case "confirmPassword":
      return value.slice(0, PASSWORD_MAX_LENGTH);
    default:
      return value;
  }
}

export function validateRegisterField(
  field: RegisterField,
  formData: RegisterFormData,
  t: Translate,
) {
  const phone = normalizeValue(formData.phone);
  const email = normalizeValue(formData.email);
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  switch (field) {
    case "phone":
      if (!phone) {
        return t("auth.register.errors.phoneRequired");
      }

      if (!PHONE_REGEX.test(phone)) {
        return t("auth.register.errors.phoneFormat");
      }

      return "";
    case "email":
      if (!email) {
        return t("auth.register.errors.emailRequired");
      }

      if (!EMAIL_REGEX.test(email) || hasKnownEmailDomainTypo(email)) {
        return t("auth.register.errors.emailInvalid");
      }

      return "";
    case "password":
      if (!password) {
        return t("auth.register.errors.passwordRequired");
      }

      if (!PASSWORD_REGEX.test(password)) {
        return t("auth.register.errors.passwordFormat");
      }

      return "";
    case "confirmPassword":
      if (!confirmPassword) {
        return t("auth.register.errors.confirmPasswordRequired");
      }

      if (password !== confirmPassword) {
        return t("auth.register.errors.passwordMismatch");
      }

      return "";
    default:
      return "";
  }
}

export function validateRegisterForm(
  formData: RegisterFormData,
  t: Translate,
): RegisterFieldErrors {
  return REGISTER_FIELDS.reduce<RegisterFieldErrors>((errors, field) => {
    if (Object.keys(errors).length > 0) {
      return errors;
    }

    const error = validateRegisterField(field, formData, t);

    if (error) {
      errors[field] = error;
    }

    return errors;
  }, {});
}

function pickHighestPriorityFieldError(
  fieldErrors: RegisterFieldErrors,
): RegisterFieldErrors {
  for (const field of REGISTER_FIELDS) {
    const message = fieldErrors[field];

    if (message) {
      return { [field]: message };
    }
  }

  return {};
}

type FieldMatch = {
  field: RegisterField;
  message: string;
};

function splitServerValidationMessage(message: string) {
  return message
    .split(/(?:,\s*|;\s*|\n+|\.\s+(?=[A-ZА-ЯІЇЄ]))/u)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function mapSingleServerError(
  message: string,
  t: Translate,
): FieldMatch | null {
  const normalized = message.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  const mentionsEmail = includesAny(normalized, [
    "email",
    "e-mail",
    "імейл",
    "имейл",
    "почт",
  ]);
  const mentionsPhone = includesAny(normalized, ["phone", "телефон", "номер"]);
  const mentionsPassword = includesAny(normalized, ["password", "парол"]);

  if (
    mentionsEmail &&
    includesAny(normalized, [
      "already",
      "exists",
      "taken",
      "зареєстр",
      "зарегистр",
      "существ",
      "використ",
      "использ",
      "unique",
    ])
  ) {
    return { field: "email", message: t("auth.register.errors.emailExists") };
  }

  if (
    mentionsPhone &&
    includesAny(normalized, [
      "already",
      "exists",
      "taken",
      "зареєстр",
      "зарегистр",
      "существ",
      "використ",
      "использ",
      "unique",
    ])
  ) {
    return { field: "phone", message: t("auth.register.errors.phoneExists") };
  }

  if (
    mentionsEmail &&
    includesAny(normalized, [
      "required",
      "empty",
      "обов",
      "обяз",
      "should not be empty",
    ])
  ) {
    return { field: "email", message: t("auth.register.errors.emailRequired") };
  }

  if (
    mentionsPhone &&
    includesAny(normalized, [
      "required",
      "empty",
      "обов",
      "обяз",
      "should not be empty",
    ])
  ) {
    return { field: "phone", message: t("auth.register.errors.phoneRequired") };
  }

  if (
    mentionsPassword &&
    includesAny(normalized, [
      "required",
      "empty",
      "обов",
      "обяз",
      "should not be empty",
    ])
  ) {
    return {
      field: "password",
      message: t("auth.register.errors.passwordRequired"),
    };
  }

  if (
    mentionsEmail &&
    includesAny(normalized, [
      "invalid",
      "must be an email",
      "некор",
      "невер",
      "валид",
      "format",
      "email",
    ])
  ) {
    return { field: "email", message: t("auth.register.errors.emailInvalid") };
  }

  if (
    mentionsPhone &&
    includesAny(normalized, [
      "invalid",
      "format",
      "pattern",
      "regexp",
      "regular expression",
      "match",
      "некор",
      "невер",
      "валид",
    ])
  ) {
    return { field: "phone", message: t("auth.register.errors.phoneFormat") };
  }

  if (
    mentionsPassword &&
    includesAny(normalized, [
      "at least 8",
      "uppercase",
      "digit",
      "number",
      "циф",
      "велик",
      "букв",
      "мінімум",
      "minimum",
      "как минимум",
      "должен содержать",
      "повинен містити",
      "strong enough",
    ])
  ) {
    return {
      field: "password",
      message: t("auth.register.errors.passwordFormat"),
    };
  }

  if (
    mentionsPassword &&
    includesAny(normalized, ["match", "совпад", "співпад", "same"])
  ) {
    return {
      field: "confirmPassword",
      message: t("auth.register.errors.passwordMismatch"),
    };
  }

  return null;
}

export function mapRegisterServerError(
  message: string,
  t: Translate,
): {
  fieldErrors: RegisterFieldErrors;
  formError: string;
} {
  const segments = splitServerValidationMessage(message);

  const fieldErrors = segments.reduce<RegisterFieldErrors>(
    (errors, segment) => {
      const mapped = mapSingleServerError(segment, t);

      if (mapped) {
        errors[mapped.field] = mapped.message;
      }

      return errors;
    },
    {},
  );

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors: pickHighestPriorityFieldError(fieldErrors),
      formError: "",
    };
  }

  return {
    fieldErrors: {},
    formError: t("auth.register.errors.generic"),
  };
}
