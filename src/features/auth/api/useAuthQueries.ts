"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  forgotPassword,
  type ForgotPasswordPayload,
  login,
  logout,
  register,
  resetPassword,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
} from "./auth";
import { setAccessToken, setCsrfToken } from "@/src/shared/api/session";

const PROFILE_QUERY_KEY = ["profile"];

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    mutationKey: ["login"],
    onSuccess: async (data) => {
      if (!data?.access_token) {
        throw new Error("Missing access token");
      }

      setAccessToken(data.access_token);
      if (data.csrf_token) {
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
