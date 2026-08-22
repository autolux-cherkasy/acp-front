import { DataAccessGate } from "@/src/features/access-control";
import DataMgmtPage from "@/src/pages-layer/dashboard/ui/DashboardDataMgmtPage/DataMgmtPage";

export default function DispatcherDataPage() {
  return (
    <DataAccessGate>
      <DataMgmtPage />
    </DataAccessGate>
  );
}
