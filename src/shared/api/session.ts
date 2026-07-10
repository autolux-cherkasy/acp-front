import { DEV_PROFILE_KEY, DEV_ROLE_KEY } from "./dev-auth";

const CSRF_TOKEN_KEY = "csrf_token";
const AUTH_CHANGE_EVENT = "auth-change";

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
    if (
      event.key === CSRF_TOKEN_KEY
      || event.key === DEV_ROLE_KEY
      || event.key === DEV_PROFILE_KEY
      || event.key === null
    ) {
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

export function getCsrfToken() {
  if (!isBrowser()) return null;

  return window.localStorage.getItem(CSRF_TOKEN_KEY);
}

export function setCsrfToken(token: string) {
  if (!isBrowser()) return;

  window.localStorage.setItem(CSRF_TOKEN_KEY, token);
  notifyAuthChange();
}

export function clearCsrfToken() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(CSRF_TOKEN_KEY);
  notifyAuthChange();
}
