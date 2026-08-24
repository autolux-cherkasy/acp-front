import { useMutation } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { ApiError } from "@/src/shared/api/http";
import { showServerToast } from "@/src/shared/lib/toast";
import {
  exportStatsXlsx,
  type StatsExportParams,
} from "./statsExportApi";
import {
  buildStatsXlsxFallbackFilename,
  downloadStatsXlsx,
} from "./statsExportDownload";
import { STATS_EXPORT_KEY } from "./dashboardApiKeys";

function formatToastMessage(
  template: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replace(`{${key}}`, String(value)),
    template,
  );
}

export function useExportStatsMutation() {
  const { t } = useI18n();

  return useMutation({
    mutationFn: async (params: StatsExportParams) => {
      const result = await exportStatsXlsx(params);
      return {
        ...result,
        params,
      };
    },
    mutationKey: [STATS_EXPORT_KEY],
    onSuccess: ({ blob, filename, params }) => {
      downloadStatsXlsx(
        blob,
        filename ?? buildStatsXlsxFallbackFilename(params.startDate, params.endDate),
      );

      showServerToast({
        type: "success",
        message: formatToastMessage(t("common.toast.statsExportSuccess"), {
          period: `${params.startDate} – ${params.endDate}`,
        }),
      });
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError && error.status === 404) {
        showServerToast({
          type: "error",
          errorMessage: t("common.toast.statsExportEmpty"),
        });
        return;
      }

      if (error instanceof ApiError && error.status === 503) {
        showServerToast({
          type: "error",
          errorMessage: t("common.toast.statsExportDisabled"),
        });
        return;
      }

      showServerToast({
        type: "error",
        error,
        errorMessage: t("common.toast.statsExportError"),
      });
    },
  });
}
