import { logger } from "@/lib/logger";
import { IWeatherProvider } from "./weather.engine";

export class OpenMeteoProvider implements IWeatherProvider {
  private weatherApiBaseUrl = "https://api.weatherapi.com/v1";
  private weatherApiKey: string;

  constructor() {
    this.weatherApiKey = process.env.WEATHER_API_KEY || "";
    if (!this.weatherApiKey) {
      logger.warn(
        "WEATHER_API_KEY is not defined. Reverse geocoding will fail."
      );
    }
  }

  async getForecastByCity(city: string, days?: number): Promise<unknown> {
    throw new Error("OpenMeteoProvider does not support city name lookups directly.");
  }

  async getSuggestions(query: string): Promise<unknown> {
    throw new Error("OpenMeteoProvider does not support suggestions.");
  }

  async getForecastByCoords(lat: number, lon: number, name?: string, region?: string, country?: string, days = 7): Promise<unknown> {
    try {
      let location = { name: name || "", region: region || "", country: country || "", lat, lon };

      // 1. Try reverse geocoding from WeatherAPI if name is not provided
      if (!location.name && this.weatherApiKey) {
        try {
          const geocodeUrl = `${this.weatherApiBaseUrl}/search.json?key=${this.weatherApiKey}&q=${lat},${lon}`;
          const geocodeRes = await fetch(geocodeUrl);
          if (geocodeRes.ok) {
            const geocodeData = await geocodeRes.json();
            if (Array.isArray(geocodeData) && geocodeData.length > 0) {
              location = {
                name: geocodeData[0].name || "",
                region: geocodeData[0].region || "",
                country: geocodeData[0].country || "",
                lat,
                lon,
              };
            }
          }
        } catch (e) {
          logger.warn(`WeatherAPI reverse geocoding failed for ${lat},${lon}`, e);
        }
      }

      // 2. Fall back to Open-Meteo free reverse geocoding API if name is still missing
      if (!location.name) {
        try {
          const freeGeoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`;
          const freeGeoRes = await fetch(freeGeoUrl);
          if (freeGeoRes.ok) {
            const freeGeoData = await freeGeoRes.json();
            if (freeGeoData?.results?.[0]) {
              const place = freeGeoData.results[0];
              location = {
                name: place.name || place.admin1 || "Current Location",
                region: place.admin1 || "",
                country: place.country || "",
                lat,
                lon,
              };
            }
          }
        } catch (e) {
          logger.warn(`Open-Meteo reverse geocoding failed for ${lat},${lon}`, e);
        }
      }

      // 3. Final default location fallback
      if (!location.name) {
        location = {
          name: `Coordinates (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
          region: "Local Region",
          country: "",
          lat,
          lon,
        };
      }

      // Fetch weather data from Open-Meteo
      const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max` +
        `&timezone=auto` +
        `&forecast_days=${days}`;

      const weatherRes = await fetch(openMeteoUrl);
      if (!weatherRes.ok) {
        throw new Error(`Open-Meteo API returned status ${weatherRes.status}`);
      }
      const weatherData = await weatherRes.json();

      return {
        _provider: "open-meteo",
        location,
        weather: weatherData
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`OpenMeteoProvider error fetching forecast for coords "${lat},${lon}"`, err);
      throw new Error(message);
    }
  }
}
