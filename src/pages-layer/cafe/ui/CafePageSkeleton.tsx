"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import BreadcrumbChips from "@/src/shared/ui/BreadcrumbChips/BreadcrumbChips";
import { DecorativeBorder } from "@/src/shared/ui/DecorativeBorder/DecorativeBorder";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import pageStyles from "./cafe-page.module.css";
import styles from "./cafe-page-skeleton.module.css";

function MenuGroupSkeleton({ className = "", rows = 5 }: { className?: string; rows?: number }) {
  return (
    <section className={[pageStyles.menuGroup, className].filter(Boolean).join(" ")}>
      <Skeleton width="55%" height={22} borderRadius={4} />

      <div className={pageStyles.menuList}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={pageStyles.menuRow}>
            <Skeleton width={`${38 + (i % 3) * 12}%`} height={16} borderRadius={3} />
            <span className={pageStyles.menuLine} aria-hidden="true">
              <span className={pageStyles.menuLineStroke} />
            </span>
            <Skeleton width={44} height={16} borderRadius={3} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CardSkeleton({ side, isSplit }: { side: "left" | "right"; isSplit: boolean }) {
  const cardSideClass = side === "left" ? pageStyles.cardImageLeft : pageStyles.cardImageRight;
  const layoutClass = isSplit ? pageStyles.cardSplit : pageStyles.cardSingle;

  return (
    <article className={`${pageStyles.card} ${cardSideClass} ${layoutClass}`}>
      <div className={pageStyles.photoWrap}>
        <div className={styles.imagePlaceholder} />
      </div>

      <DecorativeBorder className={pageStyles.cardFrame}>
        <div className={pageStyles.slot}>
          <div
            className={`${pageStyles.cardContent} ${
              isSplit ? pageStyles.cardContentSplit : pageStyles.cardContentSingle
            }`}
          >
            {isSplit ? (
              <>
                <MenuGroupSkeleton rows={6} />
                <div className={pageStyles.sideColumn}>
                  <MenuGroupSkeleton rows={3} />
                  <MenuGroupSkeleton rows={2} />
                </div>
              </>
            ) : (
              <MenuGroupSkeleton className={pageStyles.singleGroup} rows={4} />
            )}
          </div>
        </div>
      </DecorativeBorder>
    </article>
  );
}

export default function CafePageSkeleton() {
  const { t } = useI18n();

  return (
    <SkeletonTheme baseColor="#e8e8e8" highlightColor="#f5f5f5">
      <section className={pageStyles.page} aria-hidden="true">
        <div className={pageStyles.container}>
          <h1 className={pageStyles.srOnly}>{t("cafe.pageTitle")}</h1>

          <BreadcrumbChips
            ariaLabel={t("menu.cafe")}
            items={[
              { label: t("menu.home"), href: "/#home" },
              { label: t("menu.cafe"), current: true },
            ]}
          />

          <div className={pageStyles.hotdogBlock}>
            <section className={pageStyles.menuContent} aria-label={t("cafe.menuAria")}>
              <CardSkeleton side="left" isSplit={true} />
              <CardSkeleton side="right" isSplit={false} />
            </section>
          </div>
        </div>
      </section>
    </SkeletonTheme>
  );
}
