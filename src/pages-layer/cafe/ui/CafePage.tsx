"use client";

import Image from "next/image";

import { useCafeQuery } from "@/src/entities/cafe/api/useCafeQueries";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import BreadcrumbChips from "@/src/shared/ui/BreadcrumbChips/BreadcrumbChips";
import { DecorativeBorder } from "@/src/shared/ui/DecorativeBorder/DecorativeBorder";
import styles from "./cafe-page.module.css";
import { CafeCategoryResponse, CafeSectionResponse } from "@/src/entities/cafe/types";
import CafePageSkeleton from "./CafePageSkeleton";

function MenuGroup({
  category,
  className = "",
}: {
  category: CafeCategoryResponse;
  className?: string;
}) {
  return (
    <section className={[styles.menuGroup, className].filter(Boolean).join(" ")}>
      <h2 className={styles.groupTitle}>{category.name}</h2>

      <div className={styles.menuList}>
        {(category.items ?? []).map((item) => {
          const plusIdx = item.name.indexOf("+");
          const hasTwoLines = plusIdx > 0;

          return (
            <div key={`${category.id}-${item.name}`} className={styles.menuRow}>
              <span className={styles.menuName}>
                {hasTwoLines ? (
                  <>
                    <span className={styles.menuNameLine}>
                      {item.name.slice(0, plusIdx).trim()}
                    </span>
                    <span className={styles.menuNameLine}>{item.name.slice(plusIdx).trim()}</span>
                  </>
                ) : (
                  item.name
                )}
              </span>

              <span className={styles.menuLine} aria-hidden="true">
                <span className={styles.menuLineStroke} />
              </span>

              <span className={styles.menuPrice}>{item.price} ₴</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function CafePage() {
  const { t } = useI18n();
  const { data: cafeData, isLoading } = useCafeQuery();

  if (isLoading) return <CafePageSkeleton />;

  const renderCard = (menu: CafeSectionResponse) => {
    const cardSideClass =
      menu.displayOrder % 2 !== 0 ? styles.cardImageLeft : styles.cardImageRight;
    const imageSrc = `${menu.imageUrl ?? ""}+${menu.id}`;
    const isSplitLayout = menu.categories.length > 1;
    const layoutClass = isSplitLayout ? styles.cardSplit : styles.cardSingle;

    return (
      <article key={imageSrc} className={`${styles.card} ${cardSideClass} ${layoutClass}`}>
        <div className={styles.photoWrap}>
          <Image
            src={"/icons/cafe/coffe.svg"}
            alt={"photo"}
            priority
            fill
            sizes="(max-width: 430px) 200px, (max-width: 1239px) 300px, 360px"
            className={styles.photo}
          />
        </div>

        <DecorativeBorder className={styles.cardFrame}>
          <div className={styles.slot}>
            <div
              className={`${styles.cardContent} ${
                isSplitLayout ? styles.cardContentSplit : styles.cardContentSingle
              }`}
            >
              {isSplitLayout ? (
                <>
                  <MenuGroup category={menu.categories[0]} />

                  <div className={styles.sideColumn}>
                    {menu.categories.slice(1).map((category) => (
                      <MenuGroup key={`${category.id}-${""}`} category={category} />
                    ))}
                  </div>
                </>
              ) : (
                <MenuGroup category={menu.categories[0]} className={styles.singleGroup} />
              )}
            </div>
          </div>
        </DecorativeBorder>
      </article>
    );
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.srOnly}>{t("cafe.pageTitle")}</h1>

        <BreadcrumbChips
          ariaLabel={t("menu.cafe")}
          items={[
            { label: t("menu.home"), href: "/#home" },
            { label: t("menu.cafe"), current: true },
          ]}
        />

        <div className={styles.hotdogBlock}>
          <section className={styles.menuContent} aria-label={t("cafe.menuAria")}>
            {cafeData?.map((menu: CafeSectionResponse) => renderCard(menu))}
          </section>
          <section className={styles.story} aria-label={t("cafe.storyAria")}>
            <p className={styles.storyText}>{t("cafe.description")}</p>
          </section>
        </div>
      </div>
    </section>
  );
}
