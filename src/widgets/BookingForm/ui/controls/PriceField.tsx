"use client";

import Image from "next/image";

import styles from "../BookingForm.module.css";

type PriceFieldProps = {
  placeholder: string;
  value: string;
};

export default function PriceField({ placeholder, value }: PriceFieldProps) {
  return (
    <div className={styles.controlWithIconHalf}>
      <input
        className={styles.controlInner}
        type="text"
        placeholder={placeholder}
        value={value}
        readOnly
      />
      <span className={`${styles.iconRight} ${styles.priceIcon}`} aria-hidden="true">
        <Image src="/icons/currency-hryvnia.svg" alt="" aria-hidden="true" width={24} height={24} />
      </span>
    </div>
  );
}
