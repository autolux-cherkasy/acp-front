"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import About from "@/src/widgets/About/About";
import BenefitsWidget from "@/src/widgets/BenefitsWidget/BenefitsWidget";
import BookingHero from "@/src/widgets/BookingHero/BookingHero";
import PopularRoutes from "@/src/widgets/PopularRoutes/PopularRoutes";
import styles from "./home-page.module.css";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.mainScreenBlock}>
            <section id="home" className={styles.homeSection}>
              <h1 className={styles.title}>{t("home.title")}</h1>
              <BookingHero />
            </section>

            <BenefitsWidget />
          </div>

          <section id="routes" className={styles.fullWidthSection}>
            <PopularRoutes />
          </section>

          <section id="about" className={styles.fullWidthSection}>
            <About />
          </section>
        </div>
      </div>
    </main>
  );
}
