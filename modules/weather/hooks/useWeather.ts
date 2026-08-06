import { useEffect, useRef } from "react";
import { useWeatherStore } from "../store/weather.store";
import { logger } from "@/lib/logger";

export function useWeather() {
  const {
    fetchWeather,
    fetchWeatherByCoordinates,
    currentCity,
    currentWeather,
    isLoading,
    error,
    clearError,
  } = useWeatherStore();

  // Guard to prevent double execution in StrictMode
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (typeof window !== "undefined" && navigator.geolocation) {
      logger.info("Requesting browser Geolocation permissions...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          logger.info(
            `Browser Geolocation granted. Fetching weather for coordinates: ${latitude}, ${longitude}`
          );
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (geoError) => {
          logger.warn(
            `Browser Geolocation denied/failed (${geoError.code}): ${geoError.message}. Falling back to "${currentCity}"`
          );
          fetchWeather(currentCity || "Ahmedabad");
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
      );
    } else {
      logger.warn(
        "Geolocation API is unsupported on this browser. Falling back to default."
      );
      fetchWeather(currentCity || "Ahmedabad");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    currentWeather,
    isLoading,
    error,
    clearError,
    fetchWeather,
  };
}

export default useWeather;
