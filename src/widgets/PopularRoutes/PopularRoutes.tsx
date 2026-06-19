"use client";

import { popularRoutes, type PopularRoute } from "@/src/entities/trip";
import { SharedLabel } from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import styles from "./PopularRoutes.module.css";
import { RouteCard } from "./RouteCard";
import { useBookingStore } from "@/src/shared/store/BookingStore";

type Props = {
  routes?: PopularRoute[];
};

export default function PopularRoutes({ routes }: Props) {
  const { t } = useI18n();
  const data = routes?.length ? routes : popularRoutes;
  const topRoutes = data.slice(0, 2);
  const bottomRoutes = data.slice(2);
  const setSelectedRoute = useBookingStore((s) => s.setSelectedRoute);

  const handleRouteClick = (r: PopularRoute) => {
    setSelectedRoute(`${r.searchFrom}__${r.searchTo}`);
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.section} aria-label={t("popularRoutes.aria")}>
      <SharedLabel as="h2" variant="sectionTitle" className={styles.title}>
        {t("popularRoutes.title")}
      </SharedLabel>

      <div className={styles.cards}>
        <div className={styles.topRow}>
          {topRoutes.map((r) => (
            <RouteCard
              key={r.id}
              route={r}
              variant="large"
              ariaLabel={`${t("popularRoutes.openRoute")}: ${r.title}`}
              onClick={() => handleRouteClick(r)}
            />
          ))}
        </div>

        <div className={styles.bottomGrid}>
          {bottomRoutes.map((r) => (
            <RouteCard
              key={r.id}
              route={r}
              variant="small"
              ariaLabel={`${t("popularRoutes.openRoute")}: ${r.title}`}
              onClick={() => handleRouteClick(r)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
