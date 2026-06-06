import { useEffect, useState, type HTMLAttributes } from "react";
import { getVisiblePages } from "@/src/shared/lib/pagination";
import styles from "./TablePagination.module.css";

type TablePaginationProps = HTMLAttributes<HTMLDivElement> & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevAriaLabel: string;
  nextAriaLabel: string;
};

export function TablePagination({
  className,
  page,
  totalPages,
  onPageChange,
  prevAriaLabel,
  nextAriaLabel,
  ...props
}: TablePaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const [visibleValues, setVisibleValues] = useState<number[]>([]);
  useEffect(() => {
    const set = () => {
      setVisibleValues(getVisiblePages(page, safeTotalPages));
    };
    set();
  }, [page, safeTotalPages]);

  return (
    <div className={`${styles.pagination} ${className ?? ""}`} {...props}>
      <button
        type="button"
        className={`${styles.pageBtn} ${styles.pageBtnArrow}`}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label={prevAriaLabel}
      >
        {"<"}
      </button>
      {visibleValues.map((value, index) => {
        const nextIndex = index + 1;
        return (
          <>
            <button
              key={value}
              type="button"
              className={`${styles.pageBtn} ${value === page ? styles.pageBtnActive : ""}`}
              onClick={() => onPageChange(value)}
            >
              {value}
            </button>
            {visibleValues[nextIndex] - value > 1 && (
              <button
                key={"..."}
                type="button"
                className={`${styles.pageBtn}`}
                onClick={() => onPageChange(value)}
              >
                {"..."}
              </button>
            )}
          </>
        );
      })}
      <button
        type="button"
        className={`${styles.pageBtn} ${styles.pageBtnArrow}`}
        disabled={page === safeTotalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label={nextAriaLabel}
      >
        {">"}
      </button>
    </div>
  );
}
