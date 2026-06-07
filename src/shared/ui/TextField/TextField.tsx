"use client";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { useState } from "react";

import styles from "./TextField.module.css";

type TextFieldProps = ComponentPropsWithoutRef<"input"> & {
  leadingAdornment?: string;
  trailingAdornment?: string;
  onTrailingAdornmentClick?: () => void;
  className?: string;
  passwordToggle?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};

function renderAdornment(adornment: string) {
  return (
    <span
      className={styles.adornmentImage}
      style={
        {
          "--adornment-icon": `url("${adornment}")`,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

function renderToggleIcon(icon: string) {
  return (
    <span
      className={styles.toggleIcon}
      style={
        {
          "--toggle-icon": `url("${icon}")`,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

export default function TextField({
  type,
  leadingAdornment,
  trailingAdornment,
  onTrailingAdornmentClick,
  className,
  passwordToggle = false,
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  disabled,
  ...props
}: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = passwordToggle && type === "password";
  const resolvedType = isPasswordField && isPasswordVisible ? "text" : type;
  const resolvedTrailingAdornment = isPasswordField ? (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={() => setIsPasswordVisible((value) => !value)}
      aria-label={isPasswordVisible ? hidePasswordLabel : showPasswordLabel}
      disabled={disabled}
    >
      {renderToggleIcon(
        isPasswordVisible ? "/icons/eye-open.svg" : "/icons/eye-off-light.svg",
      )}
    </button>
  ) : trailingAdornment && onTrailingAdornmentClick ? (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={onTrailingAdornmentClick}
      aria-label="Open picker"
      disabled={disabled}
    >
      {renderAdornment(trailingAdornment)}
    </button>
  ) : trailingAdornment ? (
    renderAdornment(trailingAdornment)
  ) : undefined;
  const resolvedLeadingAdornment = leadingAdornment
    ? renderAdornment(leadingAdornment)
    : undefined;

  return (
    <div className={styles.field}>
      {resolvedLeadingAdornment ? (
        <span className={styles.leadingAdornment}>
          {resolvedLeadingAdornment}
        </span>
      ) : null}
      <input
        {...props}
        type={resolvedType}
        disabled={disabled}
        className={[
          styles.control,
          resolvedLeadingAdornment ? styles.withLeading : "",
          resolvedTrailingAdornment ? styles.withTrailing : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {resolvedTrailingAdornment ? (
        <span className={styles.trailingAdornment}>
          {resolvedTrailingAdornment}
        </span>
      ) : null}
    </div>
  );
}
