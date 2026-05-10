import type { ReactNode } from "react";

import styles from "./FormField.module.css";

type FormFieldProps = {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  errorId?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
};

function FormField({
  label,
  error,
  hint,
  errorId,
  children,
  className,
  labelClassName,
}: FormFieldProps) {
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {label ? <span className={[styles.label, labelClassName].filter(Boolean).join(" ")}>{label}</span> : null}
      {children}
      {error ? (
        <span id={errorId} className={styles.fieldErrorText} role="alert">
          {error}
        </span>
      ) : null}
      {!error && hint ? <span className={styles.hint}>{hint}</span> : null}
    </div>
  );
}

export default FormField;
