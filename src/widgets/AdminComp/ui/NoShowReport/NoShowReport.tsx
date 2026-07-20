"use client";

import BlockedUserModal from "@/src/features/admin-modals/BlockedUserModal/BlockedUserModal";
import {
  DashboardCard,
  DashboardTable,
  DashboardThead,
  DashboardTr,
  EmptyState,
  LoadingState,
} from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import StatusBadge from "@/src/shared/ui/StatusBadge/StatusBadge";
import { useState } from "react";
import styles from "./NoShowReport.module.css";

type NoShowRow = {
  id: number;
  name: string;
  phone: string;
  ratio: string;
  isBlocked: boolean;
};

type Props = {
  rows?: NoShowRow[];
  onBlockUser?: (userId: number) => void;
  isLoading?: boolean;
};

export default function NoShowReport({ rows = [], onBlockUser, isLoading }: Props) {
  const { t } = useI18n();
  const [blocked, setBlocked] = useState<Set<number>>(new Set());
  const blockedUserModal = useDisclosure<number>();

  function setBlockedState(id: number, isBlockedNow: boolean) {
    setBlocked((prev) => {
      const next = new Set(prev);
      if (isBlockedNow) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function block(id: number) {
    setBlockedState(id, true);
    onBlockUser?.(id);
  }

  return (
    <DashboardCard
      className={styles.card}
      title={t("dispatcherArea.analytics.noShowReport.title")}
      subtitle={t("dispatcherArea.analytics.noShowReport.subtitle")}
    >
      {isLoading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState
          iconUrl="/icons/no-person.svg"
          title={t("dispatcherArea.analytics.noShowReport.empty.title")}
          description={[
            t("dispatcherArea.analytics.noShowReport.empty.description"),
            t("dispatcherArea.analytics.noShowReport.empty.note"),
          ]}
        />
      ) : (
        <div className={styles.tableWrapper}>
          <DashboardTable className={styles.table}>
            <colgroup>
              <col className={styles.colNum} />
              <col className={styles.colName} />
              <col className={styles.colPhone} />
              <col className={styles.colRatio} />
              <col className={styles.colAction} />
            </colgroup>
            <DashboardThead className={styles.theadRow}>
              <th className={styles.thNum}>
                {t("dispatcherArea.analytics.noShowReport.columns.number")}
              </th>
              <th className={styles.th}>
                {t("dispatcherArea.analytics.noShowReport.columns.passenger")}
              </th>
              <th className={styles.th}>
                {t("dispatcherArea.analytics.noShowReport.columns.phone")}
              </th>
              <th className={styles.thRatio}>
                {t("dispatcherArea.analytics.noShowReport.columns.ratio")}
              </th>
              <th className={styles.thAction} />
            </DashboardThead>
            <tbody>
              {rows.map((row, index) => (
                <>
                  <DashboardTr key={row.id} className={styles.row}>
                    <td className={styles.tdNum}>{index + 1}</td>
                    <td className={`${styles.td} ${styles.tdLeft} ${styles.tdName}`}>
                      {row.name || t("common.notSpecified")}
                    </td>
                    <td className={`${styles.td} ${styles.tdLeft} ${styles.tdPhone}`}>
                      {row.phone || t("common.notSpecified")}
                    </td>
                    <td className={styles.td}>{row.ratio}</td>
                    <td className={styles.tdAction}>
                      <div className={styles.actionGroup}>
                        {row.isBlocked || blocked.has(row.id) ? (
                          <StatusBadge
                            label={t("dispatcherArea.analytics.noShowReport.blocked")}
                            variant="softDanger"
                            className={styles.blockedBadge}
                            withDot={false}
                          />
                        ) : (
                          <button
                            type="button"
                            className={styles.blockBtn}
                            onClick={() => block(row.id)}
                          >
                            {t("dispatcherArea.analytics.noShowReport.blockBtn")}
                          </button>
                        )}
                        <button
                          type="button"
                          className={styles.moreBtn}
                          aria-label={t("dispatcherArea.analytics.noShowReport.moreActions")}
                          onClick={() => {
                            blockedUserModal.open(row.id);
                          }}
                        >
                          <span className={styles.moreBtnIcon} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </DashboardTr>
                  {blockedUserModal.isOpen && (
                    <BlockedUserModal
                      userId={blockedUserModal.data}
                      onClose={blockedUserModal.close}
                      action={() => {
                        if (blockedUserModal.data !== null) {
                          setBlockedState(blockedUserModal.data, !row.isBlocked);
                        }
                        blockedUserModal.close();
                      }}
                      isBlocked={row.isBlocked}
                    />
                  )}
                </>
              ))}
            </tbody>
          </DashboardTable>
        </div>
      )}
    </DashboardCard>
  );
}
