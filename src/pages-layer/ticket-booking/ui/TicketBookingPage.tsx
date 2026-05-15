"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import BreadcrumbChips from "@/src/shared/ui/BreadcrumbChips/BreadcrumbChips";
import { type PopularRoute, getLocalizedRouteValue } from "@/src/entities/trip";
import LocaleLink from "@/src/shared/i18n/Link";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import styles from "./ticket-booking-page.module.css";

type TicketBookingPageProps = {
  route: PopularRoute;
  initialSeats: number;
};

const MAX_BOOKING_SEATS = 7;

function formatDisplayDate(value: string | null, locale: string) {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  }).format(parsedDate);
}

function formatDisplayTime(value: string | null) {
  if (!value) {
    return "--:--";
  }

  const timeMatch = value.match(/(\d{2}:\d{2})/);
  return timeMatch?.[1] ?? value;
}

function formatHeroDate(value: string) {
  return value.replace(
    /(^\d+\s+)(\p{L})/u,
    (_match, prefix: string, firstLetter: string) => {
      return `${prefix}${firstLetter.toUpperCase()}`;
    },
  );
}

function getPassengerLabelKey(count: number, lang: "uk" | "en") {
  if (lang === "en") {
    return count === 1 ? "one" : "other";
  }

  const n = Math.abs(count) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) {
    return "many";
  }

  if (n1 > 1 && n1 < 5) {
    return "few";
  }

  if (n1 === 1) {
    return "one";
  }

  return "many";
}

export default function TicketBookingPage({
  route,
  initialSeats,
}: TicketBookingPageProps) {
  const { lang, t } = useI18n();
  const locale = lang === "en" ? "en-GB" : "uk-UA";
  const maxBookableSeats = Math.max(
    1,
    Math.min(route.maxSeats, MAX_BOOKING_SEATS),
  );
  const safeInitialSeats = Math.min(
    Math.max(initialSeats, 1),
    maxBookableSeats,
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState(safeInitialSeats);

  const routeTitle = getLocalizedRouteValue(route.title, lang);
  const nearestTripLabel = getLocalizedRouteValue(route.nearestTripLabel, lang);
  const departureCity = getLocalizedRouteValue(route.departureCity, lang);
  const departureStop = getLocalizedRouteValue(route.departureStop, lang);
  const arrivalCity = getLocalizedRouteValue(route.arrivalCity, lang);
  const arrivalStop = getLocalizedRouteValue(route.arrivalStop, lang);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(lang === "en" ? "en-US" : "uk-UA", {
        maximumFractionDigits: 0,
      }),
    [lang],
  );

  const totalPrice = route.price * seats;
  const formattedDate = formatDisplayDate(route.tripDate, locale);
  const departureTime = formatDisplayTime(route.departureTime);
  const arrivalTime = formatDisplayTime(route.arrivalTime);
  const passengerCount = `${seats} ${t(`ticketBooking.hero.passenger.${getPassengerLabelKey(seats, lang)}`)}`;
  const heroMeta = formattedDate
    ? `${formatHeroDate(formattedDate)}${route.departureTime ? ` ${t("ticketBooking.hero.timePrefix")} ${departureTime}` : ""}, ${passengerCount}`
    : `${nearestTripLabel}, ${passengerCount}`;

  return (
    <main className={styles.page}>
      <section className={styles.headBlock}>
        <div className={styles.container}>
          <BreadcrumbChips
            className={styles.breadcrumbs}
            ariaLabel={t("ticketBooking.breadcrumbsAria")}
            items={[
              { label: t("ticketBooking.breadcrumbs.home"), href: "/#home" },
              {
                label: t("ticketBooking.breadcrumbs.routes"),
                href: "/#routes",
              },
              { label: t("ticketBooking.breadcrumbs.current"), current: true },
            ]}
          />
        </div>

        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {t("ticketBooking.routePrefix")}: {routeTitle}
            </h1>
            <p className={styles.heroMeta}>{heroMeta}</p>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.layout}>
          <section>
            <section
              className={styles.formCard}
              aria-labelledby="ticket-booking-form-title"
            >
              <h2 id="ticket-booking-form-title" className={styles.formTitle}>
                {t("ticketBooking.form.title")}
              </h2>

              <form
                className={styles.form}
                onSubmit={(event) => event.preventDefault()}
              >
                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span className={styles.label}>
                      {t("ticketBooking.form.nameLabel")}
                    </span>
                    <input
                      className={styles.input}
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder={t("ticketBooking.form.namePlaceholder")}
                      autoComplete="name"
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>
                      {t("ticketBooking.form.emailLabel")}
                    </span>
                    <input
                      className={styles.input}
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t("ticketBooking.form.emailPlaceholder")}
                      autoComplete="email"
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>
                      {t("ticketBooking.form.phoneLabel")}
                    </span>
                    <input
                      className={styles.input}
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder={t("ticketBooking.form.phonePlaceholder")}
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>

                  <div className={styles.field}>
                    <span className={styles.label}>
                      {t("ticketBooking.form.seatsLabel")} (Макс.{" "}
                      {maxBookableSeats})*
                    </span>

                    <div className={styles.seatsRow}>
                      <div className={styles.stepper}>
                        <button
                          type="button"
                          className={styles.stepperButton}
                          aria-label={t("ticketBooking.controls.decreaseSeats")}
                          onClick={() =>
                            setSeats((current) => Math.max(1, current - 1))
                          }
                          disabled={seats <= 1}
                        >
                          -
                        </button>

                        <span className={styles.stepperValue}>{seats}</span>

                        <button
                          type="button"
                          className={styles.stepperButton}
                          aria-label={t("ticketBooking.controls.increaseSeats")}
                          onClick={() =>
                            setSeats((current) =>
                              Math.min(maxBookableSeats, current + 1),
                            )
                          }
                          disabled={seats >= maxBookableSeats}
                        >
                          +
                        </button>
                      </div>

                      <span className={styles.seatsHint}>
                        {t("ticketBooking.form.seatsHint")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.identityNote}>
                  <p>{t("ticketBooking.form.identityNote")}</p>
                </div>
              </form>
            </section>
            <section
              className={styles.paymentCard}
              aria-labelledby="payment-section-title"
            >
              <div className={styles.actionBlock}>
                <div className={styles.paymentSecurity}>
                  <span className={styles.paymentText}>
                    {t("ticketBooking.payment.secure")}
                  </span>

                  <div className={styles.paymentMarks} aria-hidden="true">
                    <Image
                      src="/icons/tickets/logos_visa.svg"
                      alt=""
                      width={68}
                      height={22}
                      className={styles.paymentLogoVisa}
                    />
                    <Image
                      src="/icons/tickets/logos_mastercard.svg"
                      alt=""
                      width={31}
                      height={24}
                      className={styles.paymentLogoMastercard}
                    />
                    <Image
                      src="/icons/tickets/logos_maestro.svg"
                      alt=""
                      width={31}
                      height={24}
                      className={styles.paymentLogoMaestro}
                    />
                  </div>
                </div>

                <div className={styles.actions}>
                  <Button
                    text={t("ticketBooking.form.pay")}
                    fullWidth={false}
                    onClick={() => {}}
                  />
                  <Button
                    text={t("ticketBooking.form.reserve")}
                    variant="secondary"
                    fullWidth={false}
                    onClick={() => {}}
                  />
                </div>

                <p className={styles.termsText}>
                  {t("ticketBooking.payment.termsPrefix")}{" "}
                  <LocaleLink href="/public-offer" className={styles.termsLink}>
                    {t("ticketBooking.payment.termsLink")}
                  </LocaleLink>
                </p>
              </div>
            </section>
          </section>

          <aside className={styles.sidebarCard}>
            <section className={styles.sidebarSection}>
              <h2 className={styles.sidebarTitle}>
                {t("ticketBooking.routeCard.aboutTitle")}
              </h2>

              <div className={styles.routeInfo}>
                <div className={styles.routeTimes}>
                  <span>{departureTime}</span>
                  <span>{arrivalTime}</span>
                </div>

                <div className={styles.routeTimeline} aria-hidden="true">
                  <span className={styles.timelineStart} />
                  <span className={styles.timelineDots} />
                  <span className={styles.timelineEnd} />
                </div>

                <div className={styles.routeStops}>
                  <div className={styles.routeStop}>
                    <strong>{departureCity}</strong>
                    {departureStop ? <span>{departureStop}</span> : null}
                  </div>

                  <div className={styles.routeStop}>
                    <strong>{arrivalCity}</strong>
                    {arrivalStop ? <span>{arrivalStop}</span> : null}
                  </div>
                </div>
              </div>
            </section>

            <div className={styles.sidebarDivider} />

            <section className={styles.sidebarSection}>
              <h2 className={styles.sidebarTitle}>
                {t("ticketBooking.routeCard.title")}
              </h2>

              <div className={styles.summaryRow}>
                <span>
                  {t(
                    `ticketBooking.routeCard.passenger.${getPassengerLabelKey(seats, lang)}`,
                  )}
                  :
                </span>
                <strong>{seats}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>{t("ticketBooking.routeCard.total")}:</span>
                <strong>{priceFormatter.format(totalPrice)} ₴</strong>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
