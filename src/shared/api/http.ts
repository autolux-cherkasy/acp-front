import { endClientSession, getCsrfToken, setCsrfToken } from "./session";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function normalizeApiUrl(rawApiUrl: string) {
  const trimmedApiUrl = rawApiUrl.replace(/\/$/, "");

  if (trimmedApiUrl.endsWith("/api/v1")) {
    return trimmedApiUrl;
  }

  if (trimmedApiUrl.endsWith("/api")) {
    return `${trimmedApiUrl}/v1`;
  }

  return `${trimmedApiUrl}/api/v1`;
}

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_URL = rawApiUrl ? normalizeApiUrl(rawApiUrl) : null;

// Static assets (e.g. /uploads/...) are served from the API origin directly,
// bypassing the /api/v1 prefix used by apiFetch.
export const API_ORIGIN = API_URL ? API_URL.replace(/\/api\/v1$/, "") : null;

export function resolveAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return API_ORIGIN ? `${API_ORIGIN}${path}` : path;
}

type ApiFetchOptions = RequestInit & {
  includeAuth?: boolean;
  skipAuthRefresh?: boolean;
};

type ErrorResponse = {
  message?: string | string[];
};

type RefreshResponse = {
  access_token?: string;
  csrf_token?: string;
};

let refreshPromise: Promise<boolean> | null = null;

function buildHeaders(headersInit: HeadersInit | undefined, body: BodyInit | null | undefined) {
  const headers = new Headers(headersInit);

  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

async function getErrorMessage(response: Response) {
  const message = "Request failed";

  try {
    const body = (await parseResponse<ErrorResponse>(response)) ?? null;
    const responseMessage = body?.message;
    if (Array.isArray(responseMessage)) return responseMessage.join(", ");
    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }
  } catch {}

  return message;
}

async function sendRequest(path: string, options: ApiFetchOptions) {
  const { includeAuth: _includeAuth, ...requestInit } = options;

  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const method = requestInit.method?.toUpperCase() ?? "GET";

  const headers = buildHeaders(requestInit.headers, requestInit.body);

  const csrfToken = getCsrfToken();
  if (csrfToken && ["POST", "PATCH", "PUT", "DELETE"].includes(method)) {
    headers.set("X-CSRF-Token", csrfToken);
  }

  return fetch(`${API_URL}${path}`, {
    ...requestInit,
    headers,
    cache: "no-store",
    credentials: "include",
  });
}

async function refreshAccessToken(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!API_URL) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const existingCsrfToken = getCsrfToken();
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        cache: "no-store",
        credentials: "include",
        headers: existingCsrfToken ? { "X-CSRF-Token": existingCsrfToken } : undefined,
      });

      if (!response.ok) {
        endClientSession();
        return false;
      }

      const body = await parseResponse<RefreshResponse>(response);
      if (!body?.access_token) {
        endClientSession();
        return false;
      }

      if (body.csrf_token) {
        setCsrfToken(body.csrf_token);
      }
      return true;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  let response = await sendRequest(path, options);

  if (response.status === 401 && !options.skipAuthRefresh) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      response = await sendRequest(path, options);
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      endClientSession();
    }

    throw new ApiError(await getErrorMessage(response), response.status);
  }

  return parseResponse<T>(response);
}
