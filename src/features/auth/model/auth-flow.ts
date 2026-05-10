import { getLocaleFromPathnameOrDefault } from "@/src/shared/i18n/routing";
import { localizeHref } from "@/src/shared/i18n/routing";

type RouterLike = {
  back: () => void;
  replace: (href: string) => void;
  refresh?: () => void;
};

export const AUTH_BACKGROUND_KEY = "auth:background";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAuthBackground() {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(AUTH_BACKGROUND_KEY);
}

export function storeAuthBackground(href: string) {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(AUTH_BACKGROUND_KEY, href);
}

export function clearAuthBackground() {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(AUTH_BACKGROUND_KEY);
}

export function consumeAuthBackground() {
  const background = getAuthBackground();
  clearAuthBackground();
  return background;
}

export function closeAuthRoute(
  router: RouterLike,
  options: { fallback?: string } = {},
) {
  const { fallback = "/" } = options;
  const background = getAuthBackground();
  clearAuthBackground();

  // background is set iff the modal was opened via router.push() from openLoginModal.
  // router.back() correctly restores the Next.js router tree so that subsequent
  // router.push("/login") re-triggers the intercepted route. router.replace() does not.
  if (background) {
    router.back();
    return;
  }

  const locale = isBrowser() ? getLocaleFromPathnameOrDefault(window.location.pathname) : "uk";
  router.replace(localizeHref(fallback, locale));
}
