import { apiClient } from "@/lib/api-client";
import { WeatherData, SearchSuggestion } from "../types/weather.types";
import { logger } from "@/lib/logger";

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_LIFETIME_MS = 5 * 60 * 1000;

export const weatherService = {
  async fetchWeather(
    params: { city?: string; lat?: number; lon?: number },
    signal?: AbortSignal
  ): Promise<WeatherData> {
    const { city, lat, lon } = params;

    let cacheKey = "";
    let url = "/api/weather?";

    if (lat !== undefined && lon !== undefined) {
      cacheKey = `coords:${lat.toFixed(4)},${lon.toFixed(4)}`;
      url += `lat=${lat}&lon=${lon}`;
    } else if (city) {
      cacheKey = `city:${city.trim().toLowerCase()}`;
      url += `city=${encodeURIComponent(city.trim())}`;
    } else {
      throw new Error("Parameters must include city or coordinates.");
    }

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_LIFETIME_MS) {
      logger.info(`Returning cached weather data for key: ${cacheKey}`);
      return cached.data;
    }

    logger.info(`Fetching weather data for key: ${cacheKey}`);
    const data = await apiClient.get<WeatherData>(url, { signal });

    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  },

  async fetchSuggestions(
    query: string,
    signal?: AbortSignal
  ): Promise<SearchSuggestion[]> {
    if (!query || query.trim().length < 2) return [];

    const url = `/api/weather/suggestions?q=${encodeURIComponent(query.trim())}`;
    return await apiClient.get<SearchSuggestion[]>(url, { signal });
  },
};

export default weatherService;
