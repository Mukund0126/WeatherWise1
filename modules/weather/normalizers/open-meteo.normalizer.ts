import { logger } from "@/lib/logger";
import { NormalizedWeatherData } from "./weather.normalizer";

const getWmoDescription = (code: number): string => {
  const map: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  return map[code] || "Unknown";
};

export const openMeteoNormalizer = {
  normalize(raw: unknown): NormalizedWeatherData {
    if (!raw || typeof raw !== "object") {
      logger.error("Raw Open-Meteo response is invalid", raw);
      throw new Error("Invalid raw Open-Meteo API structure.");
    }

    const rawData = raw as {
      _provider?: string;
      location?: Record<string, unknown>;
      weather?: Record<string, unknown>;
    };

    if (!rawData.weather || !rawData.location) {
      throw new Error("Invalid Open-Meteo raw format. Must include location and weather.");
    }

    const loc = rawData.location as {
      name?: string;
      region?: string;
      country?: string;
      lat?: number;
      lon?: number;
    };

    const weather = rawData.weather as {
      current?: Record<string, unknown>;
      hourly?: Record<string, unknown>;
      daily?: Record<string, unknown>;
    };

    const current = weather.current || {};
    const hourly = weather.hourly || {};
    const daily = weather.daily || {};

    const hourlyTimes: string[] = (hourly.time as string[]) || [];
    const hourlyTemps: number[] = (hourly.temperature_2m as number[]) || [];
    const hourlyCodes: number[] = (hourly.weather_code as number[]) || [];

    const dailyTimes: string[] = (daily.time as string[]) || [];
    const dailyMaxTemps: number[] = (daily.temperature_2m_max as number[]) || [];
    const dailyMinTemps: number[] = (daily.temperature_2m_min as number[]) || [];
    const dailySunrise: string[] = (daily.sunrise as string[]) || [];
    const dailySunset: string[] = (daily.sunset as string[]) || [];
    const dailyUv: number[] = (daily.uv_index_max as number[]) || [];
    const dailyCodes: number[] = (daily.weather_code as number[]) || [];

    const forecastDays = dailyTimes.map((dateStr, i) => {
      // Find hourly data for this specific day
      const dayPrefix = dateStr.substring(0, 10);
      const dayHours = hourlyTimes
        .map((timeStr, idx) => ({ timeStr, idx }))
        .filter(item => item.timeStr.startsWith(dayPrefix))
        .map(item => ({
          time: item.timeStr,
          tempC: hourlyTemps[item.idx] ?? 0,
          conditionText: getWmoDescription(hourlyCodes[item.idx] ?? 0),
          conditionCode: hourlyCodes[item.idx] ?? 0,
        }));

      // Approximate sunrise/sunset formatting (e.g. "2026-08-21T06:30" -> "06:30 AM")
      const formatTime = (timeStr: string) => {
        if (!timeStr) return "";
        const d = new Date(timeStr);
        let h = d.getHours();
        const m = d.getMinutes().toString().padStart(2, "0");
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12;
        if (h === 0) h = 12;
        return `${h}:${m} ${ampm}`;
      };

      const maxTemp = dailyMaxTemps[i] ?? 0;
      const minTemp = dailyMinTemps[i] ?? 0;

      return {
        date: dateStr,
        maxTempC: maxTemp,
        minTempC: minTemp,
        avgTempC: (maxTemp + minTemp) / 2,
        conditionText: getWmoDescription(dailyCodes[i] ?? 0),
        conditionCode: dailyCodes[i] ?? 0,
        uv: dailyUv[i] ?? 0,
        sunrise: formatTime(dailySunrise[i]),
        sunset: formatTime(dailySunset[i]),
        moonPhase: "Unknown", // Open-Meteo doesn't provide moon phase natively in standard API
        moonIllumination: 0,
        hours: dayHours,
      };
    });

    return {
      location: {
        name: loc.name || "Unknown Location",
        region: loc.region || "",
        country: loc.country || "",
        lat: Number(loc.lat) || 0,
        lon: Number(loc.lon) || 0,
        localtime: (current.time as string) || new Date().toISOString(),
      },
      current: {
        tempC: (current.temperature_2m as number) ?? 0,
        feelsLikeC: (current.apparent_temperature as number) ?? 0,
        conditionText: getWmoDescription((current.weather_code as number) ?? 0),
        conditionCode: (current.weather_code as number) ?? 0,
        humidity: (current.relative_humidity_2m as number) ?? 0,
        windKph: (current.wind_speed_10m as number) ?? 0,
        pressureMb: (current.surface_pressure as number) ?? 0,
        visKm: 10, // Not explicitly fetched in simplified url, fallback to 10
        uv: dailyUv[0] ?? 0, // Fallback to day's max UV
        aqiUSIndex: 1, // Open-Meteo requires separate air-quality endpoint, defaulting to 1
        aqiText: "Good",
      },
      forecast: forecastDays,
    };
  }
};
