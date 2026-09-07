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
  isSearching: boolean;
  searchError: string | null;

  fetchWeather: (city: string, abortSignal?: AbortSignal) => Promise<void>;
  fetchWeatherByCoordinates: (lat: number, lon: number, name?: string, region?: string, country?: string, abortSignal?: AbortSignal) => Promise<void>;
  fetchSuggestions: (query: string, abortSignal?: AbortSignal) => Promise<void>;
  clearError: () => void;
  addRecentSearch: (data: string | { name: string; region?: string; country?: string; lat?: number; lon?: number }) => void;
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
      isSearching: false,
      searchError: null,

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
          get().addRecentSearch({
            name: data.hero.city,
            region: data.location.region,
            country: data.location.country,
            lat: data.location.lat,
            lon: data.location.lon,
          });
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
        name?: string,
        region?: string,
        country?: string,
        abortSignal?: AbortSignal
      ) => {
        set({ isLoading: true, error: null, errorType: null });
        try {
          const data = await weatherService.fetchWeather({ lat, lon, name, region, country }, abortSignal);
          set({
            currentWeather: data,
            currentCity: data.hero.city,
            coordinates: { lat, lon },
            isLoading: false,
          });
          get().addRecentSearch({
            name: data.hero.city,
            region: data.location.region,
            country: data.location.country,
            lat,
            lon,
          });
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
          set({ searchSuggestions: [], isSearching: false, searchError: null });
          return;
        }
        set({ isSearching: true, searchError: null });
        try {
          const suggestions = await weatherService.fetchSuggestions(query, abortSignal);
          
          // Country priority sorting
          const currentCountry = get().currentWeather?.location.country;
          if (currentCountry && suggestions.length > 0) {
            suggestions.sort((a, b) => {
              const aIsLocal = a.country.toLowerCase() === currentCountry.toLowerCase();
              const bIsLocal = b.country.toLowerCase() === currentCountry.toLowerCase();
              if (aIsLocal && !bIsLocal) return -1;
              if (!aIsLocal && bIsLocal) return 1;
              return 0;
            });
          }

          set({ searchSuggestions: suggestions, isSearching: false });
        } catch (err: unknown) {
          const errMessage = err instanceof Error ? err.message : String(err);
          if (errMessage.includes("aborted")) {
            return;
          }
          logger.error(`fetchSuggestions failed for query ${query}`, err);
          set({ isSearching: false, searchError: "Unable to search locations. Please try again." });
        }
      },

      clearError: () => set({ error: null, errorType: null }),

      addRecentSearch: (data: string | { name: string; region?: string; country?: string; lat?: number; lon?: number }) => {
        const isString = typeof data === "string";
        const city = isString ? data : data.name;
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
          region: isString ? undefined : data.region,
          country: isString ? undefined : data.country,
          lat: isString ? undefined : data.lat,
          lon: isString ? undefined : data.lon,
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
