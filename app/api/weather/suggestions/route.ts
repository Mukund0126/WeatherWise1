import { NextRequest, NextResponse } from "next/server";
import { weatherValidator } from "@/modules/weather/validators/weather.validator";
import { WeatherApiProvider } from "@/modules/weather/api/weather.engine";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  try {
    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const val = weatherValidator.validateCity(query);
    if (!val.isValid) {
      return NextResponse.json([]);
    }

    const provider = new WeatherApiProvider();
    const raw = await provider.getSuggestions(query);

    const rawList = Array.isArray(raw) ? raw : [];
    const suggestions = rawList.map((item: unknown) => {
      const match = item as {
        id: number;
        name: string;
        region?: string;
        country?: string;
      };
      return {
        id: match.id,
        name: match.name,
        region: match.region || "",
        country: match.country || "",
      };
    });

    return NextResponse.json(suggestions);
  } catch (err: unknown) {
    logger.error("BFF suggestions route failed", err);
    return NextResponse.json([], { status: 500 });
  }
}
