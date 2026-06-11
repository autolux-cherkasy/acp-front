"use client";
import { useI18n } from "@/src/shared";
import ChevronIcon from "@/src/shared/ui/ChevronIcon/ChevronIcon";
import DataTable from "@/src/shared/ui/DataTable/DataTable";
import Icon from "@/src/shared/ui/Icon/Icon";
import { useState } from "react";
import styles from "./DataMgmtPage.module.css";
import { DataSection } from "./mockData";

type CollapsiblesectionProps = {
  section: DataSection;
  tab: string;
  index: number;
  onEditSection?: () => void;
  onAddRow: () => void;
  onEditRow: (index: number) => void;
  initialOpenState?: boolean;
};
const CollapsibleSection = ({
  section,
  tab,
  onAddRow,
  onEditRow,
  onEditSection,
  initialOpenState,
}: CollapsiblesectionProps) => {
  const [open, setOpen] = useState(initialOpenState ?? false);
  const { t } = useI18n();

  const handleToggle = () => {
    setOpen((prev) => !prev);
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
        {open && (
          <DataTable
            rows={section.rows ?? []}
            columns={section.columns ?? []}
            onAdd={onAddRow}
            onEdit={onEditRow}
          />
        )}
      </div>
    </>
  );
};
export default CollapsibleSection;
