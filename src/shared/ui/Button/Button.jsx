import styles from "./Button.module.css";

export default function Button({
  text,
  variant = "primary",
  type = "button",
  onClick = () => {}, // зробили optional фактично (через дефолт)
  leftIcon = null,
  rightIcon = null,
  fullWidth = true,
  size = "",
  disabled = false,
}) {
  const variantMap = {
    primary: styles.primary,
    yellow: styles.yellow,
    secondary: styles.secondary,
    success: styles.success,
    danger: styles.danger,
    dangerOutlined: styles.dangerOutlined,
    outlined: styles.outlined,
  };

  const sizeMap = {
    full: styles.fullWidth,
    md: "",
    fit: styles.fit,
  };

  const resolvedSize = size ?? (fullWidth ? "full" : "md");

  const cls = [
    styles.button,
    variantMap[variant] ?? styles.primary,
    sizeMap[resolvedSize] ?? "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled}>
      <span className={leftIcon ? styles.iconVisible : styles.icon}>{leftIcon}</span>
      <span className={styles.text}>{text}</span>
      <span className={rightIcon ? styles.iconVisible : styles.icon}>{rightIcon}</span>
    </button>
  );
}
