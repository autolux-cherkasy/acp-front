import type { ReactNode } from "react";
import styles from "./ModalRow.module.css";

type Props = {
  icon: ReactNode;
  children: ReactNode;
};

export default function ModalRow({ icon, children }: Props) {
  return (
    <div className={styles.row}>
      <span className={styles.rowIcon}>{icon}</span>
      <span className={styles.rowValue}>{children}</span>
    </div>
  );
}
