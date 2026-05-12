import type { Locale } from "@/src/shared/i18n";
import BreadcrumbChips from "@/src/shared/ui/BreadcrumbChips/BreadcrumbChips";
import { publicOfferContent } from "../model/public-offer-content";
import styles from "./public-offer-page.module.css";

type PublicOfferPageProps = {
  locale: Locale;
  homeLabel: string;
  publicOfferLabel: string;
};

export default function PublicOfferPage({
  locale,
  homeLabel,
  publicOfferLabel,
}: PublicOfferPageProps) {
  const content = publicOfferContent[locale];

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <BreadcrumbChips
          className={styles.breadcrumbs}
          ariaLabel={content.breadcrumbsAria}
          items={[
            { label: homeLabel, href: "/home" },
            { label: publicOfferLabel, current: true },
          ]}
        />

        <div className={styles.content}>
          <h1 className={styles.title}>{content.title}</h1>

          <div className={styles.intro}>
            {content.introduction.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          {content.sections.map((section) => (
            <section
              key={section.id}
              className={styles.section}
              aria-labelledby={section.id}
            >
              <h2 id={section.id} className={styles.sectionTitle}>
                {section.title}
              </h2>

              <div className={styles.sectionText}>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={`${section.id}-${paragraph}`}
                    className={styles.paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
