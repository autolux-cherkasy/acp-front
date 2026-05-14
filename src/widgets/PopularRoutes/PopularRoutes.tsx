"use client";

import Image from "next/image";

import LocaleLink from "@/src/shared/i18n/Link";
import styles from "./PopularRoutes.module.css";
import PopularRoutesTitle from "./PopularRoutesTitle";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Chip from "@/src/shared/ui/Chip/Chip";
import {
  getLocalizedRouteValue,
  getPopularRouteHref,
  popularRoutes as fallbackRoutes,
  type PopularRoute,
} from "@/src/entities/trip";

type Props = {
  routes?: PopularRoute[];
  titleClassName?: string;
};

export default function PopularRoutes({ routes, titleClassName }: Props) {
  const { lang, t } = useI18n();
  const data = routes?.length ? routes : fallbackRoutes;
  const topRoutes = data.slice(0, 2);
  const bottomRoutes = data.slice(2);

  return (
    <section className={styles.section} aria-label={t("popularRoutes.aria")}>
      <PopularRoutesTitle className={titleClassName}>
        {t("popularRoutes.title")}
      </PopularRoutesTitle>

      <div className={styles.cards}>
        <div className={styles.topRow}>
          {topRoutes.map((r) => {
            const title = getLocalizedRouteValue(r.title, lang);
            const alt = getLocalizedRouteValue(r.imageAlt, lang);

            return (
              <LocaleLink
                key={r.id}
                href={getPopularRouteHref(r)}
                className={`${styles.card} ${styles.cardLarge}`}
                aria-label={`${t("popularRoutes.openRoute")}: ${title}`}
              >
                <Image
                  className={styles.img}
                  src={r.imageSrc}
                  alt={alt}
                  fill
                  sizes="(max-width: 520px) calc(100vw - 32px), (max-width: 768px) calc((100vw - 72px) / 2), (max-width: 1300px) 50vw, 608px"
                />
                <Chip className={styles.routeChip}>{title}</Chip>
              </LocaleLink>
            );
          })}
        </div>

        <div className={styles.bottomGrid}>
          {bottomRoutes.map((r) => {
            const title = getLocalizedRouteValue(r.title, lang);
            const alt = getLocalizedRouteValue(r.imageAlt, lang);

            return (
              <LocaleLink
                key={r.id}
                href={getPopularRouteHref(r)}
                className={`${styles.card} ${styles.cardSmall}`}
                aria-label={`${t("popularRoutes.openRoute")}: ${title}`}
              >
                <Image
                  className={styles.img}
                  src={r.imageSrc}
                  alt={alt}
                  fill
                  sizes="(max-width: 520px) calc(100vw - 32px), (max-width: 768px) calc((100vw - 72px) / 2), (max-width: 1300px) 33vw, 397px"
                />
                <Chip className={styles.routeChip}>{title}</Chip>
              </LocaleLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
