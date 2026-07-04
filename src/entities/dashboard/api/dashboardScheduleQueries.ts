import { useQuery } from "@tanstack/react-query";
import { getAdminSchedule, RouteWithSchedule } from "./dashboardScheduleApi";
import { ADMIN_SCHEDULE_KEY } from "./dashboardApiKeys";
export { ADMIN_SCHEDULE_KEY };

export const useAdminScheduleQuery = (options?: { enabled?: boolean }) =>
  useQuery<RouteWithSchedule[]>({
    queryFn: getAdminSchedule,
    queryKey: [ADMIN_SCHEDULE_KEY],
    staleTime: 1000 * 60 * 5,
    ...options,
  });
