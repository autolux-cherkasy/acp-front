import { NextResponse, type NextRequest } from "next/server";

import {
  defaultLocale,
  legacyLocaleCookieName,
  localeCookieName,
  normalizeLocale,
  type Locale,
} from "@/src/shared/i18n/config";
import {
  getLocaleFromPathname,
  stripLocaleFromPathname,
} from "@/src/shared/i18n/routing";

function resolveRequestLocale(request: NextRequest): Locale {
  const explicitLocale = normalizeLocale(request.cookies.get(localeCookieName)?.value);

  if (explicitLocale) {
    return explicitLocale;
  }

  const legacyLocale = normalizeLocale(request.cookies.get(legacyLocaleCookieName)?.value);

  if (legacyLocale) {
    return legacyLocale;
  }

  return defaultLocale;
}

function withLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(localeCookieName, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeInPath = getLocaleFromPathname(pathname);

  if (localeInPath) {
    if (localeInPath === defaultLocale) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = stripLocaleFromPathname(pathname);

      return withLocaleCookie(NextResponse.redirect(redirectUrl), defaultLocale);
    }

    return withLocaleCookie(NextResponse.next(), localeInPath);
  }

  const locale = resolveRequestLocale(request);
  const destinationUrl = request.nextUrl.clone();
  destinationUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  if (locale === defaultLocale) {
    return withLocaleCookie(NextResponse.rewrite(destinationUrl), locale);
  }

  return withLocaleCookie(NextResponse.redirect(destinationUrl), locale);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
