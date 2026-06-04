export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export class ApiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiConfigurationError";
  }
}

export interface ApiFetchOptions extends RequestInit {
  accessToken?: string | null;
}

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, "") ?? "";

export const hasApiBaseUrl = () => getApiBaseUrl().length > 0;

export async function apiFetch<TResponse>(
  path: string,
  { accessToken, headers, ...init }: ApiFetchOptions = {},
): Promise<TResponse> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new ApiConfigurationError("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    headers: requestHeaders,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    throw new ApiError(`MythStride API request failed with status ${response.status}.`, response.status, body);
  }

  return body as TResponse;
}
