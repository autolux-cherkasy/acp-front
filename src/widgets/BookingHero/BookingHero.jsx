import Image from "next/image";
import { Suspense } from "react";

import styles from "./BookingHero.module.css";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import BookingForm from "../BookingForm";

export default function BookingHero() {
  const { t } = useI18n();

  return (
    <section id="booking" className={styles.section}>
      <div className={styles.mainBlock}>
        <div className={styles.formBlock}>
          <Suspense
            fallback={
              <div className={styles.formFallback} aria-hidden="true" />
            }
          >
            <BookingForm />
          </Suspense>

          <div className={styles.imageWrap}>
            <Image
              className={styles.image}
              src="/BookingHero/main_photo_bus.png"
              alt={t("bookingHero.imageAlt")}
              width={608}
              height={532}
              sizes="(max-width: 768px) 100vw, (max-width: 1240px) 100vw, 608px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
