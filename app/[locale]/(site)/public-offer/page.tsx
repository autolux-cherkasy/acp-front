import type { Metadata } from "next";

import PublicOfferPage from "@/src/pages-layer/public-offer/ui/PublicOfferPage";
import { hasLocale } from "@/src/shared/i18n/config";
import { getDictionary } from "@/src/shared/i18n/getDictionary";
import type { MessageValue } from "@/src/shared/i18n/types";
import { createPageMetadata, getSeoCopy } from "@/src/shared/seo/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function isMessageRecord(
  value: MessageValue | undefined,
): value is Record<string, MessageValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNestedString(
  value: MessageValue | undefined,
  key: string,
  fallback: string,
): string {
  if (!isMessageRecord(value)) {
    return fallback;
  }

  const nestedValue = value[key];
  return typeof nestedValue === "string" ? nestedValue : fallback;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const seo = getSeoCopy(locale);

  return createPageMetadata({
    locale,
    pathname: "/public-offer",
    title: seo.publicOffer.title,
    description: seo.publicOffer.description,
    keywords: seo.publicOffer.keywords,
  });
}

export default async function PublicOfferRoutePage({ params }: PageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return null;
  }

  const dictionary = await getDictionary(locale);

  return (
    <PublicOfferPage
      locale={locale}
      homeLabel={getNestedString(dictionary.menu, "home", "Home")}
      publicOfferLabel={getNestedString(
        dictionary.publicOffer,
        "title",
        "Public offer",
      )}
    />
  );
}
