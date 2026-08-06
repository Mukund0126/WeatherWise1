import { NextRequest, NextResponse } from "next/server";
import { weatherValidator } from "@/modules/weather/validators/weather.validator";
import { WeatherApiProvider } from "@/modules/weather/api/weather.engine";
import { weatherNormalizer } from "@/modules/weather/normalizers/weather.normalizer";
import { weatherMapper } from "@/modules/weather/mappers/weather.mapper";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    let query = "";

    if (lat || lon) {
      const val = weatherValidator.validateCoords(lat, lon);
      if (!val.isValid) {
        return NextResponse.json(
          { statusCode: 400, type: "VALIDATION_ERROR", message: val.error },
          { status: 400 }
        );
      }
      query = `${lat},${lon}`;
    } else if (city) {
      const val = weatherValidator.validateCity(city);
      if (!val.isValid) {
        return NextResponse.json(
          { statusCode: 400, type: "VALIDATION_ERROR", message: val.error },
          { status: 400 }
        );
      }
      query = city;
    } else {
      return NextResponse.json(
        {
          statusCode: 400,
          type: "VALIDATION_ERROR",
          message:
            "Query parameters 'city' or 'lat'/'lon' coordinates must be specified.",
        },
        { status: 400 }
      );
    }

    const provider = new WeatherApiProvider();
    const raw = await provider.getForecast(query, 7);

    const normalized = weatherNormalizer.normalize(raw);
    const mapped = weatherMapper.map(normalized);

    return NextResponse.json(mapped);
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    logger.error("BFF Weather Route failed", err);

    let statusCode = 500;
    let type = "API_FAILURE";
    let message = errMessage;

    const lowerMessage = errMessage.toLowerCase();
    if (lowerMessage.includes("no matching location")) {
      statusCode = 404;
      type = "CITY_NOT_FOUND";
      message =
        "The requested city could not be found. Please check the spelling and try again.";
    } else if (
      lowerMessage.includes("api key") ||
      lowerMessage.includes("unauthorized") ||
      lowerMessage.includes("403") ||
      lowerMessage.includes("401") ||
      lowerMessage.includes("forbidden")
    ) {
      statusCode = 401;
      type = "AUTH_ERROR";
      message =
        "Weather API authentication failed. Please configure a valid WEATHER_API_KEY in .env.local.";
    }

    return NextResponse.json(
      { statusCode, type, message },
      { status: statusCode }
    );
  }
}
