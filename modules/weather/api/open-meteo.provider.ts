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
      let location = { name: name || "Unknown Location", region: region || "", country: country || "", lat, lon };

      // 1. Fetch reverse geocoding from WeatherAPI to preserve location metadata ONLY if name is missing
      if (!name) {
        const geocodeUrl = `${this.weatherApiBaseUrl}/search.json?key=${this.weatherApiKey}&q=${lat},${lon}`;
        const geocodeRes = await fetch(geocodeUrl);
        if (!geocodeRes.ok) {
          throw new Error(`Geocoding failed with status ${geocodeRes.status}`);
        }
        const geocodeData = await geocodeRes.json();
        
        if (Array.isArray(geocodeData) && geocodeData.length > 0) {
          location = geocodeData[0];
        }
      }

      // 2. Fetch weather data from Open-Meteo
      // Requesting current, hourly, and daily variables necessary for the dashboard
      const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max` +
        `&timezone=auto` +
        `&forecast_days=${days}`;

      const weatherRes = await fetch(openMeteoUrl);
      if (!weatherRes.ok) {
        throw new Error(`Open-Meteo API failed with status ${weatherRes.status}`);
      }
      const weatherData = await weatherRes.json();

      // Return combined raw data
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
