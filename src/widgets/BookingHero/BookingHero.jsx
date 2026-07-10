import Image from "next/image";

import BookingForm from "../BookingForm";
import styles from "./BookingHero.module.css";

export default function BookingHero() {
  return (
    <section id="booking" className={styles.section}>
      <div className={styles.mainBlock}>
        <div className={styles.formBlock}>
          <BookingForm />

          <div className={styles.imageWrap}>
            <Image
              className={styles.image}
              src="/BookingHero/main_photo_bus.png"
              alt={"Автобус"}
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
