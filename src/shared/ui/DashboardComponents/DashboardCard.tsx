import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import SharedLabel from "../SharedLabel/SharedLabel";
import styles from "./DashboardCard.module.css";

type DashboardCardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  headerRef?: Ref<HTMLDivElement>;
  classNameHeader?: string;
};

export default function DashboardCard({
  children,
  className = "",
  title,
  subtitle,
  headerAction,
  classNameHeader = "",
  headerRef,
  ...props
}: DashboardCardProps) {
  const hasHeader = title != null || headerAction != null || headerRef != null;

  return (
    <div className={`${styles.card} ${className}`} {...props}>
      {hasHeader && (
        <div ref={headerRef} className={`${styles.cardHeader} ${classNameHeader}`}>
          {title && (
            <div className={styles.cardTitleGroup}>
              <SharedLabel variant="dashboardCardTitle">{title}</SharedLabel>
              {subtitle && <SharedLabel variant="dashboardCardSubtitle">{subtitle}</SharedLabel>}
            </div>
          )}
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}
