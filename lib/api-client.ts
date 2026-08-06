import { logger } from "./logger";

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export class ApiError extends Error {
  status: number;
  type: string;

  constructor(message: string, status: number, type = "API_ERROR") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.type = type;
  }
}

export const apiClient = {
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = 8000, signal, headers, ...rest } = options;

    const controller = new AbortController();
    const localSignal = controller.signal;

    if (signal) {
      signal.addEventListener("abort", () => controller.abort());
    }

    const timeoutId = setTimeout(() => {
      logger.warn(`API Request timeout on URL: ${url}`);
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        method: "GET",
        signal: localSignal,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        ...rest,
      });

      if (!response.ok) {
        let errorData: Record<string, unknown> = {};
        try {
          const parsed = await response.json();
          if (parsed && typeof parsed === "object") {
            errorData = parsed as Record<string, unknown>;
          }
        } catch {
          // Non-JSON response
        }

        const errorMsg =
          typeof errorData.message === "string"
            ? errorData.message
            : `HTTP error! status: ${response.status}`;
        const errorType =
          typeof errorData.type === "string"
            ? errorData.type
            : "API_ERROR";

        throw new ApiError(errorMsg, response.status, errorType);
      }

      const data = (await response.json()) as T;
      return data;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        if (signal?.aborted) {
          throw new ApiError("Request aborted by user", 499, "REQUEST_ABORTED");
        } else {
          throw new ApiError("Request timed out", 408, "TIMEOUT_ERROR");
        }
      }
      if (error instanceof ApiError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : "Network request failed";
      logger.error(`Network or fetch error on URL: ${url}`, error);
      throw new ApiError(message, 500, "NETWORK_ERROR");
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

export default apiClient;
