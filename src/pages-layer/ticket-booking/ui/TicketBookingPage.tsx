"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useReserveAndPayMutation,
  useReserveBookingMutation,
  type CreateBookingPayload,
} from "@/src/entities/booking";
import { Trip, TripStop } from "@/src/entities/trip";
import { useProfileQuery } from "@/src/entities/user/api/useUserQueries";
import { fetchCsrfToken } from "@/src/features/auth/api/auth";
import { useRequestGuestOtpMutation } from "@/src/features/auth/api/useAuthQueries";
import { useAuthSession } from "@/src/features/auth/model/session";
import EmailConfirmationModal from "@/src/features/email-confirmation/ui/EmailConfirmationModal";
import { API_ORIGIN } from "@/src/shared/api/http";
import { getCsrfToken, setCsrfToken } from "@/src/shared/api/session";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import LocaleLink from "@/src/shared/i18n/Link";
import { useServerToast } from "@/src/shared/lib/toast";
import BreadcrumbChips from "@/src/shared/ui/BreadcrumbChips/BreadcrumbChips";
import Button from "@/src/shared/ui/Button/Button";
import styles from "./ticket-booking-page.module.css";

type TicketBookingPageProps = {
  trip: Trip;
  initialSeats: number;
  boardingStop: TripStop | undefined;
  alightingStop: TripStop | undefined;
  departureTime: string | null;
  arrivalTime: string | null;
};

type PassengerFormData = {
  fullName: string;
  email: string;
  phone: string;
};

const MAX_BOOKING_SEATS = 7;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+380\d{9}$/;

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

function formatDisplayTime(value: string | null, locale: string) {
  if (!value) {
    return "--:--";
  }

  const parsedDate = new Date(value);
  if (!Number.isNaN(parsedDate.getTime())) {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(parsedDate);
  }

  const timeMatch = value.match(/(\d{2}:\d{2})/);
  return timeMatch?.[1] ?? value;
}

function formatHeroDate(value: string) {
  return value.replace(
    /(^\d+\s+)(\p{L})/u,
    (_match, prefix: string, firstLetter: string) => `${prefix}${firstLetter.toUpperCase()}`,
  );
}

function parseCity(value: string): { city: string; stop: string | null } {
  const match = value.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  return { city: match?.[1] ?? value, stop: match?.[2] ?? null };
}

async function ensureCsrfToken() {
  if (getCsrfToken()) return;
  const data = await fetchCsrfToken();
  if (data?.csrf_token) setCsrfToken(data.csrf_token);
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
  trip,
  initialSeats,
  boardingStop,
  alightingStop,
  departureTime: rawDepartureTime,
  arrivalTime: rawArrivalTime,
}: TicketBookingPageProps) {
  const router = useRouter();
  const resolveHref = useLocalizedHref();
  const { isAuthenticated } = useAuthSession();
  const { notifyError, notifySuccess } = useServerToast();
  const reserveMutation = useReserveBookingMutation();
  const payMutation = useReserveAndPayMutation();
  const requestGuestOtpMutation = useRequestGuestOtpMutation();
  const { lang, t } = useI18n();
  const profileQuery = useProfileQuery();
  const locale = lang === "en" ? "en-GB" : "uk-UA";
  const [guestOtpOpen, setGuestOtpOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{
    mode: "reserve" | "pay";
    payload: CreateBookingPayload;
  } | null>(null);
  const maxBookableSeats = Math.max(1, Math.min(trip.totalSeats ?? 0, MAX_BOOKING_SEATS));
  const safeInitialSeats = Math.min(Math.max(initialSeats, 1), maxBookableSeats);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PassengerFormData>({
    defaultValues: {
      fullName: profileQuery.data?.name ?? "",
      email: profileQuery.data?.email ?? "",
      phone: profileQuery.data?.phone ?? "",
    },
  });
  const [seats, setSeats] = useState(safeInitialSeats);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(lang === "en" ? "en-US" : "uk-UA", {
        maximumFractionDigits: 0,
      }),
    [lang],
  );

  const pricePerSeat = alightingStop
    ? alightingStop.priceFromOrigin - (boardingStop?.priceFromOrigin ?? 0)
    : (trip.price ?? 0);
  const totalPrice = pricePerSeat * seats;
  const formattedDate = formatDisplayDate(trip.date, locale);
  const departureTime = formatDisplayTime(rawDepartureTime ?? trip.departureTime, locale);
  const arrivalTime = formatDisplayTime(rawArrivalTime ?? trip.arrivalTime, locale);
  const passengerCount = `${seats} ${t(`ticketBooking.hero.passenger.${getPassengerLabelKey(seats, lang)}`)}`;
  const heroMeta =
    formattedDate &&
    `${formatHeroDate(formattedDate)}${trip.departureTime ? ` ${t("ticketBooking.hero.timePrefix")} ${departureTime}` : ""}, ${passengerCount}`;
  const seatsLabel =
    lang === "en"
      ? `Seats (max. ${maxBookableSeats})*`
      : `Кількість місць (макс. ${maxBookableSeats})*`;

  useEffect(() => {
    if (!profileQuery.data) return;

    reset({
      fullName: profileQuery.data.name ?? "",
      email: profileQuery.data.email ?? "",
      phone: profileQuery.data.phone ?? "",
    });
  }, [profileQuery.data, reset]);

  const isSubmitting =
    reserveMutation.isPending ||
    payMutation.isPending ||
    requestGuestOtpMutation.isPending;

  const completeBooking = async (
    mode: "reserve" | "pay",
    payload: CreateBookingPayload,
    guestToken?: string,
  ) => {
    await ensureCsrfToken();

    if (mode === "pay") {
      const result = await payMutation.mutateAsync({ payload, guestToken });
      if (!result.checkoutPageUrl) {
        notifyError(null, t("ticketBooking.toast.paymentUnavailable"));
        return;
      }
      const url = /^https?:\/\//.test(result.checkoutPageUrl)
        ? result.checkoutPageUrl
        : `${API_ORIGIN ?? ""}${result.checkoutPageUrl}`;
      window.location.assign(url);
      return;
    }

    const result = await reserveMutation.mutateAsync({ payload, guestToken });
    notifySuccess(
      {
        message: `${t("ticketBooking.toast.reserveSuccess")} ${result.booking.referenceCode}`,
      },
      t("ticketBooking.toast.reserveSuccess"),
    );

    if (isAuthenticated) {
      router.push(resolveHref("/profile/tickets"));
      return;
    }

    router.push(resolveHref("/home"));
  };

  const submitPassengerForm = (mode: "reserve" | "pay") =>
    handleSubmit(async (data) => {
      if (!boardingStop?.id || !alightingStop?.id) {
        notifyError(null, t("ticketBooking.toast.missingStops"));
        return;
      }

      const payload: CreateBookingPayload = {
        passengerName: data.fullName.trim(),
        passengerPhone: data.phone.trim(),
        passengerEmail: data.email.trim().toLowerCase(),
        seatsCount: seats,
        tripId: trip.id,
        boardingStopId: boardingStop.id,
        alightingStopId: alightingStop.id,
      };

      try {
        if (isAuthenticated) {
          await completeBooking(mode, payload);
          return;
        }

        setPendingBooking({ mode, payload });
        await requestGuestOtpMutation.mutateAsync(payload.passengerEmail);
        notifySuccess(null, t("ticketBooking.otpModal.resendSuccess"));
        setGuestOtpOpen(true);
      } catch (error) {
        setPendingBooking(null);
        setGuestOtpOpen(false);
        notifyError(
          error,
          isAuthenticated
            ? t("ticketBooking.toast.reserveError")
            : t("ticketBooking.otpModal.requestError"),
        );
      }
    });

  const closeGuestOtp = () => {
    setGuestOtpOpen(false);
    setPendingBooking(null);
  };

  const confirmGuestOtp = async (_code: string, guestToken?: string) => {
    if (!pendingBooking || !guestToken) {
      notifyError(null, t("ticketBooking.emailConfirmationModal.wrongCode"));
      return;
    }

    try {
      const { mode, payload } = pendingBooking;
      setGuestOtpOpen(false);
      await completeBooking(mode, payload, guestToken);
      setPendingBooking(null);
    } catch (error) {
      notifyError(error, t("ticketBooking.toast.reserveError"));
    }
  };

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
              {t("ticketBooking.routePrefix")}: {`${boardingStop?.name} - ${alightingStop?.name}`}
            </h1>
            <p className={styles.heroMeta}>{heroMeta}</p>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.layout}>
          <section className={styles.mainColumn}>
            <section className={styles.formCard} aria-labelledby="ticket-booking-form-title">
              <h2 id="ticket-booking-form-title" className={styles.sectionTitle}>
                {t("ticketBooking.form.title")}
              </h2>

              <form className={styles.form} onSubmit={submitPassengerForm("reserve")} noValidate>
                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <span className={styles.label}>{t("ticketBooking.form.nameLabel")}</span>
                    <input
                      className={`${styles.input} ${errors.fullName ? styles.inputInvalid : ""}`}
                      type="text"
                      {...register("fullName", {
                        required: t("ticketBooking.form.namePlaceholder"),
                      })}
                      placeholder={t("ticketBooking.form.namePlaceholder")}
                      autoComplete="name"
                      aria-invalid={errors.fullName ? "true" : "false"}
                      aria-describedby={
                        errors.fullName ? "ticket-booking-full-name-error" : undefined
                      }
                    />
                    {errors.fullName?.message ? (
                      <span
                        id="ticket-booking-full-name-error"
                        className={styles.fieldError}
                        role="alert"
                      >
                        {errors.fullName.message}
                      </span>
                    ) : null}
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>{t("ticketBooking.form.emailLabel")}</span>
                    <input
                      className={`${styles.input} ${errors.email ? styles.inputInvalid : ""}`}
                      type="email"
                      {...register("email", {
                        required: t("auth.register.errors.emailRequired"),
                        validate: (value) =>
                          EMAIL_PATTERN.test(value.trim()) ||
                          t("auth.register.errors.emailInvalid"),
                      })}
                      placeholder={t("ticketBooking.form.emailPlaceholder")}
                      autoComplete="email"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "ticket-booking-email-error" : undefined}
                    />
                    {errors.email?.message ? (
                      <span
                        id="ticket-booking-email-error"
                        className={styles.fieldError}
                        role="alert"
                      >
                        {errors.email.message}
                      </span>
                    ) : null}
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>{t("ticketBooking.form.phoneLabel")}</span>
                    <input
                      className={`${styles.input} ${errors.phone ? styles.inputInvalid : ""}`}
                      type="tel"
                      {...register("phone", {
                        required: t("auth.register.errors.phoneRequired"),
                        validate: (value) =>
                          PHONE_PATTERN.test(value.trim()) || t("auth.register.errors.phoneFormat"),
                      })}
                      placeholder={t("ticketBooking.form.phonePlaceholder")}
                      autoComplete="tel"
                      inputMode="tel"
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={errors.phone ? "ticket-booking-phone-error" : undefined}
                    />
                    {errors.phone?.message ? (
                      <span
                        id="ticket-booking-phone-error"
                        className={styles.fieldError}
                        role="alert"
                      >
                        {errors.phone.message}
                      </span>
                    ) : null}
                  </label>

                  <div className={styles.field}>
                    <span className={styles.label}>{seatsLabel}</span>

                    <div className={styles.seatsRow}>
                      <div className={styles.stepper}>
                        <button
                          type="button"
                          className={styles.stepperButton}
                          aria-label={t("ticketBooking.controls.decreaseSeats")}
                          onClick={() => setSeats((current) => Math.max(1, current - 1))}
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
                            setSeats((current) => Math.min(maxBookableSeats, current + 1))
                          }
                          disabled={seats >= maxBookableSeats}
                        >
                          +
                        </button>
                      </div>

                      <span className={styles.secondaryText}>
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
            <section className={styles.paymentCard} aria-labelledby="payment-section-title">
              <div className={styles.actionBlock}>
                <div className={styles.paymentSecurity}>
                  <span className={styles.paymentText}>{t("ticketBooking.payment.secure")}</span>

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
                    size="md"
                    disabled={isSubmitting}
                    onClick={() => {
                      void submitPassengerForm("pay")();
                    }}
                  />
                  <Button
                    text={t("ticketBooking.form.reserve")}
                    variant="secondary"
                    size="md"
                    disabled={isSubmitting}
                    onClick={() => {
                      void submitPassengerForm("reserve")();
                    }}
                  />
                </div>

                <p className={`${styles.termsText} ${styles.secondaryText}`}>
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
              <h2 className={styles.sectionTitle}>{t("ticketBooking.routeCard.aboutTitle")}</h2>

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
                    <strong>{boardingStop?.name ?? trip.from}</strong>
                  </div>

                  <div className={styles.routeStop}>
                    <strong>{alightingStop?.name ?? trip.to}</strong>
                  </div>
                </div>
              </div>
            </section>

            <div className={styles.sidebarDivider} />

            <section className={styles.sidebarSection}>
              <h2 className={styles.sectionTitle}>{t("ticketBooking.routeCard.title")}</h2>

              <div className={styles.summaryRow}>
                <span>
                  {t(`ticketBooking.routeCard.passenger.${getPassengerLabelKey(seats, lang)}`)}:
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

      {guestOtpOpen && pendingBooking ? (
        <EmailConfirmationModal
          context={pendingBooking.mode === "pay" ? "payment" : "booking"}
          email={pendingBooking.payload.passengerEmail}
          onClose={closeGuestOtp}
          onChangeEmail={closeGuestOtp}
          onConfirm={(code, guestToken) => {
            void confirmGuestOtp(code, guestToken);
          }}
          onResend={() => {
            void requestGuestOtpMutation
              .mutateAsync(pendingBooking.payload.passengerEmail)
              .then(() => {
                notifySuccess(null, t("ticketBooking.otpModal.resendSuccess"));
              })
              .catch((error) => {
                notifyError(error, t("ticketBooking.otpModal.resendError"));
              });
          }}
        />
      ) : null}
    </main>
  );
}
