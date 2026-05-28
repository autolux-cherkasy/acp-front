type GoogleClientConfigStatus =
  | "ready"
  | "missing_client_id"
  | "invalid_client"
  | "redirect_uri_mismatch"
  | "unknown_error";

type GoogleAuthErrorCode =
  | "missing_client_id"
  | "invalid_client"
  | "redirect_uri_mismatch"
  | "only_browser"
  | "init_failed"
  | "load_failed"
  | "request_failed"
  | "missing_token";

type GoogleIdentityApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential?: string }) => void;
  }) => void;
  prompt: () => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      shape?: "rectangular" | "pill" | "circle" | "square";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      logo_alignment?: "left" | "center";
      width?: number;
      locale?: string;
    },
  ) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdentityApi;
      };
    };
  }
}

const GOOGLE_AUTH_MESSAGES = {
  only_browser: {
    uk: "Google Identity Services доступний лише у браузері",
    en: "Google Identity Services is only available in the browser",
  },
  init_failed: {
    uk: "Google Identity Services не ініціалізувався коректно",
    en: "Google Identity Services did not initialize correctly",
  },
  load_failed: {
    uk: "Не вдалося завантажити Google Identity Services",
    en: "Failed to load Google Identity Services",
  },
  request_failed: {
    uk: "Не вдалося отримати конфігурацію Google авторизації",
    en: "Failed to load Google sign-in configuration",
  },
  missing_client_id: {
    uk: "Google авторизація ще не налаштована",
    en: "Google sign-in is not configured yet",
  },
  invalid_client: {
    uk: "Google авторизація тимчасово недоступна: OAuth client не знайдено",
    en: "Google sign-in is temporarily unavailable: OAuth client was not found",
  },
  redirect_uri_mismatch: {
    uk: "Google авторизація налаштована некоректно",
    en: "Google sign-in is misconfigured",
  },
  missing_token: {
    uk: "Відповідь API не містить access token",
    en: "API response does not include an access token",
  },
} as const;

export class GoogleAuthError extends Error {
  code: GoogleAuthErrorCode;

  constructor(code: GoogleAuthErrorCode, message?: string) {
    super(message ?? GOOGLE_AUTH_MESSAGES[code][getClientLocale()]);
    this.code = code;
    this.name = "GoogleAuthError";
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

function getClientLocale() {
  if (typeof document === "undefined") {
    return "uk" as const;
  }

  return document.documentElement.lang?.toLowerCase().startsWith("en")
    ? "en"
    : "uk";
}

function getGoogleClientConfigError(
  status: Exclude<GoogleClientConfigStatus, "ready">,
) {
  switch (status) {
    case "missing_client_id":
      return new GoogleAuthError("missing_client_id");
    case "invalid_client":
      return new GoogleAuthError("invalid_client");
    case "redirect_uri_mismatch":
      return new GoogleAuthError("redirect_uri_mismatch");
    default:
      return new GoogleAuthError("request_failed");
  }
}

export function getGoogleAuthErrorMessage(error: unknown) {
  if (error instanceof GoogleAuthError) {
    return error.message;
  }

  return error instanceof Error
    ? error.message
    : GOOGLE_AUTH_MESSAGES.request_failed[getClientLocale()];
}
