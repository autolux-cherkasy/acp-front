"use client";

import { useCallback } from "react";
import { toast } from "sonner";

type ToastKind = "success" | "error" | "info";

type ServerResult = Record<string, unknown> | null | undefined;

type ServerToastOptions = {
  type: ToastKind;
  result?: ServerResult;
  error?: unknown;
  successMessage?: string;
  errorMessage?: string;
  message?: string;
};

function getResultMessage(result: ServerResult) {
  return typeof result?.message === "string" && result.message.trim()
    ? result.message
    : null;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : null;
}

function emitToast(type: ToastKind, message: string) {
  if (type === "success") {
    toast.success(message);
    return;
  }

  if (type === "error") {
    toast.error(message);
    return;
  }

  toast.info(message);
}

export function showServerToast({
  type,
  result,
  error,
  successMessage,
  errorMessage,
  message,
}: ServerToastOptions) {
  const resolvedMessage =
    message ??
    (type === "success"
      ? getResultMessage(result) ?? successMessage
      : type === "error"
        ? getErrorMessage(error) ?? errorMessage
        : message ?? successMessage ?? errorMessage);

  if (!resolvedMessage) {
    return;
  }

  emitToast(type, resolvedMessage);
}

export function useServerToast() {
  const notifySuccess = useCallback(
    (result: ServerResult, fallbackMessage: string) => {
      showServerToast({
        type: "success",
        result,
        successMessage: fallbackMessage,
      });
    },
    [],
  );

  const notifyError = useCallback(
    (error: unknown, fallbackMessage: string) => {
      showServerToast({
        type: "error",
        error,
        errorMessage: fallbackMessage,
      });
    },
    [],
  );

  const notifyInfo = useCallback((message: string) => {
    showServerToast({
      type: "info",
      message,
    });
  }, []);

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
  };
}
