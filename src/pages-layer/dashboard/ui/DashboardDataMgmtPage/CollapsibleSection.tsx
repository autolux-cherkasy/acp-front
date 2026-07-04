"use client";
import { useI18n } from "@/src/shared";
import ChevronIcon from "@/src/shared/ui/ChevronIcon/ChevronIcon";
import {
  DashboardTable,
  DashboardTr,
  dashboardTableStyles,
} from "@/src/shared/ui/DashboardComponents/DashboardTable";
import dasboardTable from "@/src/shared/ui/DashboardComponents/DashboardTable.module.css";
import DataTable from "@/src/shared/ui/DataTable/DataTable";
import tableStyles from "@/src/shared/ui/DataTable/DataTable.module.css";
import Icon from "@/src/shared/ui/Icon/Icon";
import * as Switch from "@radix-ui/react-switch";
import React, { useState } from "react";
import styles from "./DataMgmtPage.module.css";
import { DataSection, isSelectCell, SECTION_COLUMNS } from "./mockData";

type CollapsiblesectionProps = {
  section: DataSection;
  tab: string;
  index: number;
  onEditSection?: () => void;
  onAddRow: () => void;
  onEditRow: (index: number) => void;
  onToggleSubCell?: (id: string, value: boolean) => void;
  onSelectCell?: (rowIndex: number, value: string) => void;
  initialOpenState?: boolean;
  isLoading?: boolean;
};

const CollapsibleSection = ({
  section,
  tab,
  onAddRow,
  onEditRow,
  onEditSection,
  onToggleSubCell,
  onSelectCell,
  initialOpenState,
  isLoading,
}: CollapsiblesectionProps) => {
  const [open, setOpen] = useState(initialOpenState ?? false);
  const { t } = useI18n();

  const handleToggle = () => setOpen((prev) => !prev);

  const renderSubSections = () => {
    const subs = section.subSections!;
    const firstCols = subs[0]?.columns ?? [];

    let globalRowIdx = 0;

    return (
      <DashboardTable className={tableStyles.dataTable}>
        <tbody>
          {subs.map((sub, subIdx) => {
            const groupRowIdx = globalRowIdx;
            globalRowIdx += sub.rows.length;
            return (
              <React.Fragment key={`group-${subIdx}`}>
                <tr className={dasboardTable.theadRow}>
                  <th className={`${dashboardTableStyles.tdNum} ${tableStyles.tdCenter}`}>№</th>
                  <th className={tableStyles.tdFirst}>{sub.groupLabel}</th>
                  {firstCols.slice(1, -1).map((col, i) => (
                    <th key={i} className={`${tableStyles.tdLeft} ${tableStyles.contentRow}`}>
                      {col}
                    </th>
                  ))}
                  <th className={`${tableStyles.tdLeft} ${tableStyles.contentRow}`}>
                    {firstCols[firstCols.length - 1]}
                  </th>
                  <th className={`${dashboardTableStyles.tdAction} ${tableStyles.tdCenter}`}>
                    <button type="button" className={tableStyles.addBtn} onClick={onAddRow}>
                      <Icon src="/icons/plus-solid.svg" size={24} />
                    </button>
                  </th>
                </tr>
                {sub.rows.map((row, rowIdx) => {
                  const absoluteIdx = groupRowIdx + rowIdx;
                  return (
                    <DashboardTr key={`${subIdx}-${rowIdx}`} className={tableStyles.dataRow}>
                      <td className={`${dashboardTableStyles.tdNum} ${tableStyles.tdCenter}`}>
                        {rowIdx + 1}
                      </td>
                      {row.map((cell, colIdx) => (
                        <td
                          key={colIdx}
                          className={
                            colIdx === 0
                              ? tableStyles.tdFirst
                              : [tableStyles.tdLeft, tableStyles.contentRow].join(" ")
                          }
                        >
                          {typeof cell === "boolean" ? (
                            <Switch.Root
                              checked={cell}
                              className={tableStyles.switchRoot}
                              onCheckedChange={(checked) =>
                                onToggleSubCell?.(sub.ids?.[rowIdx] ?? "", checked)
                              }
                            >
                              <Switch.Thumb className={tableStyles.switchThumb} />
                            </Switch.Root>
                          ) : isSelectCell(cell) ? (
                            cell.options.find((o) => o.value === cell.value)?.label ?? ""
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                      <td className={`${dashboardTableStyles.tdAction} ${tableStyles.tdCenter}`}>
                        <button
                          type="button"
                          className={tableStyles.editBtn}
                          onClick={() => onEditRow(absoluteIdx)}
                          aria-label={t("common.actions.edit")}
                        >
                          <Icon src="/icons/pencil-edit.svg" size={19} />
                        </button>
                      </td>
                    </DashboardTr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </DashboardTable>
    );
  };

  return (
    <>
      <div>
        <div className={styles.section} onClick={handleToggle}>
          {section.title}
          <div className={styles.buttons}>
            {onEditSection && (
              <button
                type="button"
                className={styles.editBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditSection();
                }}
                aria-label={t("common.actions.edit")}
              >
                <Icon src="/icons/pencil-edit.svg" size={19} />
              </button>
            )}
            <ChevronIcon open={open} className={styles.chevron} />
          </div>
        </div>
        {open &&
          (section.subSections ? (
            renderSubSections()
          ) : (
            <DataTable
              rows={section.rows ?? []}
              columns={SECTION_COLUMNS[section.id] ?? SECTION_COLUMNS[tab] ?? []}
              onAdd={onAddRow}
              onEdit={onEditRow}
              onSelectCell={onSelectCell}
              isLoading={isLoading}
            />
          ))}
      </div>
    </>
  );
};
export default CollapsibleSection;
