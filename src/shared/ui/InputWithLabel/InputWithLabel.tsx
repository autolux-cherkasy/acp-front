import type { ComponentPropsWithoutRef } from "react";
import TextField from "@/src/shared/ui/TextField/TextField";
import styles from "./InputWithLabel.module.css";

type InputWithLabelProps = ComponentPropsWithoutRef<typeof TextField> & {
  label: string;
  wrapperClassName?: string;
  labelClassName?: string;
};

export default function InputWithLabel({
  label,
  wrapperClassName,
  labelClassName,
  ...textFieldProps
}: InputWithLabelProps) {
  return (
    <div className={[styles.field, wrapperClassName].filter(Boolean).join(" ")}>
      <label className={[styles.label, labelClassName].filter(Boolean).join(" ")}>
        {label}
      </label>
      <TextField {...textFieldProps} />
    </div>
  );
}
