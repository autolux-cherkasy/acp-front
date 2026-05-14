import Image from "next/image";

import styles from "./About.module.css";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import StatStepperCore from "./StatStepperCore/StatStepperCore";

type Card = {
  key: string;
  icon: string;
};

const cards: Card[] = [
  { key: "passenger", icon: "/icons/Services/Ticket.svg" },
  { key: "groupTransfer", icon: "/icons/Services/Mobile Check.svg" },
  {
    key: "excursions",
    icon: "/icons/Services/bus rental for excursions icon.svg",
  },
  { key: "seaTours", icon: "/icons/Services/coffee.svg" },
  { key: "schoolBus", icon: "/icons/Services/Laptop.svg" },
  { key: "corporate", icon: "/icons/Services/Map.svg" },
];

type Props = {
  titleClassName?: string;
};

export default function About({ titleClassName }: Props) {
  const { t } = useI18n();

  return (
    <section className={styles.section} aria-label={t("about.ariaLabel")}>
      <h2 className={titleClassName ?? styles.title}>{t("about.title")}</h2>

      <div className={styles.grid}>
        {cards.map((card) => (
          <article key={card.key} className={styles.card}>
            <div className={styles.iconWrap} aria-hidden="true">
              <Image
                className={styles.icon}
                src={encodeURI(card.icon)}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
              />
            </div>

            <div className={styles.textCol}>
              <div className={styles.cardTitle}>
                {t(`about.cards.${card.key}.title`)}
              </div>
              <div className={styles.cardDesc}>
                {t(`about.cards.${card.key}.desc`)}
              </div>
            </div>
          </article>
        ))}
      </div>

      <StatStepperCore />
    </section>
  );
}
