import type { ElementType, ReactNode } from "react";
import styles from "./SharedLabel.module.css";

export type SharedLabelVariant =
  | "dashboardHeaderTitle"
  | "dashboardHeaderSubtitle"
  | "dashboardCardTitle"
  | "dashboardCardSubtitle"
  | "dashboardDate"
  | "sectionTitle";

type SharedLabelProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant: SharedLabelVariant;
};

export default function SharedLabel<T extends ElementType = "span">({
  as,
  children,
  className = "",
  variant,
}: SharedLabelProps<T>) {
  const Component = as ?? "span";
  const classes = [styles.label, styles[variant], className].filter(Boolean).join(" ");

  return <Component className={classes}>{children}</Component>;
}
