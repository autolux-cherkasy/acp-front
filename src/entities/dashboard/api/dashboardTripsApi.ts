import { apiFetch } from "@/src/shared";
import type { TripStatus } from "@/src/entities/trip";
import { ADMIN_TRIPS_URL } from "./dashboardApiKeys";

export type AdminTripDto = {
  id: string;
  routeId: string;
  routeNumber: string;
  busId: string | null;
  busNumber: string | null;
  platform: string;
  direction: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  occupiedSeats: number;
  status: TripStatus;
  isFull: boolean;
};

export type AdminTripsResponse = {
  trips: AdminTripDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  emptyMessage?: string;
};

export type GetAdminTripsParams = {
  /** Календарна доба відправлення, YYYY-MM-DD. Бекенд трактує її як київську. */
  date?: string;
  /** Межі діапазону відправлення, YYYY-MM-DD включно. */
  dateFrom?: string;
  dateTo?: string;
  status?: TripStatus;
  page?: number;
  limit?: number;
};

/**
 * Таблиця пагінується на клієнті: useResizeTableHook рахує rowsPerPage від
 * висоти контейнера, тож серверна пагінація з фіксованим limit з нею
 * не поєднується — віддаємо їй увесь діапазон одним масивом.
 */
export const ADMIN_TRIPS_PAGE_SIZE = 500;

/**
 * Стеля обходу сторінок. Діапазон за замовчуванням — місяць, а це вже
 * кілька тисяч рейсів; без стелі надто широкий вибір дат перетворився б
 * на десятки запитів поспіль.
 */
const ADMIN_TRIPS_MAX_PAGES = 10;

const getAdminTripsPage = (
  {
    date,
    dateFrom,
    dateTo,
    status,
    limit = ADMIN_TRIPS_PAGE_SIZE,
  }: GetAdminTripsParams,
  page: number,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "departureTime",
    sortOrder: "asc",
  });

  if (date) params.set("date", date);
  if (dateFrom) params.set("dateFrom", dateFrom);
  if (dateTo) params.set("dateTo", dateTo);
  if (status) params.set("status", status);

  return apiFetch<AdminTripsResponse>(`${ADMIN_TRIPS_URL}?${params.toString()}`);
};

export const getAdminTrips = async (
  params: GetAdminTripsParams = {},
): Promise<AdminTripsResponse> => {
  const firstPage = await getAdminTripsPage(params, params.page ?? 1);

  // Сторінку попросили явно — віддаємо саме її, без добору решти.
  if (params.page || firstPage.totalPages <= 1) {
    return firstPage;
  }

  const restPages = await Promise.all(
    Array.from(
      { length: Math.min(firstPage.totalPages, ADMIN_TRIPS_MAX_PAGES) - 1 },
      (_, index) => getAdminTripsPage(params, index + 2),
    ),
  );

  return {
    ...firstPage,
    trips: restPages.reduce(
      (trips, response) => trips.concat(response.trips),
      firstPage.trips,
    ),
  };
};

type TripBodyBase = {
  departureTime: string;
  arrivalTime: string;
  price: number;
  busId?: string;
  totalSeats?: number;
  platform?: string;
};

/**
 * Бекенд вимагає рівно одне з двох: id наявного маршруту або рядок напрямку,
 * за яким він upsert-ить Route (див. resolveTripRoute).
 */
export type CreateTripBody = TripBodyBase &
  ({ routeId: string; direction?: never } | { direction: string; routeId?: never });

export type UpdateTripBody = Partial<TripBodyBase> & {
  routeId?: string;
  direction?: string;
  status?: TripStatus;
};

export const addTrip = (body: CreateTripBody) =>
  apiFetch<AdminTripDto>(ADMIN_TRIPS_URL, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateTrip = (id: string, body: UpdateTripBody) =>
  apiFetch<AdminTripDto>(`${ADMIN_TRIPS_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const updateTripStatus = (id: string, status: TripStatus) =>
  apiFetch<AdminTripDto>(`${ADMIN_TRIPS_URL}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteTrip = (id: string) =>
  apiFetch<void>(`${ADMIN_TRIPS_URL}/${id}`, {
    method: "DELETE",
  });
