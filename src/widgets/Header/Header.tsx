"use client";

import { getRoleLandingPath } from "@/src/features/access-control";
import { useAuthSession } from "@/src/features/auth";
import { openAuthModal } from "@/src/features/auth/model/auth-flow";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { stripLocaleFromPathname } from "@/src/shared/i18n/routing";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

import styles from "./Header.module.css";
import HeaderAuthControl from "./HeaderAuthControl";
import { usePhonesQuery } from "@/src/entities/dashboard/api/useSettingsQueries";

const menu = [
  { key: "menu.home", href: "#home" },
  { key: "menu.routes", href: "#routes" },
  { key: "menu.about", href: "#about" },
  { key: "menu.cafe", href: "/cafe" },
  { key: "menu.contacts", href: "#contacts" },
];

const sectionHrefs = menu.map((item) => item.href).filter((href) => href.startsWith("#"));

const HEADER_COLLAPSE_BREAKPOINT = 1024;

export default function Header() {
  const { t } = useI18n();
  const resolveHref = useLocalizedHref();
  const router = useRouter();
  const pathname = usePathname();
  const { data: phonesData } = usePhonesQuery();

  const phones = useMemo(() => {
    if (!phonesData) return [];
    return [phonesData.phone1, phonesData.phone2, phonesData.phone3].filter(Boolean).map((p) => ({
      text: p?.replace(/^\+380(\d{2})(\d{3})(\d{2})(\d{2})$/, "+380$1 $2 $3 $4"),
      href: `tel:${p}`,
    }));
  }, [phonesData]);

  const { isAuthenticated, role } = useAuthSession();
  const pathnameWithoutLocale = stripLocaleFromPathname(pathname || "/");
  const workspaceHref = getRoleLandingPath(role);

  const isAuthorized = isAuthenticated;

  const [activeMenuHref, setActiveMenuHref] = useState(() => {
    if (typeof window === "undefined") {
      return "#home";
    }

    const hash = window.location.hash;
    return sectionHrefs.includes(hash) ? hash : "#home";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPhoneMenuOpen, setIsPhoneMenuOpen] = useState(false);
  const currentMenuHref = pathnameWithoutLocale === "/cafe" ? "/cafe" : activeMenuHref;
  const phoneMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncActiveFromHash = () => {
      const hash = window.location.hash;
      setActiveMenuHref(sectionHrefs.includes(hash) ? hash : "#home");
    };

    syncActiveFromHash();

    const ids = ["home", "about", "routes", "contacts"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      const best = sections
        .map((section) => {
          const rect = section.getBoundingClientRect();
          return {
            id: section.id,
            distance: Math.abs(rect.top - 120),
          };
        })
        .sort((a, b) => a.distance - b.distance)[0];

      if (best) {
        setActiveMenuHref(`#${best.id}`);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathnameWithoutLocale]);

  useEffect(() => {
    if (pathnameWithoutLocale !== "/") return;

    const hash = window.location.hash;

    if (!sectionHrefs.includes(hash)) {
      return;
    }

    const targetId = hash.slice(1);
    const elem = document.getElementById(targetId);

    if (!elem) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const top = elem.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathnameWithoutLocale]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > HEADER_COLLAPSE_BREAKPOINT) {
        setIsMobileMenuOpen(false);
        setIsPhoneMenuOpen(false);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closePhoneMenu = useEffectEvent(() => {
    setIsPhoneMenuOpen(false);
  });

  useEffect(() => {
    if (!isPhoneMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!phoneMenuRef.current?.contains(event.target as Node)) {
        closePhoneMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePhoneMenu();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPhoneMenuOpen]);

  const openLoginModal = () => {
    setIsPhoneMenuOpen(false);
    openAuthModal(router, resolveHref, "login", { next: null });
  };

  const handleAvatarClick = () => {
    setIsPhoneMenuOpen(false);
    router.push(resolveHref(workspaceHref));
  };

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setIsPhoneMenuOpen(false);

    if (href === "/cafe") {
      router.push(resolveHref(href));
      return;
    }

    if (pathnameWithoutLocale === "/cafe") {
      router.push(resolveHref(`/${href}`));
      return;
    }

    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);

    if (elem) {
      const top = elem.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });

      if (window.location.hash !== href) {
        window.history.replaceState(null, "", href);
      }
    }
  };

  return (
    <header className={`${styles.header} ${isMobileMenuOpen ? styles.headerNoShadow : ""}`}>
      <div className={styles.container}>
        <a
          className={styles.logoWrap}
          href="#home"
          onClick={(e) => {
            setActiveMenuHref("#home");
            handleScroll(e, "#home");
          }}
          aria-label={t("aria.home")}
        >
          <Image
            className={styles.logo}
            src="/logo-sprinter.svg"
            alt={t("header.logoAlt")}
            width={213}
            height={50}
            priority
          />
        </a>

        <nav className={styles.menu} aria-label={t("header.menuAria")}>
          {menu.map((item) => (
            <a
              key={item.key}
              aria-current={currentMenuHref === item.href ? "page" : undefined}
              className={`${styles.menuItem} ${currentMenuHref === item.href ? styles.menuItemActive : ""}`}
              href={item.href}
              onClick={(e) => {
                setActiveMenuHref(item.href);
                handleScroll(e, item.href);
              }}
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div
          className={`${styles.right} ${isAuthorized ? styles.rightAuthorized : styles.rightUnauthorized}`}
        >
          <HeaderAuthControl
            className={styles.authControl}
            isAuthorized={isAuthorized}
            loginLabel={t("header.login")}
            profileAriaLabel={t("header.profileAria")}
            onLoginClick={openLoginModal}
            onAvatarClick={handleAvatarClick}
          />

          <div className={styles.phoneWrap} ref={phoneMenuRef}>
            <Image
              className={styles.phoneIconDesktop}
              src="/icons/phone.svg"
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
            />
            <button
              className={styles.phoneToggle}
              type="button"
              aria-label={t("profile.fields.phone")}
              aria-expanded={isPhoneMenuOpen}
              aria-controls="header-phone-menu"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPhoneMenuOpen((prev) => !prev);
              }}
            >
              <Image
                className={styles.phoneIcon}
                src="/icons/phone.svg"
                alt=""
                aria-hidden="true"
                width={24}
                height={24}
              />
            </button>

            <div className={styles.phoneCol}>
              {phones.map((item) => (
                <div className={styles.phoneRow} key={item.href}>
                  <a className={styles.phone} href={item.href}>
                    {item.text}
                  </a>
                </div>
              ))}
            </div>

            <div
              id="header-phone-menu"
              className={`${styles.phoneMenuPanel} ${isPhoneMenuOpen ? styles.phoneMenuPanelOpen : ""}`}
              aria-hidden={!isPhoneMenuOpen}
              aria-label={t("menu.contacts")}
            >
              {phones.map((item) => (
                <a
                  key={`popup-${item.href}`}
                  className={styles.phoneMenuItem}
                  href={item.href}
                  onClick={() => setIsPhoneMenuOpen(false)}
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>

          <button
            className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.mobileMenuBtnOpen : ""}`}
            type="button"
            aria-label={t("header.menuAria")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="header-mobile-menu"
            onClick={() => {
              setIsPhoneMenuOpen(false);
              setIsMobileMenuOpen((prev) => !prev);
            }}
          >
            {isMobileMenuOpen ? (
              <span key="icon-close" className={styles.mobileCloseIcon} aria-hidden="true" />
            ) : (
              <Image
                key="icon-menu"
                className={styles.mobileMenuIcon}
                src="/icons/Header/Vector%20(Stroke).png"
                alt=""
                aria-hidden="true"
                width={24}
                height={24}
              />
            )}
          </button>
        </div>

        <div
          id="header-mobile-menu"
          className={`${styles.mobileMenuPanel} ${isMobileMenuOpen ? styles.mobileMenuPanelOpen : ""}`}
          aria-hidden={!isMobileMenuOpen}
        >
          {menu.map((item) => (
            <a
              key={`mobile-${item.key}`}
              aria-current={currentMenuHref === item.href ? "page" : undefined}
              className={`${styles.mobileMenuItem} ${currentMenuHref === item.href ? styles.mobileMenuItemActive : ""}`}
              href={item.href}
              onClick={(e) => {
                setActiveMenuHref(item.href);
                handleScroll(e, item.href);
              }}
            >
              {t(item.key)}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
