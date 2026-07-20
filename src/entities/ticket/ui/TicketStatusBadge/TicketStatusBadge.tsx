import StatusBadge from "@/src/shared/ui/StatusBadge/StatusBadge";
import type { StatusBadgeVariant } from "@/src/shared/ui/StatusBadge/StatusBadge";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import type { TicketStatus } from "../../model/types";

type StatusConfig = {
  labelKey: string;
  variant: StatusBadgeVariant;
};

const STATUS_CONFIG: Record<TicketStatus, StatusConfig> = {
  booked: {
    labelKey: "dispatcherArea.tickets.statuses.bookedShort",
    variant: "warning",
  },
  paid: {
    labelKey: "dispatcherArea.tickets.statuses.paid",
    variant: "success",
  },
  cancelled: {
    labelKey: "dispatcherArea.tickets.statuses.cancelled",
    variant: "danger",
  },
  expired: {
    labelKey: "dispatcherArea.tickets.statuses.expired",
    variant: "neutral",
  },
};

type Props = {
  status: TicketStatus;
};

export default function TicketStatusBadge({ status }: Props) {
  const { t } = useI18n();
  const { labelKey, variant } = STATUS_CONFIG[status];

  return <StatusBadge label={t(labelKey)} variant={variant} />;
}
