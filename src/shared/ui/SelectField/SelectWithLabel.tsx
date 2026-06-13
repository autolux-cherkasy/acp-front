"use client";

import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import SelectField, { type SelectOption } from "./SelectField";
import styles from "../InputWithLabel/InputWithLabel.module.css";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  wrapperClassName?: string;
};

export default function SelectWithLabel<T extends FieldValues>({
  control,
  name,
  options,
  label,
  placeholder,
  disabled,
  wrapperClassName,
}: Props<T>) {
  return (
    <div className={[styles.field, wrapperClassName].filter(Boolean).join(" ")}>
      {label && <span className={styles.label}>{label}</span>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <SelectField
            value={field.value ?? ""}
            options={options}
            onChange={field.onChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
