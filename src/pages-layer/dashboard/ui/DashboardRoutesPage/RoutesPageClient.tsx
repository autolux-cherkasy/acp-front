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
  type RouteOption,
} from "@/src/features/admin-modals/HandleRoutesModal/HandleRoutesModal";
import type { SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import type { DateRange } from "@/src/widgets/MiniCalendar/MiniCalendar";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import { defaultMonthRange } from "@/src/shared/lib/dateRange";
import {
  formatDateForApi,
  formatMetroStops,
} from "@/src/shared/lib/formatters";
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
  | {
      mode: "edit";
      tripId: string;
      initialData: Partial<RouteFormState>;
      occupiedSeats: number;
      totalSeats: number;
    };

export default function RoutesPageClient() {
  const { t } = useI18n();
  const disclosure = useDisclosure<ModalPayload>();
  const [range, setRange] = useState<DateRange>(defaultMonthRange);

  const queryParams = useMemo(
    () => ({
      dateFrom: formatDateForApi(range.from),
      dateTo: formatDateForApi(range.to),
    }),
    [range],
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

  // Діапазон відсікає бекенд (dateFrom/dateTo — київські доби включно).
  const rows = useMemo(
    () => (data?.trips ?? []).map(mapTripToRow),
    [data?.trips],
  );
  const stats = useMemo(() => countRoutesStats(rows), [rows]);

  const vehicleOptions: SelectOption[] = useMemo(
    // У підписі лишається тільки держномер: модель робила рядок довшим за
    // ширину селекта й обрізалась багатокрапкою, а номер — те, за чим
    // диспетчер шукає автобус.
    () =>
      buses.map((bus) => ({
        value: bus.id,
        label: bus.registrationNumber,
      })),
    [buses],
  );

  const busSeats: Record<string, number> = useMemo(
    () =>
      Object.fromEntries(buses.map((bus) => [bus.id, bus.seatsCount])),
    [buses],
  );

  // У таблиці стоїть держномер, а PATCH знає лише busId — тримаємо мапу, щоб
  // оптимістичне оновлення могло підставити номер одразу.
  const busPlates: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(buses.map((bus) => [bus.id, bus.registrationNumber])),
    [buses],
  );

  const routeItems: RouteOption[] = useMemo(
    // Селект показує маршрут («м.Черкаси - м.Київ»), а поле «Рейс» — напрямок
    // конкретного запису розкладу, зі станцією прибуття.
    () =>
      routes.map((route) => ({
        id: route.id,
        name: formatMetroStops(route.name),
        schedules: route.schedules.map((entry) => ({
          id: entry.id,
          departureTime: entry.departureTime,
          arrivalTime: entry.arrivalTime,
          price: entry.price,
          direction: formatMetroStops(entry.direction),
          platform: entry.platform,
        })),
      })),
    [routes],
  );

  const statusOptions: SelectOption[] = (
    ["SCHEDULED", "BOARDING", "DEPARTED", "CANCELLED"] as TripStatus[]
  ).map((status) => ({
    value: status,
    label: t(`dispatcherArea.routes.table.statuses.${status}`),
  }));

  // Доба рейсу приходить із модалки; фолбек — початок діапазону в шапці.
  function buildTripBody(form: RouteFormState) {
    const departureDate = form.date || formatDateForApi(range.from);
    // Прибуття раніше за відправлення — рейс через північ.
    const arrivalDate =
      form.arrivalTime < form.departureTime
        ? nextDateOnly(departureDate)
        : departureDate;

    // Поля кількості місць немає — місткість беремо з обраного автобуса.
    const seatsCount = form.vehicle ? busSeats[form.vehicle] : undefined;

    return {
      routeId: form.route,
      departureTime: kyivWallClockToIso(departureDate, form.departureTime),
      arrivalTime: kyivWallClockToIso(arrivalDate, form.arrivalTime),
      // Платформа приїжджає разом із часом із того ж запису розкладу: саме вона
      // відрізняє два рейси, що виходять о тій самій годині.
      ...(form.platform ? { platform: form.platform } : {}),
      ...(form.vehicle ? { busId: form.vehicle } : {}),
      ...(seatsCount ? { totalSeats: seatsCount } : {}),
    };
  }

  function handleSubmit(form: RouteFormState) {
    const body = buildTripBody(form);

    if (disclosure.data?.mode === "edit") {
      // Отримавши routeId, бекенд переписує напрямок рейсу напрямком маршруту,
      // а він коротший: «м.Черкаси - м.Київ» замість «… (ст.м.Чернігівська)».
      // Поки маршрут не змінювали, id не шлемо — інакше станція зникає з таблиці.
      const { routeId, ...rest } = body;
      const isSameRoute = routeId === disclosure.data.initialData.route;

      // Ціну не передаємо взагалі: поля для неї в модалці немає, а PATCH без
      // price лишає рейсу поточну.
      const patch: UpdateTripBody = {
        ...rest,
        ...(isSameRoute ? {} : { routeId }),
        ...(form.status ? { status: form.status as TripStatus } : {}),
      };

      // Те, чого з patch не вивести: номер автобуса за busId і напрямок, яким
      // бекенд перепише рейс після зміни маршруту.
      const busNumber = form.vehicle ? busPlates[form.vehicle] : undefined;
      const direction = isSameRoute
        ? undefined
        : routeItems.find((item) => item.id === routeId)?.name;

      updateTrip.mutate({
        id: disclosure.data.tripId,
        body: patch,
        optimistic: {
          ...(busNumber ? { busNumber } : {}),
          ...(direction ? { direction } : {}),
        },
      });
    } else {
      // POST price вимагає, тож вона приїжджає з розкладу обраного рейсу.
      const payload: CreateTripBody = { ...body, price: Number(form.price) || 0 };

      addTrip.mutate(payload);
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
        range={range}
        onRangeChange={setRange}
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

          const row = rows.find((item) => item.id === id);

          // Запис розкладу шукаємо за часом і платформою разом: о тій самій
          // годині маршрут може мати два рейси на різні станції прибуття.
          const routeSchedules =
            routeItems.find((item) => item.id === trip.routeId)?.schedules ?? [];
          const scheduleEntry =
            routeSchedules.find(
              (entry) =>
                entry.departureTime === row?.departureTime &&
                entry.platform === trip.platform,
            ) ??
            routeSchedules.find(
              (entry) => entry.departureTime === row?.departureTime,
            );

          disclosure.open({
            mode: "edit",
            tripId: trip.id,
            occupiedSeats: trip.occupiedSeats,
            totalSeats: trip.totalSeats,
            initialData: {
              route: trip.routeId,
              // Відрізок беремо із запису розкладу: модалка фільтрує ним рейси,
              // а сама відновити його з рейсу не може. Запис міг зникнути з
              // розкладу — тоді лишається напрямок самого рейсу, щоб поле не
              // відкрилося порожнім.
              direction: scheduleEntry?.direction ?? row?.direction ?? "",
              schedule: scheduleEntry?.id ?? "",
              date: kyivDateOnly(trip.departureTime),
              departureTime: row?.departureTime ?? "",
              arrivalTime: row?.arrivalTime ?? "",
              platform: trip.platform,
              vehicle: trip.busId ?? "",
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
              : { date: formatDateForApi(range.from) }
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
          routes={routeItems}
          vehicleOptions={vehicleOptions}
          statusOptions={statusOptions}
          busSeats={busSeats}
          occupiedSeats={
            disclosure.data.mode === "edit" ? disclosure.data.occupiedSeats : 0
          }
          totalSeats={
            disclosure.data.mode === "edit"
              ? disclosure.data.totalSeats
              : undefined
          }
        />
      )}
    </>
  );
}
