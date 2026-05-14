"use client";

import Image from "next/image";

import LocaleLink from "@/src/shared/i18n/Link";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import SurfacePanel from "@/src/shared/ui/SurfacePanel/SurfacePanel";
import styles from "./not-found-page.module.css";

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <SurfacePanel className={styles.card}>
        <h1 id="not-found-title" className={styles.srOnly}>
          {t("notFound.title")}
        </h1>

        <div className={styles.stack}>
          <div className={styles.figureWrap}>
            <Image
              src="/icons/404_page/Map.svg"
              alt={t("notFound.imageAlt")}
              width={360}
              height={360}
              className={styles.figure}
              unoptimized
              priority
            />
          </div>

          <div className={styles.content}>
            <p className={styles.description}>{t("notFound.description")}</p>

            <LocaleLink href="/" className={styles.button}>
              {t("notFound.button")}
            </LocaleLink>
          </div>
        </div>
      </SurfacePanel>
    </section>
  );
}
