import StatusBadge from "@/src/shared/ui/StatusBadge/StatusBadge";
import type { StatusBadgeVariant } from "@/src/shared/ui/StatusBadge/StatusBadge";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import type { BookingStatus } from "../../model/types";

type StatusConfig = {
  labelKey: string;
  variant: StatusBadgeVariant;
};

const STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
  reserved: {
    labelKey: "dispatcherArea.tickets.statuses.reserved",
    variant: "warning",
  },

  pending: {
    labelKey: "dispatcherArea.tickets.statuses.pending",
    variant: "warning",
  },

  completed: {
    labelKey: "dispatcherArea.tickets.statuses.completed",
    variant: "success",
  },

  cancelled: {
    labelKey: "dispatcherArea.tickets.statuses.cancelled",
    variant: "neutral",
  },

  expired: {
    labelKey: "dispatcherArea.tickets.statuses.expired",
    variant: "danger",
  },
};

type Props = {
  status: BookingStatus;
};

export default function TicketStatusBadge({ status }: Props) {
  const { t } = useI18n();
  const { labelKey, variant } = STATUS_CONFIG[status];

  return <StatusBadge label={t(labelKey)} variant={variant} />;
}
