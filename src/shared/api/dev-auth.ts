"use client";

import { defaultLocale, hasLocale } from "@/src/shared/i18n/config";

export const DEV_ROLE_KEY = "dev-role";
export const DEV_PROFILE_KEY = "dev-profile";

const AUTH_CHANGE_EVENT = "auth-change";
const DEV_AUTH_ROLES = ["USER", "ADMIN", "DISPATCHER"] as const;
const DEV_AUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === "true";

export type DevAuthRole = (typeof DEV_AUTH_ROLES)[number];

export type DevAuthProfile = {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  role: DevAuthRole;
  specialCategory: string | null;
  documentPhoto: string | null;
  createdAt: string;
};

type DevAuthController = {
  enabled: boolean;
  roles: readonly DevAuthRole[];
  loginAs: (role: DevAuthRole, options?: { redirect?: boolean }) => DevAuthProfile | null;
  logout: (options?: { redirect?: boolean }) => void;
  getState: () => {
    enabled: boolean;
    role: DevAuthRole | null;
    profile: DevAuthProfile | null;
  };
  setProfile: (patch: Partial<DevAuthProfile>) => DevAuthProfile | null;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyAuthChange() {
  if (!isBrowser()) return;

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  window.dispatchEvent(new Event("focus"));
}

function isDevAuthRole(value: string | null | undefined): value is DevAuthRole {
  return DEV_AUTH_ROLES.includes(value as DevAuthRole);
}

function resolveDevAuthPath(role: DevAuthRole) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "DISPATCHER":
      return "/dispatcher";
    default:
      return "/profile";
  }
}

function getCurrentLocalePrefix() {
  if (!isBrowser()) {
    return `/${defaultLocale}`;
  }

  const [, maybeLocale] = window.location.pathname.split("/");
  const locale = hasLocale(maybeLocale) ? maybeLocale : defaultLocale;
  return `/${locale}`;
}

function readStoredProfile(role: DevAuthRole) {
  if (!isBrowser()) {
    return null;
  }

  const rawProfile = window.localStorage.getItem(DEV_PROFILE_KEY);

  if (!rawProfile) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawProfile) as Partial<DevAuthProfile> | null;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      ...createDevProfile(role),
      ...parsed,
      role,
    } satisfies DevAuthProfile;
  } catch {
    return null;
  }
}

export function isDevAuthEnabled() {
  return DEV_AUTH_ENABLED;
}

export function createDevProfile(role: DevAuthRole): DevAuthProfile {
  const normalizedRole = role.toLowerCase();

  return {
    id: 1,
    email: `${normalizedRole}@example.com`,
    name: role === "ADMIN" ? "Admin Test" : role === "DISPATCHER" ? "Dispatcher Test" : "User Test",
    phone: "+380991234567",
    role,
    specialCategory: null,
    documentPhoto: null,
    createdAt: new Date().toISOString(),
  };
}

export function getDevRole(): DevAuthRole | null {
  if (!DEV_AUTH_ENABLED || !isBrowser()) {
    return null;
  }

  const value = window.localStorage.getItem(DEV_ROLE_KEY);
  return isDevAuthRole(value) ? value : null;
}

export function getDevProfile(): DevAuthProfile | null {
  const role = getDevRole();

  if (!role) {
    return null;
  }

  return readStoredProfile(role) ?? createDevProfile(role);
}

export function setDevProfile(profile: DevAuthProfile) {
  if (!DEV_AUTH_ENABLED || !isBrowser()) {
    return null;
  }

  window.localStorage.setItem(DEV_ROLE_KEY, profile.role);
  window.localStorage.setItem(DEV_PROFILE_KEY, JSON.stringify(profile));
  notifyAuthChange();

  return profile;
}

export function updateDevProfile(patch: Partial<DevAuthProfile>) {
  const currentProfile = getDevProfile();

  if (!currentProfile) {
    return null;
  }

  const nextRole = isDevAuthRole(patch.role) ? patch.role : currentProfile.role;
  const nextProfile: DevAuthProfile = {
    ...createDevProfile(nextRole),
    ...currentProfile,
    ...patch,
    role: nextRole,
  };

  return setDevProfile(nextProfile);
}

export function changeDevPassword(nextPassword: string) {
  if (!getDevProfile()) {
    return null;
  }

  return nextPassword.trim()
    ? "Password updated locally."
    : "Password change is available only for an active local dev session.";
}

export function loginAsDevRole(role: DevAuthRole) {
  if (!DEV_AUTH_ENABLED || !isBrowser()) {
    return null;
  }

  return setDevProfile(createDevProfile(role));
}

export function clearDevAuth() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(DEV_ROLE_KEY);
  window.localStorage.removeItem(DEV_PROFILE_KEY);
  notifyAuthChange();
}

export function installDevAuthHelpers() {
  if (!DEV_AUTH_ENABLED || !isBrowser()) {
    return () => {};
  }

  const devAuth: DevAuthController = {
    enabled: true,
    roles: DEV_AUTH_ROLES,
    loginAs(role, options) {
      const profile = loginAsDevRole(role);

      if (profile && options?.redirect !== false) {
        window.location.assign(`${getCurrentLocalePrefix()}${resolveDevAuthPath(role)}`);
      }

      return profile;
    },
    logout(options) {
      clearDevAuth();

      if (options?.redirect !== false) {
        window.location.assign(`${getCurrentLocalePrefix()}/`);
      }
    },
    getState() {
      return {
        enabled: DEV_AUTH_ENABLED,
        role: getDevRole(),
        profile: getDevProfile(),
      };
    },
    setProfile(patch) {
      return updateDevProfile(patch);
    },
  };

  (window as Window & { __devAuth?: DevAuthController }).__devAuth = devAuth;

  return () => {
    const target = window as Window & { __devAuth?: DevAuthController };

    if (target.__devAuth === devAuth) {
      delete target.__devAuth;
    }
  };
}
