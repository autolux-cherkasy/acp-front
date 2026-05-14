"use client";

import styles from "./home-page.module.css";
import { LanguageSwitcher } from "@/src/features/change-language";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import BookingHero from "@/src/widgets/BookingHero/BookingHero";
import BenefitsWidget from "@/src/widgets/BenefitsWidget/BenefitsWidget";
import PopularRoutes from "@/src/widgets/PopularRoutes/PopularRoutes";
import About from "@/src/widgets/About/About";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.mainScreenBlock}>
            <div className={styles.pageLanguage}>
              <LanguageSwitcher />
            </div>

            <section id="home" className={styles.homeSection}>
              <h1 className={styles.title}>{t("home.title")}</h1>
              <BookingHero />
            </section>

            <BenefitsWidget />
          </div>

          <section id="routes" className={styles.fullWidthSection}>
            <PopularRoutes titleClassName={styles.sectionTitle} />
          </section>

          <section id="about">
            <About titleClassName={styles.sectionTitle} />
          </section>
        </div>
      </div>
    </main>
  );
}
