import { logger } from "@/lib/logger";

export interface NormalizedWeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    tempC: number;
    feelsLikeC: number;
    conditionText: string;
    conditionCode: number;
    humidity: number;
    windKph: number;
    pressureMb: number;
    visKm: number;
    uv: number;
    aqiUSIndex: number;
    aqiText: string;
  };
  forecast: Array<{
    date: string;
    maxTempC: number;
    minTempC: number;
    avgTempC: number;
    conditionText: string;
    conditionCode: number;
    uv: number;
    sunrise: string;
    sunset: string;
    moonPhase: string;
    moonIllumination: number;
    hours: Array<{
      time: string;
      tempC: number;
      conditionText: string;
      conditionCode: number;
    }>;
  }>;
}

export const weatherNormalizer = {
  normalize(raw: unknown): NormalizedWeatherData {
    if (!raw || typeof raw !== "object") {
      logger.error("Raw weather response is empty or invalid", raw);
      throw new Error("Invalid raw weather API structure.");
    }

    const rawData = raw as {
      location?: Record<string, unknown>;
      current?: Record<string, unknown>;
      forecast?: { forecastday?: unknown[] };
    };

    if (!rawData.location || !rawData.current) {
      logger.error("Raw weather response location/current metadata is missing", rawData);
      throw new Error("Invalid raw weather API structure.");
    }

    const currentData = rawData.current as {
      temp_c?: number;
      feelslike_c?: number;
      condition?: { text?: string; code?: number };
      humidity?: number;
      wind_kph?: number;
      pressure_mb?: number;
      vis_km?: number;
      uv?: number;
      air_quality?: Record<string, unknown>;
    };

    const locationData = rawData.location as {
      name?: string;
      region?: string;
      country?: string;
      lat?: number;
      lon?: number;
      localtime?: string;
    };

    const airQualityObj = currentData.air_quality || {};
    const aqiIndex = Number(airQualityObj["us-epa-index"]) || 1;
    const aqiTexts: Record<number, string> = {
      1: "Good",
      2: "Moderate",
      3: "Unhealthy for Sensitive Groups",
      4: "Unhealthy",
      5: "Very Unhealthy",
      6: "Hazardous",
    };

    const forecastDays = Array.isArray(rawData.forecast?.forecastday)
      ? rawData.forecast.forecastday.map((dayObj: unknown) => {
          const d = dayObj as {
            date?: string;
            day?: {
              maxtemp_c?: number;
              mintemp_c?: number;
              avgtemp_c?: number;
              condition?: { text?: string; code?: number };
              uv?: number;
            };
            astro?: {
              sunrise?: string;
              sunset?: string;
              moon_phase?: string;
              moon_illumination?: string | number;
            };
            hour?: unknown[];
          };

          const dayData = d.day || {};
          const astroData = d.astro || {};
          const hourDataList = d.hour || [];

          return {
            date: d.date || "",
            maxTempC: dayData.maxtemp_c ?? 0,
            minTempC: dayData.mintemp_c ?? 0,
            avgTempC: dayData.avgtemp_c ?? 0,
            conditionText: dayData.condition?.text || "",
            conditionCode: dayData.condition?.code || 0,
            uv: dayData.uv ?? 0,
            sunrise: astroData.sunrise || "06:00 AM",
            sunset: astroData.sunset || "06:00 PM",
            moonPhase: astroData.moon_phase || "New Moon",
            moonIllumination: Number(astroData.moon_illumination) || 0,
            hours: hourDataList.map((h: unknown) => {
              const hourObj = h as {
                time?: string;
                temp_c?: number;
                condition?: { text?: string; code?: number };
              };
              return {
                time: hourObj.time || "",
                tempC: hourObj.temp_c ?? 0,
                conditionText: hourObj.condition?.text || "",
                conditionCode: hourObj.condition?.code || 0,
              };
            }),
          };
        })
      : [];

    return {
      location: {
        name: locationData.name || "",
        region: locationData.region || "",
        country: locationData.country || "",
        lat: Number(locationData.lat) || 0,
        lon: Number(locationData.lon) || 0,
        localtime: locationData.localtime || "",
      },
      current: {
        tempC: currentData.temp_c ?? 0,
        feelsLikeC: currentData.feelslike_c ?? 0,
        conditionText: currentData.condition?.text || "",
        conditionCode: currentData.condition?.code || 0,
        humidity: currentData.humidity ?? 0,
        windKph: currentData.wind_kph ?? 0,
        pressureMb: currentData.pressure_mb ?? 0,
        visKm: currentData.vis_km ?? 0,
        uv: currentData.uv ?? 0,
        aqiUSIndex: aqiIndex,
        aqiText: aqiTexts[aqiIndex] || "Good",
      },
      forecast: forecastDays,
    };
  },
};

export default weatherNormalizer;
