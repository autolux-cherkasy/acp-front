"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import styles from "./StatisticsPage.module.css";

const SPARKLINE_DATA = [
  { v: 80 },
  { v: 120 },
  { v: 100 },
  { v: 200 },
  { v: 180 },
  { v: 280 },
  { v: 320 },
];

export default function RevenueSparkline() {
  return (
    <div className={styles.sparkline}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={SPARKLINE_DATA}>
          <Line type="monotone" dataKey="v" stroke="#226078" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
