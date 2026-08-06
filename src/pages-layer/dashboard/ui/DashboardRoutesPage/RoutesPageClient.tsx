"use client";

import { useMemo, useState } from "react";
import { getBuses } from "@/src/entities/dashboard/api/dashboardBusesApi";
import { ADMIN_FLEET_KEY } from "@/src/entities/dashboard/api/dashboardApiKeys";
import {
  useAddTripMutation,
  useAdminTripsQuery,
  useDeleteTripMutation,
  useUpdateTripMutation,
  useUpdateTripStatusMutation,
} from "@/src/entities/dashboard/api/dashboardTripsQueries";
import type {
  CreateTripBody,
  UpdateTripBody,
} from "@/src/entities/dashboard/api/dashboardTripsApi";
import { useAdminScheduleQuery } from "@/src/entities/dashboard/api/dashboardScheduleQueries";
import type { TripStatus } from "@/src/entities/trip";
import HandleRoutesModal, {
  type RouteFormState,
} from "@/src/features/admin-modals/HandleRoutesModal/HandleRoutesModal";
import type { SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import { formatDateForApi } from "@/src/shared/lib/formatters";
import {
  kyivDateOnly,
  kyivWallClockToIso,
  nextDateOnly,
} from "@/src/shared/lib/kyivTime";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import DashboardPageHeader from "@/src/widgets/AdminComp/ui/Header/DashboardPageHeader";
import RoutesStats from "@/src/widgets/AdminComp/ui/Header/RoutesStats";
import RoutesTable from "@/src/widgets/AdminComp/ui/RoutesTable";
import {
  countRoutesStats,
  mapTripToRow,
} from "@/src/widgets/AdminComp/lib/routesTable.utils";
import { useQuery } from "@tanstack/react-query";

type ModalPayload =
  | { mode: "create" }
  | { mode: "edit"; tripId: string; initialData: Partial<RouteFormState> };

export default function RoutesPageClient() {
  const { t } = useI18n();
  const disclosure = useDisclosure<ModalPayload>();
  const [chosenDate, setChosenDate] = useState(() => new Date());

  const queryParams = useMemo(
    () => ({ date: formatDateForApi(chosenDate) }),
    [chosenDate],
  );

  const { data, isLoading, isError, refetch } = useAdminTripsQuery(queryParams);
  const { data: buses = [] } = useQuery({
    queryKey: [ADMIN_FLEET_KEY],
    queryFn: getBuses,
    staleTime: 1000 * 60 * 5,
  });
  const { data: routes = [] } = useAdminScheduleQuery();

  const addTrip = useAddTripMutation(queryParams);
  const updateTrip = useUpdateTripMutation(queryParams);
  const updateStatus = useUpdateTripStatusMutation(queryParams);
  const deleteTrip = useDeleteTripMutation(queryParams);

  const rows = useMemo(
    () => (data?.trips ?? []).map(mapTripToRow),
    [data?.trips],
  );
  const stats = useMemo(() => countRoutesStats(rows), [rows]);

  const vehicleOptions: SelectOption[] = useMemo(
    () =>
      buses.map((bus) => ({
        value: bus.id,
        label: `${bus.registrationNumber} — ${bus.model}`,
      })),
    [buses],
  );

  const routeOptions: SelectOption[] = useMemo(
    () => routes.map((route) => ({ value: route.id, label: route.name })),
    [routes],
  );

  const statusOptions: SelectOption[] = (
    ["SCHEDULED", "BOARDING", "DEPARTED", "CANCELLED"] as TripStatus[]
  ).map((status) => ({
    value: status,
    label: t(`dispatcherArea.routes.table.statuses.${status}`),
  }));

  function buildTripBody(form: RouteFormState): CreateTripBody {
    const departureDate = form.date || formatDateForApi(chosenDate);
    // Прибуття раніше за відправлення — рейс через північ.
    const arrivalDate =
      form.arrivalTime < form.departureTime
        ? nextDateOnly(departureDate)
        : departureDate;

    const direction = [form.departureCity, form.arrivalCity]
      .map((city) => city.trim())
      .filter(Boolean)
      .join(" - ");

    return {
      // Наявний маршрут краще передати за id: інакше бекенд upsert-ить новий
      // Route за рядком напрямку і плодить дублікати.
      ...(form.route ? { routeId: form.route } : { direction }),
      departureTime: kyivWallClockToIso(departureDate, form.departureTime),
      arrivalTime: kyivWallClockToIso(arrivalDate, form.arrivalTime),
      price: Number(form.price),
      ...(form.vehicle ? { busId: form.vehicle } : {}),
      ...(form.seats ? { totalSeats: Number(form.seats) } : {}),
    };
  }

  function handleSubmit(form: RouteFormState) {
    const body = buildTripBody(form);

    if (disclosure.data?.mode === "edit") {
      const patch: UpdateTripBody = {
        ...body,
        ...(form.status ? { status: form.status as TripStatus } : {}),
      };

      updateTrip.mutate({ id: disclosure.data.tripId, body: patch });
    } else {
      addTrip.mutate(body);
    }

    disclosure.close();
  }

  return (
    <>
      <DashboardPageHeader
        title={t("dispatcherArea.sidebar.menu.routes")}
        subtitle={t("dispatcherArea.routes.subtitle")}
        action={{
          text: t("dispatcherArea.routes.addRoute"),
          onClick: () => disclosure.open({ mode: "create" }),
        }}
        onCalendarChange={setChosenDate}
      />
      <RoutesStats {...stats} />
      <RoutesTable
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
        onEditRoute={(id) => {
          const trip = data?.trips.find((item) => item.id === id);
          if (!trip) return;

          const [departureCity = "", arrivalCity = ""] =
            trip.direction.split(" - ");
          const row = rows.find((item) => item.id === id);

          disclosure.open({
            mode: "edit",
            tripId: trip.id,
            initialData: {
              route: trip.routeId,
              departureCity,
              arrivalCity,
              date: kyivDateOnly(trip.departureTime),
              departureTime: row?.departureTime ?? "",
              arrivalTime: row?.arrivalTime ?? "",
              vehicle: trip.busId ?? "",
              seats: String(trip.totalSeats),
              price: String(trip.price),
              status: trip.status,
            },
          });
        }}
      />
      {disclosure.isOpen && disclosure.data && (
        <HandleRoutesModal
          mode={disclosure.data.mode}
          initialData={
            disclosure.data.mode === "edit"
              ? disclosure.data.initialData
              : { date: formatDateForApi(chosenDate) }
          }
          onClose={disclosure.close}
          onSubmit={handleSubmit}
          onDelete={
            disclosure.data.mode === "edit"
              ? () => {
                  const { tripId } = disclosure.data as {
                    mode: "edit";
                    tripId: string;
                  };
                  deleteTrip.mutate(tripId);
                  disclosure.close();
                }
              : undefined
          }
          routeOptions={routeOptions}
          vehicleOptions={vehicleOptions}
          statusOptions={statusOptions}
        />
      )}
    </>
  );
}
