import { DEV_PROFILE_KEY, DEV_ROLE_KEY } from "./dev-auth";

const CSRF_COOKIE_NAME = "csrf_token";
const LEGACY_CSRF_STORAGE_KEY = "csrf_token";
const AUTH_CHANGE_EVENT = "auth-change";

let inMemoryCsrfToken: string | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyAuthChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  window.dispatchEvent(new Event("focus"));
}

export function subscribeToAuthChange(onChange: () => void) {
  if (!isBrowser()) return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === DEV_ROLE_KEY || event.key === DEV_PROFILE_KEY || event.key === null) {
      onChange();
    }
  };

  window.addEventListener(AUTH_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", onChange);
  window.addEventListener("pageshow", onChange);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("focus", onChange);
    window.removeEventListener("pageshow", onChange);
  };
}

function readCsrfCookie() {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CSRF_COOKIE_NAME}=`));

  if (!match) return null;

  const value = match.slice(CSRF_COOKIE_NAME.length + 1);
  if (!value) return null;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function expireCsrfCookie() {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${CSRF_COOKIE_NAME}=; path=/; max-age=0; samesite=lax${secure}`;
}

export function getCsrfToken() {
  if (!isBrowser()) return null;

  return readCsrfCookie() ?? inMemoryCsrfToken;
}

export function setCsrfToken(token: string) {
  if (!isBrowser()) return;

  inMemoryCsrfToken = token;
  notifyAuthChange();
}

export function clearCsrfToken() {
  if (!isBrowser()) return;

  inMemoryCsrfToken = null;
  expireCsrfCookie();
  notifyAuthChange();
}

if (isBrowser()) {
  window.localStorage.removeItem(LEGACY_CSRF_STORAGE_KEY);
}
