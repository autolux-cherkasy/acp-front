import Image from "next/image";

import styles from "./BenefitsWidget.module.css";
import { useI18n } from "@/src/shared/i18n/I18nProvider";

export default function BenefitsWidget() {
  const { t } = useI18n();

  const items = [
    {
      icon: "/icons/BenefitsWidget/search-line.svg",
      textKey: "benefits.items.search",
      altKey: "benefits.icons.searchAlt",
    },
    {
      icon: "/icons/BenefitsWidget/ticket-outline.svg",
      textKey: "benefits.items.ticket",
      altKey: "benefits.icons.ticketAlt",
    },
    {
      icon: "/icons/BenefitsWidget/currency-hryvnia-blue.svg",
      textKey: "benefits.items.pay",
      altKey: "benefits.icons.payAlt",
    },
  ] as const;

  return (
    <section className={styles.bar} aria-label={t("benefits.aria")}>
      <div className={styles.inner}>
        {items.map((it) => (
          <div key={it.textKey} className={styles.card}>
            <Image
              className={styles.icon}
              src={it.icon}
              alt={t(it.altKey)}
              width={44}
              height={44}
            />
            <div className={styles.text}>{t(it.textKey)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
