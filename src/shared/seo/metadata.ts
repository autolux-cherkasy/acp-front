import type { Metadata } from "next";

import { defaultLocale, type Locale } from "@/src/shared/i18n/config";
import { localizeHref } from "@/src/shared/i18n/routing";

import { defaultOgImagePath, siteUrl } from "./config";

type StaticPageSeo = {
  title: string;
  description: string;
  keywords: string[];
};

type LocaleSeo = {
  siteName: string;
  defaultDescription: string;
  defaultKeywords: string[];
  home: StaticPageSeo;
  cafe: StaticPageSeo;
  publicOffer: StaticPageSeo;
  login: StaticPageSeo;
  register: StaticPageSeo;
  forgotPassword: StaticPageSeo;
  resetPassword: StaticPageSeo;
  profile: StaticPageSeo;
  profileTickets: StaticPageSeo;
  notFound: StaticPageSeo;
  category: string;
};

const openGraphLocaleByLocale: Record<Locale, string> = {
  uk: "uk_UA",
  en: "en_US",
};

const seoByLocale: Record<Locale, LocaleSeo> = {
  uk: {
    siteName: "Автолюкс Черкаси-Плюс",
    defaultDescription:
      "Пасажирські перевезення по Україні, бронювання та купівля квитків онлайн, актуальні маршрути з Черкас і комфортні поїздки.",
    defaultKeywords: [
      "пасажирські перевезення",
      "автобусні перевезення",
      "бронювання квитків",
      "квитки онлайн",
      "рейси з Черкас",
      "Автолюкс Черкаси-Плюс",
    ],
    home: {
      title: "Пасажирські перевезення та бронювання квитків",
      description:
        "Комфортні автобусні перевезення, популярні маршрути, бронювання місць і онлайн-купівля квитків від Автолюкс Черкаси-Плюс.",
      keywords: ["автобусні рейси", "замовити квиток", "маршрути по Україні"],
    },
    cafe: {
      title: "Кафе та зона очікування",
      description:
        "Кафе Автолюкс Черкаси-Плюс: комфортна зона очікування для пасажирів перед відправленням рейсу.",
      keywords: ["кафе автостанції", "зона очікування", "кава перед рейсом"],
    },
    publicOffer: {
      title: "Договір публічної оферти",
      description:
        "Умови бронювання, оформлення та придбання квитків, правила користування сервісом і порядок взаємодії з Автолюкс Черкаси-Плюс.",
      keywords: ["публічна оферта", "умови бронювання", "правила перевезення"],
    },
    login: {
      title: "Вхід до особистого кабінету",
      description: "Сторінка входу до особистого кабінету пасажира Автолюкс Черкаси-Плюс.",
      keywords: ["вхід", "особистий кабінет", "авторизація"],
    },
    register: {
      title: "Реєстрація пасажира",
      description:
        "Створіть акаунт в Автолюкс Черкаси-Плюс для бронювання квитків і керування поїздками.",
      keywords: ["реєстрація", "створити акаунт", "бронювання поїздок"],
    },
    forgotPassword: {
      title: "Відновлення пароля",
      description: "Сторінка відновлення доступу до особистого кабінету Автолюкс Черкаси-Плюс.",
      keywords: ["відновлення пароля", "доступ до акаунта", "змінити пароль"],
    },
    resetPassword: {
      title: "Створення нового пароля",
      description:
        "Оновіть пароль для особистого кабінету Автолюкс Черкаси-Плюс за посиланням із листа.",
      keywords: ["новий пароль", "скидання пароля", "відновлення доступу"],
    },
    profile: {
      title: "Профіль користувача",
      description: "Керування даними профілю та налаштуваннями особистого кабінету пасажира.",
      keywords: ["профіль", "особистий кабінет", "налаштування акаунта"],
    },
    profileTickets: {
      title: "Мої квитки",
      description: "Перегляд активних квитків і керування замовленнями в особистому кабінеті.",
      keywords: ["мої квитки", "замовлення", "історія поїздок"],
    },
    notFound: {
      title: "Сторінку не знайдено",
      description:
        "Запитану сторінку не знайдено. Поверніться на головну або скористайтеся навігацією сайту.",
      keywords: ["404", "сторінку не знайдено"],
    },
    category: "пасажирські перевезення",
  },
  en: {
    siteName: "Autolux Cherkasy-Plus",
    defaultDescription:
      "Passenger transportation across Ukraine, online ticket booking, current routes from Cherkasy, and comfortable bus trips.",
    defaultKeywords: [
      "passenger transportation",
      "bus tickets online",
      "ticket booking",
      "routes from Cherkasy",
      "Autolux Cherkasy-Plus",
      "bus travel in Ukraine",
    ],
    home: {
      title: "Passenger transportation and ticket booking",
      description:
        "Comfortable bus trips, popular routes, seat booking, and online ticket purchases from Autolux Cherkasy-Plus.",
      keywords: ["bus routes", "book tickets online", "travel across Ukraine"],
    },
    cafe: {
      title: "Cafe and waiting area",
      description:
        "Autolux Cherkasy-Plus cafe: a comfortable waiting area for passengers before departure.",
      keywords: ["bus station cafe", "waiting area", "coffee before departure"],
    },
    publicOffer: {
      title: "Public Offer Agreement",
      description:
        "Terms for booking, issuing, and purchasing tickets, service rules, and customer interaction conditions at Autolux Cherkasy-Plus.",
      keywords: ["public offer", "booking terms", "transportation rules"],
    },
    login: {
      title: "Sign in to your account",
      description: "Passenger account sign-in page for Autolux Cherkasy-Plus.",
      keywords: ["sign in", "account", "authorization"],
    },
    register: {
      title: "Passenger registration",
      description: "Create an Autolux Cherkasy-Plus account to book tickets and manage your trips.",
      keywords: ["registration", "create account", "trip booking"],
    },
    forgotPassword: {
      title: "Password recovery",
      description: "Restore access to your Autolux Cherkasy-Plus passenger account.",
      keywords: ["password recovery", "account access", "reset password"],
    },
    resetPassword: {
      title: "Create a new password",
      description:
        "Update your Autolux Cherkasy-Plus account password using the link from the email.",
      keywords: ["new password", "reset password", "account recovery"],
    },
    profile: {
      title: "User profile",
      description: "Manage your profile details and passenger account settings.",
      keywords: ["profile", "account settings", "personal cabinet"],
    },
    profileTickets: {
      title: "My tickets",
      description: "View active tickets and manage your travel orders in your account.",
      keywords: ["my tickets", "orders", "travel history"],
    },
    notFound: {
      title: "Page not found",
      description:
        "The requested page could not be found. Return to the homepage or continue using the site navigation.",
      keywords: ["404", "page not found"],
    },
    category: "transportation",
  },
};

type PageMetadataOptions = {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  keywords?: string[];
  imagePath?: string;
  noIndex?: boolean;
};

function normalizePathname(pathname: string) {
  if (!pathname) {
    return "/";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function dedupe(items: string[]) {
  return Array.from(new Set(items));
}

export function getSeoCopy(locale: Locale) {
  return seoByLocale[locale];
}

export function buildAbsoluteUrl(pathname: string) {
  return new URL(normalizePathname(pathname), siteUrl).toString();
}

export function getLocaleAlternates(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);

  return {
    uk: buildAbsoluteUrl(localizeHref(normalizedPathname, "uk")),
    en: buildAbsoluteUrl(localizeHref(normalizedPathname, "en")),
    "x-default": buildAbsoluteUrl(localizeHref(normalizedPathname, defaultLocale)),
  };
}

function getFullTitle(locale: Locale, title: string) {
  const { siteName } = getSeoCopy(locale);
  return title === siteName ? title : `${title} | ${siteName}`;
}

export function createSiteMetadata(locale: Locale): Metadata {
  const seo = getSeoCopy(locale);
  const defaultCanonical = buildAbsoluteUrl(localizeHref("/", locale));
  const imageUrl = buildAbsoluteUrl(defaultOgImagePath);

  return {
    metadataBase: siteUrl,
    applicationName: seo.siteName,
    title: {
      default: seo.siteName,
      template: `%s | ${seo.siteName}`,
    },
    description: seo.defaultDescription,
    keywords: seo.defaultKeywords,
    authors: [{ name: seo.siteName }],
    creator: seo.siteName,
    publisher: seo.siteName,
    category: seo.category,
    openGraph: {
      type: "website",
      locale: openGraphLocaleByLocale[locale],
      url: defaultCanonical,
      siteName: seo.siteName,
      title: seo.siteName,
      description: seo.defaultDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: seo.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteName,
      description: seo.defaultDescription,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/favicon-light.svg", type: "image/svg+xml" },
        { url: "/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      ],
    },
  };
}

export function createPageMetadata({
  locale,
  pathname,
  title,
  description,
  keywords = [],
  imagePath = defaultOgImagePath,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const seo = getSeoCopy(locale);
  const normalizedPathname = normalizePathname(pathname);
  const localizedPathname = localizeHref(normalizedPathname, locale);
  const canonical = buildAbsoluteUrl(localizedPathname);
  const fullTitle = getFullTitle(locale, title);
  const imageUrl = buildAbsoluteUrl(imagePath);

  return {
    title,
    description,
    keywords: dedupe([...seo.defaultKeywords, ...keywords]),
    alternates: {
      canonical,
      languages: getLocaleAlternates(normalizedPathname),
    },
    openGraph: {
      type: "website",
      locale: openGraphLocaleByLocale[locale],
      url: canonical,
      siteName: seo.siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function getTicketBookingSeo(routeTitle: string) {
  return {
    title: `Бронювання квитка: ${routeTitle}`,
    description: `Онлайн-бронювання та оплата квитка на рейс ${routeTitle}. Перевіряйте деталі відправлення, місця та дані пасажира перед поїздкою.`,
    keywords: ["бронювання квитка", routeTitle, "онлайн оплата"],
  };
}

export function getOrganizationStructuredData(locale: Locale) {
  const seo = getSeoCopy(locale);
  const addressStreet = locale === "en" ? "Mytnytska St, 7/2" : "вул. Митницька, 7/2";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo.siteName,
    url: buildAbsoluteUrl("/"),
    logo: buildAbsoluteUrl("/logo-sprinter.svg"),
    image: buildAbsoluteUrl(defaultOgImagePath),
    description: seo.defaultDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: addressStreet,
      addressLocality: "Cherkasy",
      postalCode: "18000",
      addressCountry: "UA",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+380974802428",
        contactType: locale === "en" ? "customer support" : "підтримка клієнтів",
        areaServed: "UA",
        availableLanguage: ["uk", "en"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+380939660940",
        contactType: locale === "en" ? "customer support" : "підтримка клієнтів",
        areaServed: "UA",
        availableLanguage: ["uk", "en"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+380990782021",
        contactType: locale === "en" ? "customer support" : "підтримка клієнтів",
        areaServed: "UA",
        availableLanguage: ["uk", "en"],
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "05:00",
        closes: "19:30",
      },
    ],
  };
}
