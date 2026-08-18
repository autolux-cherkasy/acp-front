import { DEV_PROFILE_KEY, DEV_ROLE_KEY } from "./dev-auth";

const CSRF_TOKEN_KEY = "csrf_token";
const AUTH_CHANGE_EVENT = "auth-change";
const AUTH_SESSION_ENDED_EVENT = "auth-session-ended";

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

function readCookie(name: string) {
  if (!isBrowser()) return null;

  const prefix = `${encodeURIComponent(name)}=`;
  const match = document.cookie.split("; ").find((part) => part.startsWith(prefix));

  if (!match) return null;

  try {
    return decodeURIComponent(match.slice(prefix.length)) || null;
  } catch {
    return match.slice(prefix.length) || null;
  }
}

export function getCsrfToken() {
  if (!isBrowser()) return null;

  return window.localStorage.getItem(CSRF_TOKEN_KEY) || readCookie(CSRF_TOKEN_KEY);
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

export function endClientSession() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(CSRF_TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_ENDED_EVENT));
  notifyAuthChange();
}

export function subscribeToSessionEnd(onEnd: () => void) {
  if (!isBrowser()) return () => {};

  window.addEventListener(AUTH_SESSION_ENDED_EVENT, onEnd);
  return () => {
    window.removeEventListener(AUTH_SESSION_ENDED_EVENT, onEnd);
  };
}
