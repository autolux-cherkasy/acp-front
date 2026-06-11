"use client";
import { useI18n } from "@/src/shared";
import { DataSection } from "./mockData";
import { useState } from "react";
import styles from "./DataMgmtPage.module.css";
import Icon from "@/src/shared/ui/Icon/Icon";
import ChevronIcon from "@/src/shared/ui/ChevronIcon/ChevronIcon";
import DataTable from "@/src/shared/ui/DataTable/DataTable";

type CollapsiblesectionProps = {
  section: DataSection;
  tab: string;
  index: number;
};
const CollapsibleSection = ({ section, tab }: CollapsiblesectionProps) => {
  const [open, setOpen] = useState(false);
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
            <button
              type="button"
              className={styles.editBtn}
              onClick={(e) => {
                e.stopPropagation();
              }}
              aria-label={t("common.actions.edit")}
            >
              <Icon src="/icons/pencil-edit.svg" size={19} />
            </button>
            <ChevronIcon open={open} className={styles.chevron} />
          </div>
        </div>
        {open && (
          <DataTable
            rows={section.rows ?? []}
            columns={section.columns ?? []}
            onAdd={() => {}}
            onEdit={() => {}}
          />
        )}
      </div>
    </>
  );
};
export default CollapsibleSection;
