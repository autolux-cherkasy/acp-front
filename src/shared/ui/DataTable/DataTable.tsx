"use client";

import Icon from "@/src/shared/ui/Icon/Icon";
import {
  DashboardTable,
  DashboardThead,
  DashboardTr,
  dashboardTableStyles,
} from "@/src/shared/ui/DashboardComponents/DashboardTable";
import SelectField from "@/src/shared/ui/SelectField/SelectField";
import styles from "./DataTable.module.css";
import { useI18n } from "../../i18n";
import { isSelectCell, TableRow } from "@/src/pages-layer/dashboard/ui/DashboardDataMgmtPage/mockData";
import { ColumnDef } from "@/src/pages-layer/dashboard/ui/DashboardDataMgmtPage/mockData";

type Props = {
  columns: ColumnDef[];
  rows: TableRow[];
  onEdit: (rowIndex: number) => void;
  onAdd: () => void;
  onSelectCell?: (rowIndex: number, value: string) => void;
  isLoading?: boolean;
};

const SKELETON_ROWS = 4;

export default function DataTable({ columns, rows, onEdit, onAdd, onSelectCell, isLoading }: Props) {
  const { t } = useI18n();
  return (
    <DashboardTable className={styles.dataTable}>
      <DashboardThead>
        <th className={dashboardTableStyles.thNum}>№</th>
        {columns.map((col, i) => (
          <th
            key={col.key}
            className={
              i === 0 ? styles.thFirst : `${dashboardTableStyles.th} ${styles.thContentCol}`
            }
          >
            {col.label}
          </th>
        ))}
        <th className={`${dashboardTableStyles.thAction} ${styles.thEditSeparator}`}>
          <button type="button" className={styles.addBtn} onClick={onAdd}>
            <Icon src="/icons/plus-solid.svg" size={24} />
          </button>
        </th>
      </DashboardThead>

      <tbody>
        {isLoading
          ? Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
              <DashboardTr key={rowIdx} className={styles.dataRow}>
                <td className={`${dashboardTableStyles.tdNum} ${styles.tdCenter}`} />
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className={colIdx === 0 ? styles.tdFirst : [styles.tdLeft, styles.contentRow].join(" ")}
                  >
                    <div className={styles.skeletonBar} style={{ width: colIdx === 0 ? "60%" : "80%" }} />
                  </td>
                ))}
                <td className={`${dashboardTableStyles.tdAction} ${styles.tdCenter}`} />
              </DashboardTr>
            ))
          : rows.map((row, rowIdx) => (
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
                {typeof cell === "boolean" ? (
                  <input
                    type="checkbox"
                    role="switch"
                    checked={cell}
                    readOnly
                    className={styles.switch}
                  />
                ) : isSelectCell(cell) ? (
                  <SelectField
                    value={cell.value}
                    options={cell.options}
                    onChange={(value) => onSelectCell?.(rowIdx, value)}
                    menuZIndex={10001}
                    variant="plain"
                  />
                ) : (
                  cell
                )}
              </td>
            ))}
            <td className={`${dashboardTableStyles.tdAction} ${styles.tdCenter}`}>
              <button
                type="button"
                className={styles.editBtn}
                onClick={() => onEdit(rowIdx)}
                aria-label={t("common.actions.edit")}
              >
                <Icon src="/icons/pencil-edit.svg" size={19} />
              </button>
            </td>
          </DashboardTr>
        ))}
      </tbody>

    </DashboardTable>
  );
}
