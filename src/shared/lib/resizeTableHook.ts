"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { countPages, paginateItems } from "./pagination";

type TableMeasurements = {
  cardHeight: number;
  headerHeight: number;
  tableAreaHeight: number;
  tableScrollHeight: number;
  theadHeight: number;
  rowHeight: number;
  paginationHeight: number;
};

type UseAutoPaginatedTableParams<T> = {
  items: T[];
};

export const useResizeTableHook = <T>({
  items,
}: UseAutoPaginatedTableParams<T>) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const tableAreaRef = useRef<HTMLDivElement | null>(null);
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const theadRef = useRef<HTMLTableRowElement | null>(null);
  const firstRowRef = useRef<HTMLTableRowElement | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);
  const [measurements, setMeasurements] = useState<TableMeasurements>({
    cardHeight: 0,
    headerHeight: 0,
    tableAreaHeight: 0,
    tableScrollHeight: 0,
    theadHeight: 0,
    rowHeight: 0,
    paginationHeight: 0,
  });

  useLayoutEffect(() => {
    const measureTableLayout = (shouldUpdateRowsPerPage: boolean) => {
      const tableAreaHeight =
        tableAreaRef.current?.getBoundingClientRect().height ?? 0;
      const theadHeight = theadRef.current?.getBoundingClientRect().height ?? 0;
      const rowHeight =
        firstRowRef.current?.getBoundingClientRect().height ?? 0;

      const availableRowsHeight = Math.max(tableAreaHeight - theadHeight, 0);

      if (shouldUpdateRowsPerPage && rowHeight > 0) {
        const nextRowsPerPage = Math.max(
          1,
          Math.floor(availableRowsHeight / rowHeight),
        );

        setRowsPerPage((prev) =>
          prev === nextRowsPerPage ? prev : nextRowsPerPage,
        );
      }

      setMeasurements({
        cardHeight: cardRef.current?.clientHeight ?? 0,
        headerHeight: headerRef.current?.getBoundingClientRect().height ?? 0,
        tableAreaHeight:
          tableAreaRef.current?.getBoundingClientRect().height ?? 0,
        tableScrollHeight:
          tableScrollRef.current?.getBoundingClientRect().height ?? 0,
        theadHeight: theadRef.current?.getBoundingClientRect().height ?? 0,
        rowHeight: firstRowRef.current?.getBoundingClientRect().height ?? 0,
        paginationHeight:
          paginationRef.current?.getBoundingClientRect().height ?? 0,
      });
    };

    measureTableLayout(true);

    const observer = new ResizeObserver(() => {
      measureTableLayout(true);
    });

    if (tableAreaRef.current) {
      observer.observe(tableAreaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nextTotalPages = Math.max(1, countPages(items.length, rowsPerPage));
    const set = () => {
      setPage((prevPage) => Math.min(prevPage, nextTotalPages));
    };
    set();
  }, [items.length, rowsPerPage]);

  const availableRowsHeight = Math.max(
    measurements.tableAreaHeight - measurements.theadHeight,
    0,
  );
  const totalPages = countPages(items.length, rowsPerPage);
  const paginatedRows = paginateItems(items, page, rowsPerPage);

  return {
    page,
    setPage,
    rowsPerPage,
    totalPages,
    paginatedRows,
    availableRowsHeight,
    measurements,
    refs: {
      cardRef,
      headerRef,
      tableAreaRef,
      tableScrollRef,
      theadRef,
      firstRowRef,
      paginationRef,
    },
  };
};
