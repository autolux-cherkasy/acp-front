import SelectField, { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import styles from "./SelectWithLabel.module.css";

type SelectWithLabelProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  menuZIndex?: number;
  wrapperClassName?: string;
  labelClassName?: string;
};

export default function SelectWithLabel({
  label,
  wrapperClassName,
  labelClassName,
  ...selectFieldProps
}: SelectWithLabelProps) {
  return (
    <div className={[styles.field, wrapperClassName].filter(Boolean).join(" ")}>
      <label className={[styles.label, labelClassName].filter(Boolean).join(" ")}>{label}</label>
      <SelectField {...selectFieldProps} />
    </div>
  );
}
