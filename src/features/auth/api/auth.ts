import { apiFetch } from "@/src/shared/api/http";
import { clearDevAuth, getDevRole } from "@/src/shared/api/dev-auth";
import { clearAccessToken, clearCsrfToken } from "@/src/shared/api/session";

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
  access_token: string;
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

export async function logout() {
  if (getDevRole()) {
    clearAccessToken();
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
    clearAccessToken();
    clearCsrfToken();
    clearDevAuth();
  }
}
