"use client";

import styles from "./Button.module.css";

export default function Button({
  text,
  variant = "primary",
  type = "button",
  onClick, // зробили optional фактично (через дефолт)
  leftIcon = null,
  rightIcon = null,
  fullWidth = true,
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

  const cls = [
    styles.button,
    variantMap[variant] ?? styles.primary,
    fullWidth ? styles.fullWidth : "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = onClick ?? (() => {});

  return (
    <button className={cls} type={type} onClick={handleClick} disabled={disabled}>
      <span className={leftIcon ? styles.iconVisible : styles.icon}>{leftIcon}</span>
      <span className={styles.text}>{text}</span>
      <span className={rightIcon ? styles.iconVisible : styles.icon}>{rightIcon}</span>
    </button>
  );
}
