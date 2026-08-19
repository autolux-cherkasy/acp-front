"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  forgotPassword,
  type ForgotPasswordPayload,
  type GuestOtpPayload,
  login,
  logout,
  register,
  requestGuestOtp,
  resetPassword,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
  VerifyEmailOtpPayload,
  verifyEmailOtp,
  verifyGuestOtp,
  resendConfirm,
} from "./auth";
import { setCsrfToken } from "@/src/shared/api/session";

const PROFILE_QUERY_KEY = ["profile"];

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    mutationKey: ["login"],
    onSuccess: async (data) => {
      if (data?.csrf_token) {
        setCsrfToken(data.csrf_token);
      }
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    mutationKey: ["register"],
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
    mutationKey: ["forgot-password"],
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    mutationKey: ["reset-password"],
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    mutationKey: ["logout"],
    onSettled: async () => {
      queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

export function useVerifyEmailOtpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyEmailOtpPayload) => verifyEmailOtp(payload),
    mutationKey: ["verify-email-otp"],
    onSuccess: async (data) => {
      if (data?.csrf_token) {
        setCsrfToken(data.csrf_token);
      }
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

export function useResendConfirmMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => resendConfirm(payload),
    mutationKey: ["resend-confirm"],
  });
}

export function useRequestGuestOtpMutation() {
  return useMutation({
    mutationFn: (email: string) => requestGuestOtp(email),
    mutationKey: ["guest-request-otp"],
  });
}

export function useVerifyGuestOtpMutation() {
  return useMutation({
    mutationFn: (payload: GuestOtpPayload) => verifyGuestOtp(payload),
    mutationKey: ["guest-verify-otp"],
  });
}