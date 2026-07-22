import { getRoleLandingPath } from "@/src/features/access-control/model/roles";
import {
  localizeHref,
  stripLocaleFromPathname,
} from "@/src/shared/i18n/routing";
import type { Locale } from "@/src/shared/i18n/config";
import { ReadonlyURLSearchParams } from "next/navigation";

type RouterLike = {
  push: (href: string, options?: { scroll?: boolean }) => void;
  replace: (href: string, options?: { scroll?: boolean }) => void;
};

type ResolveHref = (href: string) => string;

type AuthModalNavigationOptions = {
  backgroundHref?: string;
  next?: string | null;
  replace?: boolean;
  scroll?: boolean;
};

type UpdateAuthHrefOptions = {
  view?: AuthView | null;
  next?: string | null;
};

export type AuthView = "login" | "register" | "forgot-password";

export const AUTH_QUERY_PARAM = "auth";
export const AUTH_NEXT_QUERY_PARAM = "next";
export const AUTH_FALLBACK_PATH = "/home";
export const AUTH_LOGOUT_BYPASS_KEY = "auth:logout-bypass";
export const AUTH_ERROR_QUERY_PARAM = "error";
export const ACCOUNT_BLOCKED_ERROR_PARAM = "account_blocked";

const AUTH_VIEWS = new Set<AuthView>(["login", "register", "forgot-password"]);
const EXTERNAL_HREF_RE = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

function getCurrentBrowserHref() {
  if (typeof window === "undefined") {
    return null;
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function parseInternalHref(href: string) {
  if (
    !href ||
    EXTERNAL_HREF_RE.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return null;
  }

  const match = href.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);

  if (!match) {
    return null;
  }

  const [, rawPathname = "/", search = "", hash = ""] = match;
  const pathname = rawPathname.startsWith("/")
    ? rawPathname
    : `/${rawPathname}`;

  return {
    pathname,
    search,
    hash,
  };
}

export function isAuthView(
  value: string | null | undefined,
): value is AuthView {
  return value != null && AUTH_VIEWS.has(value as AuthView);
}

export function normalizeInternalHref(href: string | null | undefined) {
  if (!href) {
    return null;
  }

  const parsed = parseInternalHref(href);

  if (!parsed) {
    return null;
  }

  const pathname = stripLocaleFromPathname(parsed.pathname || "/");
  return `${pathname}${parsed.search}${parsed.hash}`;
}

export function buildAuthModalHref(
  href: string,
  { view, next }: UpdateAuthHrefOptions = {},
) {
  const parsed = parseInternalHref(href);

  if (!parsed) {
    return href;
  }

  const searchParams = new URLSearchParams(parsed.search);

  if (view === null) {
    searchParams.delete(AUTH_QUERY_PARAM);
  } else if (view !== undefined) {
    searchParams.set(AUTH_QUERY_PARAM, view);
  }

  if (next === null) {
    searchParams.delete(AUTH_NEXT_QUERY_PARAM);
  } else if (next !== undefined) {
    const normalizedNext = normalizeInternalHref(next);

    if (normalizedNext) {
      searchParams.set(AUTH_NEXT_QUERY_PARAM, normalizedNext);
    } else {
      searchParams.delete(AUTH_NEXT_QUERY_PARAM);
    }
  }

  const search = searchParams.toString();
  return `${parsed.pathname}${search ? `?${search}` : ""}${parsed.hash}`;
}

export function getAuthModalState(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
) {
  const rawView = searchParams.get(AUTH_QUERY_PARAM);

  if (!isAuthView(rawView)) {
    return null;
  }

  return {
    view: rawView,
    next: normalizeInternalHref(searchParams.get(AUTH_NEXT_QUERY_PARAM)),
  };
}

export function openAuthModal(
  router: RouterLike,
  resolveHref: ResolveHref,
  view: AuthView,
  {
    backgroundHref,
    next,
    replace = false,
    scroll = false,
  }: AuthModalNavigationOptions = {},
) {
  const currentHref = backgroundHref ?? getCurrentBrowserHref();

  if (!currentHref) {
    return;
  }

  const href = buildAuthModalHref(currentHref, { view, next });
  const navigate = replace
    ? router.replace.bind(router)
    : router.push.bind(router);

  navigate(resolveHref(href), { scroll });
}

export function closeAuthModal(
  router: RouterLike,
  resolveHref: ResolveHref,
  backgroundHref?: string,
) {
  const currentHref = backgroundHref ?? getCurrentBrowserHref();

  if (!currentHref) {
    return;
  }

  const href = buildAuthModalHref(currentHref, {
    view: null,
    next: null,
  });

  router.replace(resolveHref(href), { scroll: false });
}

export function markLogoutRedirectBypass() {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.setItem(AUTH_LOGOUT_BYPASS_KEY, "1");
}

export function consumeLogoutRedirectBypass() {
  if (!isBrowser()) {
    return false;
  }

  const shouldBypass = window.sessionStorage.getItem(AUTH_LOGOUT_BYPASS_KEY) === "1";

  if (shouldBypass) {
    window.sessionStorage.removeItem(AUTH_LOGOUT_BYPASS_KEY);
  }

  return shouldBypass;
}

export function buildDirectAuthRedirectHref(
  locale: Locale,
  view: AuthView,
  next?: string | null,
) {
  const href = buildAuthModalHref(AUTH_FALLBACK_PATH, {
    view,
    next,
  });

  return localizeHref(href, locale);
}

export function getPostAuthDestination({
  next,
  role,
}: {
  next?: string | null;
  role: Parameters<typeof getRoleLandingPath>[0];
}) {
  return normalizeInternalHref(next) ?? getRoleLandingPath(role);
}
