import { MOCK_ROWS } from "@/src/widgets/AdminComp/lib/routesTable.utils";
import styles from "./routes.module.css";
import RoutesPageClient from "./RoutesPageClient";

export default function DashboardRoutesPage() {
  const rows = MOCK_ROWS;

  const stats = {
    total: rows.length,
    boarding: rows.filter((r) => r.status === "BOARDING").length,
    departed: rows.filter((r) => r.status === "DEPARTED").length,
    cancelled: rows.filter((r) => r.status === "CANCELLED").length,
  };

  return (
    <div className={styles.mainContainer}>
      <RoutesPageClient rows={rows} stats={stats} />
    </div>
  );
}
