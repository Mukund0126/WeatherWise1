import { logger } from "@/lib/logger";

export interface IWeatherProvider {
  getForecastByCity(city: string, days?: number): Promise<unknown>;
  getForecastByCoords(lat: number, lon: number, name?: string, region?: string, country?: string, days?: number): Promise<unknown>;
  getSuggestions(query: string): Promise<unknown>;
}

export class WeatherApiProvider implements IWeatherProvider {
  private apiKey: string;
  private baseUrl = "https://api.weatherapi.com/v1";

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || "";
    if (!this.apiKey) {
      logger.warn(
        "WEATHER_API_KEY is not defined in the server-side environment variables."
      );
    }
  }

  async getForecastByCity(city: string, days = 7): Promise<unknown> {
    const url = `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(
      city
    )}&days=${days}&aqi=yes&alerts=no`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorJson = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        const errMsg =
          errorJson.error?.message || `WeatherAPI returned status ${res.status}`;
        throw new Error(errMsg);
      }
      return await res.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(
        `WeatherApiProvider error fetching forecast for city "${city}"`,
        err
      );
      throw new Error(message);
    }
  }

  async getForecastByCoords(lat: number, lon: number, name?: string, region?: string, country?: string, days = 7): Promise<unknown> {
    const url = `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${lat},${lon}&days=${days}&aqi=yes&alerts=no`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorJson = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        const errMsg =
          errorJson.error?.message || `WeatherAPI returned status ${res.status}`;
        throw new Error(errMsg);
      }
      return await res.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(
        `WeatherApiProvider error fetching forecast for coords "${lat},${lon}"`,
        err
      );
      throw new Error(message);
    }
  }

  async getSuggestions(query: string): Promise<unknown> {
    const url = `${this.baseUrl}/search.json?key=${this.apiKey}&q=${encodeURIComponent(
      query
    )}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`WeatherAPI search returned status ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(
        `WeatherApiProvider error fetching suggestions for query "${query}"`,
        err
      );
      throw new Error(message);
    }
  }
}
