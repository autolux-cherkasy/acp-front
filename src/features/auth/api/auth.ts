import { apiFetch } from "@/src/shared/api/http";
import { clearDevAuth, getDevRole } from "@/src/shared/api/dev-auth";
import { clearCsrfToken } from "@/src/shared/api/session";

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

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiFetch<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
    includeAuth: false,
    skipAuthRefresh: true,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiFetch<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
    includeAuth: false,
    skipAuthRefresh: true,
  });
}

export function verifyEmailOtp(payload: VerifyEmailOtpPayload){
  return apiFetch<MessageResponse>("/auth/verify-email-otp", {
  method: "POST",
  body: JSON.stringify(payload),
  includeAuth: false,
  skipAuthRefresh: true,
});
}

export function resendConfirm(payload: ForgotPasswordPayload){
  return apiFetch<MessageResponse>("/auth/resend-confirmation", {
  method: "POST",
  body: JSON.stringify(payload),
  includeAuth: false,
  skipAuthRefresh: true,
});
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
    return await apiFetch<MessageResponse>("/auth/logout", {
      method: "PATCH",
    });
  } finally {
    clearCsrfToken();
    clearDevAuth();
  }
}

