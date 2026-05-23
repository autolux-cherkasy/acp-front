"use client";

import { useAuthSession } from "@/src/features/auth";
import { useLogoutMutation } from "@/src/features/auth/api/useAuthQueries";
import {
  AUTH_FALLBACK_PATH,
  markLogoutRedirectBypass,
} from "@/src/features/auth/model/auth-flow";
import { LocaleLink, useI18n, useLocalizedHref } from "@/src/shared";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, type CSSProperties, type ReactNode } from "react";

import styles from "./role-workspace-page.module.css";

type RoleWorkspaceShellProps = {
  basePath: "/admin" | "/dispatcher";
  defaultRoleLabel: string;
  children: ReactNode;
};

type NavItemKey =
  | "tickets"
  | "routes"
  | "data"
  | "analytics"
  | "statistics"
  | "settings";

type NavItem = {
  key: NavItemKey;
  segment: "" | "routes" | "data" | "analytics" | "statistics" | "settings";
  iconPath: string;
};

// Add matching SVG files to public/icons/workspace/sidebar/ with these exact names.
const SIDEBAR_ICON_PATHS: Record<NavItemKey, string> = {
  tickets: "/icons/workspace/sidebar/tickets.svg",
  routes: "/icons/workspace/sidebar/routes.svg",
  data: "/icons/workspace/sidebar/data.svg",
  analytics: "/icons/workspace/sidebar/analytics.svg",
  statistics: "/icons/workspace/sidebar/statistics.svg",
  settings: "/icons/workspace/sidebar/settings.svg",
};

const NAV_ITEMS: NavItem[] = [
  { key: "tickets", segment: "", iconPath: SIDEBAR_ICON_PATHS.tickets },
  { key: "routes", segment: "routes", iconPath: SIDEBAR_ICON_PATHS.routes },
  { key: "data", segment: "data", iconPath: SIDEBAR_ICON_PATHS.data },
  {
    key: "analytics",
    segment: "analytics",
    iconPath: SIDEBAR_ICON_PATHS.analytics,
  },
  {
    key: "statistics",
    segment: "statistics",
    iconPath: SIDEBAR_ICON_PATHS.statistics,
  },
  {
    key: "settings",
    segment: "settings",
    iconPath: SIDEBAR_ICON_PATHS.settings,
  },
];

function joinClassNames(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function normalizePathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (!segments.length) {
    return "/";
  }

  const withoutLocale =
    segments[0] === "uk" || segments[0] === "en" ? segments.slice(1) : segments;

  return withoutLocale.length ? `/${withoutLocale.join("/")}` : "/";
}

function buildHref(
  basePath: RoleWorkspaceShellProps["basePath"],
  segment: NavItem["segment"],
) {
  return segment ? `${basePath}/${segment}` : basePath;
}

function isActivePath(currentPath: string, href: string, exact: boolean) {
  if (exact) {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function getIconStyle(iconPath: string): CSSProperties {
  return {
    ["--icon-url" as string]: `url(${iconPath})`,
  };
}

function formatSidebarName(name: string) {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const baseName = parts[parts.length - 1] ?? name;

  return baseName.toLocaleUpperCase();
}

export default function RoleWorkspaceShell({
  basePath,
  defaultRoleLabel,
  children,
}: RoleWorkspaceShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const localizeHref = useLocalizedHref();
  const { profile, role } = useAuthSession();
  const logoutMutation = useLogoutMutation();

  const currentPath = useMemo(() => normalizePathname(pathname), [pathname]);

  const fallbackRoleLabel =
    basePath === "/admin"
      ? t("dispatcherArea.sidebar.roleAdmin")
      : t("dispatcherArea.sidebar.roleDispatcher");

  const roleLabel =
    role === "ADMIN"
      ? t("dispatcherArea.sidebar.roleAdmin")
      : role === "DISPETCHER"
        ? t("dispatcherArea.sidebar.roleDispatcher")
        : fallbackRoleLabel || defaultRoleLabel;

  const rawDisplayName =
    profile?.name?.trim() || t("dispatcherArea.sidebar.fallbackName");
  const displayName = formatSidebarName(rawDisplayName);

  async function handleLogout() {
    markLogoutRedirectBypass();
    await logoutMutation.mutateAsync();
    router.replace(localizeHref(AUTH_FALLBACK_PATH));
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.brandPanel}>
              <LocaleLink href="/" className={styles.brandLink}>
                <Image
                  src="/logo-sprinter.svg"
                  alt="AutoLux Cherkasy Plus"
                  width={220}
                  height={52}
                  className={styles.brandLogo}
                  priority
                />
              </LocaleLink>
            </div>

            <div className={styles.profileBlock}>
              <div className={styles.profileText}>
                <span className={styles.userName}>{displayName}</span>
                <span className={styles.roleLabel}>
                  {roleLabel || fallbackRoleLabel}
                </span>
              </div>
            </div>

            <nav
              className={styles.nav}
              aria-label={t("dispatcherArea.sidebar.navAria")}
            >
              {NAV_ITEMS.map((item) => {
                const href = buildHref(basePath, item.segment);
                const isActive = isActivePath(
                  currentPath,
                  href,
                  item.segment === "",
                );

                return (
                  <LocaleLink
                    key={item.key}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={joinClassNames(
                      styles.navItem,
                      isActive && styles.navItemActive,
                    )}
                  >
                    <span
                      className={styles.navIcon}
                      style={getIconStyle(item.iconPath)}
                      aria-hidden="true"
                    />
                    <span className={styles.navLabel}>
                      {t(`dispatcherArea.sidebar.menu.${item.key}`)}
                    </span>
                  </LocaleLink>
                );
              })}
            </nav>
          </div>

          <div className={styles.sidebarBottom}>
            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <span
                className={styles.navIcon}
                style={getIconStyle("/icons/account/exit-icon-v2.svg")}
                aria-hidden="true"
              />
              <span className={styles.navLabel}>
                {t("dispatcherArea.sidebar.logout")}
              </span>
            </button>
          </div>
        </aside>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
