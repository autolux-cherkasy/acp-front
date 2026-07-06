"use client";

import { ClipLoader } from "react-spinners";
import styles from "./LoadingState.module.css";

type LoadingStateProps = {
  size?: number;
  className?: string;
};

export default function LoadingState({ size = 40, className }: LoadingStateProps) {
  return (
    <div className={`${styles.loadingState}${className ? ` ${className}` : ""}`} aria-live="polite">
      <ClipLoader color="#226078" size={size} />
    </div>
  );
}
