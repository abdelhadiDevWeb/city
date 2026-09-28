export type Role = "super_admin" | "admin" | "sub_admin";

type AccountBase = {
  id: string;
  email: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
};

export type Account =
  | (AccountBase & { type: "SuperAdmin"; nomComplet: string })
  | (AccountBase & {
      type: "Admin";
      prenom: string;
      nom: string;
      telephone: string;
      wilaya: string;
      daira: string;
      baladia: string;
      role: "admin" | "sub_admin";
      idResidence: string | null;
    });

type ApiBody = { ok: boolean; message?: string; details?: string[] } & Record<string, unknown>;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details: string[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Kept in memory only (never localStorage) so an XSS bug can't read a long-lived credential.
// The refresh token lives in an httpOnly cookie the JS can't touch.
let accessToken: string | null = null;
let csrfToken: string | null = null;
let refreshInFlight: Promise<Account | null> | null = null;

async function parse(res: Response): Promise<ApiBody> {
  const text = await res.text();
  if (!text) return { ok: res.ok };
  try {
    return JSON.parse(text) as ApiBody;
  } catch {
    return { ok: false, message: res.statusText || "Unexpected response" };
  }
}

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch("/api/auth/csrf", { credentials: "same-origin", cache: "no-store" });
  const body = await parse(res);
  if (!res.ok || typeof body.csrfToken !== "string") {
    throw new ApiError(res.status, body.message ?? "Could not get CSRF token");
  }
  csrfToken = body.csrfToken;
  return csrfToken;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

async function send(path: string, { method = "GET", body, auth = true }: RequestOptions): Promise<Response> {
  const headers: Record<string, string> = { accept: "application/json" };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (method !== "GET") headers["x-csrf-token"] = csrfToken ?? (await fetchCsrfToken());
  if (auth && accessToken) headers.authorization = `Bearer ${accessToken}`;

  return fetch(`/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
    cache: "no-store",
  });
}

export async function apiRequest<T = ApiBody>(path: string, options: RequestOptions = {}): Promise<T> {
  let res = await send(path, options);
  let body = await parse(res);

  // CSRF token expired or the session cookie was reset: get a fresh one and retry once.
  if (res.status === 403 && /csrf/i.test(body.message ?? "")) {
    await fetchCsrfToken();
    res = await send(path, options);
    body = await parse(res);
  }

  // Access token expired: rotate the session and retry once.
  if (res.status === 401 && options.auth !== false) {
    if (await refreshSession()) {
      res = await send(path, options);
      body = await parse(res);
    }
  }

  if (!res.ok) throw new ApiError(res.status, body.message ?? `Request failed (${res.status})`, body.details);
  return body as T;
}

type SessionResponse = { ok: true; account: Account; accessToken: string };

async function doRefresh(): Promise<Account | null> {
  try {
    const { account, accessToken: token } = await apiRequest<SessionResponse>("/auth/refresh", {
      method: "POST",
      auth: false,
    });
    accessToken = token;
    return account;
  } catch {
    accessToken = null;
    return null;
  }
}

// Refresh tokens are single-use: two concurrent refreshes (React StrictMode double effects,
// or two open tabs) would look like token theft and revoke the session. So refreshes are
// de-duplicated within the tab and serialized across tabs with the Web Locks API.
export function refreshSession(): Promise<Account | null> {
  if (!refreshInFlight) {
    const run = async (): Promise<Account | null> => {
      if (typeof navigator !== "undefined" && navigator.locks) {
        return await navigator.locks.request("city-auth-refresh", doRefresh);
      }
      return doRefresh();
    };
    refreshInFlight = run().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

export async function login(email: string, password: string): Promise<Account> {
  const res = await apiRequest<SessionResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false });
  accessToken = res.accessToken;
  return res.account;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest("/auth/logout", { method: "POST", auth: false });
  } finally {
    accessToken = null;
  }
}

export async function logoutAll(): Promise<void> {
  try {
    await apiRequest("/auth/logout-all", { method: "POST" });
  } finally {
    accessToken = null;
  }
}

export async function getMe(): Promise<Account> {
  const res = await apiRequest<{ ok: true; account: Account }>("/me");
  return res.account;
}

export async function getHealth(): Promise<boolean> {
  try {
    const res = await apiRequest<{ ok: boolean }>("/health", { auth: false });
    return res.ok === true;
  } catch {
    return false;
  }
}
