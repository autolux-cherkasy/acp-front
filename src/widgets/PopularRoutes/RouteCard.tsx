import { PopularRoute } from "@/src/entities/trip";
import styles from "./PopularRoutes.module.css";
import Image from "next/image";
import Chip from "@/src/shared/ui/Chip/Chip";

const SIZES = {
  large:
    "(max-width: 520px) calc(100vw - 32px), (max-width: 768px) calc((100vw - 72px) / 2), (max-width: 1300px) 50vw, 608px",
  small:
    "(max-width: 520px) calc(100vw - 32px), (max-width: 768px) calc((100vw - 72px) / 2), (max-width: 1300px) 33vw, 397px",
};

export function RouteCard({
  route,
  variant,
  ariaLabel,
  onClick,
}: {
  route: PopularRoute;
  variant: "large" | "small";
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${styles.card} ${variant === "large" ? styles.cardLarge : styles.cardSmall}`}
      aria-label={ariaLabel}
    >
      <Image
        className={styles.img}
        src={route.imageSrc}
        alt={route.imageAlt}
        fill
        sizes={SIZES[variant]}
      />
      <Chip className={styles.routeChip}>{route.title}</Chip>
    </button>
  );
}
