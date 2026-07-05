"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./TicketsTable.module.css";

export default function TicketsTableSkeleton() {
    const rows = Array.from({ length: 8 });

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead>
                <tr>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <th key={index} className={styles.th}>
                            <Skeleton height={16} />
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {rows.map((_, rowIndex) => (
                    <tr key={rowIndex} className={styles.tr}>
                        {Array.from({ length: 8 }).map((__, cellIndex) => (
                            <td key={cellIndex} className={styles.td}>
                                <Skeleton height={18} />
                                {cellIndex === 1 && <Skeleton height={14} width="70%" />}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}