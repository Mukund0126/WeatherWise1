import { create } from "zustand";
import { persist } from "zustand/middleware";
import { weatherService } from "../api/weather.service";
import { WeatherData, SearchHistoryItem, SearchSuggestion } from "../types/weather.types";
import { logger } from "@/lib/logger";

interface WeatherState {
  currentCity: string;
  recentSearches: SearchHistoryItem[];
  currentWeather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  errorType: string | null;
  coordinates: { lat: number; lon: number } | null;
  searchSuggestions: SearchSuggestion[];

  fetchWeather: (city: string, abortSignal?: AbortSignal) => Promise<void>;
  fetchWeatherByCoordinates: (lat: number, lon: number, abortSignal?: AbortSignal) => Promise<void>;
  fetchSuggestions: (query: string, abortSignal?: AbortSignal) => Promise<void>;
  clearError: () => void;
  addRecentSearch: (city: string) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      currentCity: "Ahmedabad",
      recentSearches: [],
      currentWeather: null,
      isLoading: false,
      error: null,
      errorType: null,
      coordinates: null,
      searchSuggestions: [],

      fetchWeather: async (city: string, abortSignal?: AbortSignal) => {
        set({ isLoading: true, error: null, errorType: null });
        try {
          const data = await weatherService.fetchWeather({ city }, abortSignal);
          set({
            currentWeather: data,
            currentCity: data.hero.city,
            coordinates: { lat: data.location.lat, lon: data.location.lon },
            isLoading: false,
          });
          get().addRecentSearch(data.hero.city);
        } catch (err: unknown) {
          const errMessage = err instanceof Error ? err.message : String(err);
          if (errMessage.includes("aborted")) {
            return;
          }
          const errType =
            err && typeof err === "object" && "type" in err
              ? String((err as Record<string, unknown>).type)
              : "API_ERROR";

          logger.error(`fetchWeather failed for city ${city}`, err);
          set({
            error: errMessage || "Failed to load weather data.",
            errorType: errType,
            isLoading: false,
          });
        }
      },

      fetchWeatherByCoordinates: async (
        lat: number,
        lon: number,
        abortSignal?: AbortSignal
      ) => {
        set({ isLoading: true, error: null, errorType: null });
        try {
          const data = await weatherService.fetchWeather({ lat, lon }, abortSignal);
          set({
            currentWeather: data,
            currentCity: data.hero.city,
            coordinates: { lat, lon },
            isLoading: false,
          });
          get().addRecentSearch(data.hero.city);
        } catch (err: unknown) {
          const errMessage = err instanceof Error ? err.message : String(err);
          if (errMessage.includes("aborted")) {
            return;
          }
          const errType =
            err && typeof err === "object" && "type" in err
              ? String((err as Record<string, unknown>).type)
              : "API_ERROR";

          logger.error(`fetchWeatherByCoordinates failed for ${lat}, ${lon}`, err);
          set({
            error: errMessage || "Failed to load weather data.",
            errorType: errType,
            isLoading: false,
          });
        }
      },

      fetchSuggestions: async (query: string, abortSignal?: AbortSignal) => {
        if (!query.trim()) {
          set({ searchSuggestions: [] });
          return;
        }
        try {
          const suggestions = await weatherService.fetchSuggestions(query, abortSignal);
          set({ searchSuggestions: suggestions });
        } catch (err: unknown) {
          const errMessage = err instanceof Error ? err.message : String(err);
          if (errMessage.includes("aborted")) {
            return;
          }
          logger.error(`fetchSuggestions failed for query ${query}`, err);
        }
      },

      clearError: () => set({ error: null, errorType: null }),

      addRecentSearch: (city: string) => {
        const trimmed = city.trim();
        if (!trimmed) return;

        const existing = get().recentSearches;
        const filtered = existing.filter(
          (item) => item.query.toLowerCase() !== trimmed.toLowerCase()
        );
        const newItem: SearchHistoryItem = {
          id: String(Date.now()),
          query: trimmed,
          timestamp: Date.now(),
        };

        const updated = [newItem, ...filtered].slice(0, 5);
        set({ recentSearches: updated });
      },
    }),
    {
      name: "weatherwise-store",
      partialize: (state) => ({
        currentCity: state.currentCity,
        recentSearches: state.recentSearches,
      }),
    }
  )
);

export default useWeatherStore;
