"use client";

import Button from "@/src/shared/ui/Button/Button";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { useServerToast } from "@/src/shared/lib/toast";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import ModalFrame, { useModalClose } from "@/src/shared/ui/ModalFrame/ModalFrame";
import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import styles from "./EmailConfirmationModal.module.css";
import { useVerifyEmailOtpMutation } from "../../auth/api/useAuthQueries";

const CODE_LENGTH = 6;

export type EmailConfirmationContext = "payment" | "booking" | "registration";

type FormProps = {
  email: string;
  context: EmailConfirmationContext;
  error?: boolean;
  onClose?: () => void;
  onConfirm?: (code: string) => void;
  onResend?: () => void;
  onChangeEmail?: () => void;
};

function onlyDigit(value: string) {
  return value.replace(/\D/g, "").slice(-1);
}


export function EmailConfirmationForm({
  email,
  context,
  error = false,
  onClose,
  onConfirm,
  onResend,
  onChangeEmail,
}: FormProps) {
  const { t } = useI18n();
  const { notifySuccess } = useServerToast();
  const [code, setCode] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const verifyOtpMutation = useVerifyEmailOtpMutation();

  const descriptionKey =
    context === "payment"
      ? "descriptionPayment"
      : context === "booking"
        ? "descriptionBooking"
        : "descriptionRegistration";
  const description = t(`ticketBooking.emailConfirmationModal.${descriptionKey}`);

  const handleChange = (index: number, rawValue: string) => {
    const value = onlyDigit(rawValue);
    setCode((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!digits) return;
    event.preventDefault();

    setCode((prev) => {
      const next = [...prev];
      digits.split("").forEach((digit, i) => {
        next[i] = digit;
      });
      return next;
    });

    inputsRef.current[Math.min(digits.length, CODE_LENGTH) - 1]?.focus();
  };

  const isComplete = code.every((digit) => digit !== "");

  return (
    <div className={styles.body}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>{t("ticketBooking.emailConfirmationModal.title")}</h2>
        <ModalCloseButton onClose={onClose} ariaLabel={t("common.close")} />
      </div>

      <p className={styles.description}>
        {description} <span className={styles.email}>{email}</span>
      </p>

      <div className={styles.codeSection}>
        <div className={styles.digits}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              className={[
                styles.digit,
                error ? styles.digitError : digit ? styles.digitFilled : "",
              ]
                .filter(Boolean)
                .join(" ")}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              aria-label={`${t("ticketBooking.otpModal.codeLabel")} ${index + 1}`}
            />
          ))}
        </div>
        {error && <span className={styles.errorText}>{t("ticketBooking.emailConfirmationModal.wrongCode")}</span>}
      </div>

      <Button
        text={t("ticketBooking.emailConfirmationModal.confirm")}
        variant="primary"
        size="full"
        disabled={!isComplete || verifyOtpMutation.isPending}
        onClick={() =>
          verifyOtpMutation.mutate(
            { email, code: code.join("") },
            {
              onSuccess: (result) => {
                notifySuccess(result, t("common.toast.verifyEmailSuccess"));
                onConfirm?.(code.join(""));
              },
              onError: () => {},
            },
          )
        }
      />

      <div className={styles.footer}>
        <span>{t("ticketBooking.emailConfirmationModal.resendPrompt")}</span>
        <button type="button" className={styles.link} onClick={onResend} disabled={verifyOtpMutation.isPending}>
          {t("ticketBooking.emailConfirmationModal.resend")}
        </button>
        <span className={styles.dot} />
        <button type="button" className={styles.link} onClick={onChangeEmail} disabled={verifyOtpMutation.isPending}>
          {t("ticketBooking.emailConfirmationModal.changeEmail")}
        </button>
      </div>
    </div>
  );
}

function EmailConfirmationModalBody(props: Omit<FormProps, "onClose">) {
  const requestClose = useModalClose();
  return <EmailConfirmationForm {...props} onClose={requestClose} />;
}

type Props = FormProps & {
  onClose: () => void;
};

export default function EmailConfirmationModal({ onClose, ...rest }: Props) {
  return (
    <ModalFrame onClose={onClose} surfaceClassName={styles.surface}>
      <EmailConfirmationModalBody {...rest} />
    </ModalFrame>
  );
}
