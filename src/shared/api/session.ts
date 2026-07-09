import { DEV_PROFILE_KEY, DEV_ROLE_KEY } from "./dev-auth";

const ACCESS_TOKEN_KEY = "access_token";
const LEGACY_TOKEN_KEY = "token";
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
      event.key === ACCESS_TOKEN_KEY
      || event.key === LEGACY_TOKEN_KEY
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

export function getAccessToken() {
  if (!isBrowser()) return null;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) return accessToken;

  const legacyToken = window.localStorage.getItem(LEGACY_TOKEN_KEY);
  if (!legacyToken) return null;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, legacyToken);
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  return legacyToken;
}

export function hasAccessToken() {
  return Boolean(getAccessToken());
}

export function setAccessToken(token: string) {
  if (!isBrowser()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  notifyAuthChange();
}

export function clearAccessToken() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  notifyAuthChange();
}

export function getCsrfToken() {
  if (!isBrowser()) return null;

  return window.localStorage.getItem(CSRF_TOKEN_KEY);
}

export function setCsrfToken(token: string) {
  if (!isBrowser()) return;

  window.localStorage.setItem(CSRF_TOKEN_KEY, token);
}

export function clearCsrfToken() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(CSRF_TOKEN_KEY);
}
