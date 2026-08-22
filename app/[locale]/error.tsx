"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const containerStyle = {
  minHeight: "60vh",
  display: "grid",
  placeItems: "center",
  padding: "32px 16px",
} as const;

const cardStyle = {
  width: "100%",
  maxWidth: "560px",
  borderRadius: "24px",
  background: "#f4f7f7",
  padding: "32px",
  boxShadow: "0 18px 40px rgba(10, 35, 66, 0.12)",
  textAlign: "center",
} as const;

const buttonStyle = {
  marginTop: "20px",
  border: "none",
  borderRadius: "999px",
  background: "#d8ad2f",
  color: "#183b56",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 700,
  padding: "12px 20px",
} as const;

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { locale } = useI18n();
  const isStaleChunkError = /Failed to load chunk|Loading chunk .* failed/i.test(
    error.message ?? "",
  );
  const message =
    error.message?.trim()
    || (locale === "en" ? "An unexpected error occurred." : "Сталася неочікувана помилка.");

  const handleRetry = () => {
    if (isStaleChunkError && typeof window !== "undefined") {
      window.location.reload();
      return;
    }

    reset();
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} role="alert">
        <h2>{locale === "en" ? "Something went wrong" : "Щось пішло не так"}</h2>
        <p>{message}</p>
        <button type="button" style={buttonStyle} onClick={handleRetry}>
          {locale === "en" ? "Try again" : "Спробувати ще раз"}
        </button>
      </div>
    </div>
  );
}
