import { ApiError, apiFetch } from "@/src/shared/api/http";
import { clearDevAuth, getDevRole } from "@/src/shared/api/dev-auth";
import { clearCsrfToken, endClientSession, setCsrfToken } from "@/src/shared/api/session";

export type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  name?: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type TokenResponse = {
  csrf_token?: string;
};

type MessageResponse = {
  message: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type VerifyEmailOtpPayload = {
  email: string;
  code: string
};


export function register(payload: RegisterPayload) {
  return apiFetch<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    includeAuth: false,
    skipAuthRefresh: true,
  });
}

export function login(payload: LoginPayload) {
  return apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    includeAuth: false,
    skipAuthRefresh: true,
  });
}

export function fetchCsrfToken() {
  return apiFetch<TokenResponse>("/auth/csrf-token", {
    includeAuth: false,
    skipAuthRefresh: true,
  });
}

export function exchangeOAuthCode(code: string) {
  return apiFetch<TokenResponse>("/auth/oauth/exchange", {
    method: "POST",
    body: JSON.stringify({ code }),
    includeAuth: false,
    skipAuthRefresh: true,
  });
}

async function ensureCsrfToken() {
  const data = await fetchCsrfToken();
  if (data?.csrf_token) {
    setCsrfToken(data.csrf_token);
  }
}

function isCsrfError(error: unknown) {
  return (
    error instanceof ApiError &&
    error.status === 403 &&
    /csrf/i.test(error.message)
  );
}

async function withCsrfRetry<T>(request: () => Promise<T>): Promise<T> {
  await ensureCsrfToken();

  try {
    return await request();
  } catch (error) {
    if (!isCsrfError(error)) {
      throw error;
    }

    await ensureCsrfToken();
    return request();
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  return withCsrfRetry(() =>
    apiFetch<MessageResponse>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
      includeAuth: false,
      skipAuthRefresh: true,
    }),
  );
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return withCsrfRetry(() =>
    apiFetch<MessageResponse>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
      includeAuth: false,
      skipAuthRefresh: true,
    }),
  );
}

export function verifyEmailOtp(payload: VerifyEmailOtpPayload) {
  return apiFetch<TokenResponse>("/auth/verify-email-otp", {
    method: "POST",
    body: JSON.stringify(payload),
    includeAuth: false,
    skipAuthRefresh: true,
  });
}

export type GuestOtpPayload = {
  email: string;
  code: string;
};

export type GuestTokenResponse = {
  guest_token: string;
};

export async function requestGuestOtp(email: string) {
  return withCsrfRetry(() =>
    apiFetch<MessageResponse>("/auth/guest/request-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
      includeAuth: false,
      skipAuthRefresh: true,
    }),
  );
}

export async function verifyGuestOtp(payload: GuestOtpPayload) {
  return withCsrfRetry(() =>
    apiFetch<GuestTokenResponse>("/auth/guest/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
      includeAuth: false,
      skipAuthRefresh: true,
    }),
  );
}

export async function resendConfirm(payload: ForgotPasswordPayload) {
  return withCsrfRetry(() =>
    apiFetch<MessageResponse>("/auth/resend-confirmation", {
      method: "POST",
      body: JSON.stringify(payload),
      includeAuth: false,
      skipAuthRefresh: true,
    }),
  );
}

export async function logout() {
  if (getDevRole()) {
    clearCsrfToken();
    clearDevAuth();

    return {
      message: "Logged out locally.",
    };
  }

  try {
    return await withCsrfRetry(() =>
      apiFetch<MessageResponse>("/auth/logout", {
        method: "PATCH",
        skipAuthRefresh: true,
      }),
    );
  } finally {
    endClientSession();
    clearDevAuth();
  }
}

