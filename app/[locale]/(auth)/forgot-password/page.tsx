import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildDirectAuthRedirectHref } from "@/src/features/auth/model/auth-flow";
import { hasLocale } from "@/src/shared/i18n/config";
import { createPageMetadata, getSeoCopy } from "@/src/shared/seo/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const seo = getSeoCopy(locale);

  return createPageMetadata({
    locale,
    pathname: "/forgot-password",
    title: seo.forgotPassword.title,
    description: seo.forgotPassword.description,
    keywords: seo.forgotPassword.keywords,
    noIndex: true,
  });
}

export default async function ForgotPasswordRoutePage({ params }: PageProps) {
  const { locale } = await params;
  const safeLocale = hasLocale(locale) ? locale : "uk";

  redirect(buildDirectAuthRedirectHref(safeLocale, "forgot-password"));
}
