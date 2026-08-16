"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import styles from "./StatisticsPage.module.css";

type Props = { points?: number[] };

export default function RevenueSparkline({ points }: Props) {
  const chartData = (points ?? []).map((v) => ({ v }));

  if (chartData.length < 2) return null;

  return (
    <div className={styles.sparkline}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="v" stroke="#226078" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
