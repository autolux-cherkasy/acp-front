"use client";

import Image from "next/image";
import {
  DashboardTable,
  DashboardThead,
  DashboardTr,
  dashboardTableStyles,
} from "@/src/shared/ui/DashboardComponents/DashboardTable";
import styles from "./DataTable.module.css";
import { useI18n } from "../../i18n";

type Props = {
  columns: string[];
  rows: string[][];
  onEdit: (rowIndex: number) => void;
  onAdd: () => void;
};

export default function DataTable({ columns, rows, onEdit, onAdd }: Props) {
  const { t } = useI18n();
  return (
    <DashboardTable className={styles.dataTable}>
      <DashboardThead>
        <th className={dashboardTableStyles.thNum}>№</th>
        {columns.map((col, i) => (
          <th
            key={col}
            className={
              i === 0 ? styles.thFirst : `${dashboardTableStyles.th} ${styles.thContentCol}`
            }
          >
            {col}
          </th>
        ))}
        <th className={`${dashboardTableStyles.thAction} ${styles.thEditSeparator}`}>
          <button type="button" className={styles.addBtn} onClick={onAdd}>
            <Image
              src="/icons/plus-solid.svg"
              width={24}
              height={24}
              alt=""
              aria-label={t("common.actions.add")}
            />
          </button>
        </th>
      </DashboardThead>

      <tbody>
        {rows.map((row, rowIdx) => (
          <DashboardTr key={rowIdx} className={styles.dataRow}>
            <td className={`${dashboardTableStyles.tdNum} ${styles.tdCenter}`}>{rowIdx + 1}</td>
            {row.map((cell, colIdx) => (
              <td
                key={colIdx}
                className={
                  colIdx === 0
                    ? styles.tdFirst
                    : [styles.tdLeft, colIdx !== row.length && styles.contentRow]
                        .filter(Boolean)
                        .join(" ")
                }
              >
                {cell}
              </td>
            ))}
            <td className={`${dashboardTableStyles.tdAction} ${styles.tdCenter}`}>
              <button
                type="button"
                className={styles.editBtn}
                onClick={() => onEdit(rowIdx)}
                aria-label={t("common.actions.edit")}
              >
                <Image
                  src="/icons/pencil-edit.svg"
                  width={19}
                  height={19}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </td>
          </DashboardTr>
        ))}
      </tbody>
    </DashboardTable>
  );
}
