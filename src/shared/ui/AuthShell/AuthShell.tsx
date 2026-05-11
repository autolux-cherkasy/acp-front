"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import AuthPromoList from "@/src/widgets/auth-promo-list/ui/AuthPromoList";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import styles from "./AuthShell.module.css";

type Props = {
  logoAlt: string;
  closeLabel: string;
  brandDescription: string;
  promoItems: string[];
  backgroundImage: string;
  onClose: () => void;
  children: ReactNode;
  variant?: "login" | "register" | "recovery";
  bannerVariant?: "glass" | "soft" | "brand";
  reverse?: boolean;
  compact?: boolean;
  shellClassName?: string;
  contentClassName?: string;
  asideClassName?: string;
  brandClassName?: string;
  brandDescriptionClassName?: string;
  promoClassName?: string;
  promoItemClassName?: string;
  cardClassName?: string;
  closeClassName?: string;
  cardOverlay?: boolean;
};

function joinClassNames(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export default function AuthShell({
  logoAlt,
  closeLabel,
  brandDescription,
  promoItems,
  backgroundImage,
  onClose,
  children,
  variant = "recovery",
  bannerVariant = "glass",
  reverse = false,
  compact = false,
  shellClassName,
  contentClassName,
  asideClassName,
  brandClassName,
  brandDescriptionClassName,
  promoClassName,
  promoItemClassName,
  cardClassName,
  closeClassName,
  cardOverlay = true,
}: Props) {
  return (
    <div
      className={joinClassNames(
        styles.shell,
        styles[variant],
        bannerVariant === "soft"
          ? styles.bannerSoft
          : bannerVariant === "brand"
            ? styles.bannerBrand
            : styles.bannerGlass,
        compact ? styles.compact : undefined,
        shellClassName,
      )}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <ModalCloseButton
        className={joinClassNames(styles.close, styles.desktopClose, closeClassName)}
        ariaLabel={closeLabel}
        onClose={onClose}
      />

      <div
        className={joinClassNames(
          styles.content,
          reverse ? styles.reverse : undefined,
          contentClassName,
        )}
      >
        <aside className={joinClassNames(styles.aside, asideClassName)}>
          <div className={joinClassNames(styles.brand, brandClassName)}>
            <div className={styles.brandTop}>
              <span className={styles.brandTopSpacer} aria-hidden="true" />
              <Image
                src="/logo-sprinter.svg"
                alt={logoAlt}
                className={styles.brandLogo}
                width={213}
                height={50}
                priority
              />
              <ModalCloseButton
                className={joinClassNames(styles.close, styles.mobileClose, closeClassName)}
                ariaLabel={closeLabel}
                onClose={onClose}
              />
            </div>
            <p className={joinClassNames(styles.brandDesc, brandDescriptionClassName)}>
              {brandDescription}
            </p>
          </div>

          <AuthPromoList
            items={promoItems}
            listClassName={joinClassNames(styles.promo, promoClassName)}
            itemClassName={joinClassNames(styles.promoItem, promoItemClassName)}
          />
        </aside>

        <section
          className={joinClassNames(
            styles.card,
            cardOverlay ? styles.cardOverlay : undefined,
            cardClassName,
          )}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
