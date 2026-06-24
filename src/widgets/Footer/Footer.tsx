// Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

import styles from "./Footer.module.css";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { usePhones } from "@/src/entities/dashboard/api/useSettingsQueries";

const MAP_QUERY = "вулиця Митницька, 7, Черкаси, Черкаська область, 18000";

export default function Footer() {
  const { t } = useI18n();
  const phones = usePhones();
  const localizeHref = useLocalizedHref();

  const src = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer} id="contacts" aria-label={t("footer.ariaLabel")}>
      <div className={styles.container}>
        <div className={styles.contacts}>
          {/* Column 1: Time & Address */}
          <div className={styles.contactColumn}>
            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/icons/Footer/clock.svg"
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles.textColumn}>
                <div className={styles.contactText}>{t("footer.workTime")}</div>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/icons/Footer/map-point.svg"
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles.textColumn}>
                <div className={styles.contactText}>{t("footer.addressLine1")}</div>
                <div className={styles.contactTextMuted}>{t("footer.addressLine2")}</div>
              </div>
            </div>
          </div>

          {/* Column 2: Phones */}
          <div className={styles.contactColumn}>
            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/icons/Footer/phone.svg"
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles.textColumn}>
                {phones.map((item) => (
                  <a key={`popup-${item.href}`} className={styles.contactLink} href={item.href}>
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Public Offer */}
          <div className={styles.contactColumn}>
            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/icons/Footer/lets-icons_order-light.svg"
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles.textColumn}>
                <Link href={localizeHref("/public-offer")} className={styles.offerText}>
                  {t("footer.publicOffer")}
                </Link>
              </div>
            </div>
          </div>

          {/* Column 4: Socials */}
          <div className={styles.contactColumn}>
            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/icons/Footer/insta.svg"
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles.textColumn}>
                <a
                  className={styles.offerText}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/icons/Footer/fs.svg"
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles.textColumn}>
                <a
                  className={styles.offerText}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mapWrap}>
          <iframe
            className={styles.map}
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t("footer.mapTitle")}
          />
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copy}>{t("footer.copy")}</div>

          <button
            className={styles.mobileTopBar}
            type="button"
            onClick={scrollToTop}
            aria-label={t("footer.scrollTop")}
          >
            <Image
              className={styles.mobileTopBarIcon}
              src="/icons/Footer/Bar.svg"
              alt=""
              aria-hidden="true"
              width={152}
              height={5}
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
