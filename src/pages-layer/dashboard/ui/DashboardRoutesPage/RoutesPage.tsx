import styles from "./routes.module.css";
import RoutesPageClient from "./RoutesPageClient";

export default function DashboardRoutesPage() {
  return (
    <div className={styles.mainContainer}>
      <RoutesPageClient />
    </div>
  );
}
