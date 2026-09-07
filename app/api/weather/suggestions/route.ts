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

    // Use Photon (OpenStreetMap) for comprehensive global place coverage
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`;
    const res = await fetch(photonUrl);
    
    if (!res.ok) {
      throw new Error(`Photon API returned ${res.status}`);
    }
    
    const data = await res.json();
    const rawList = data.features || [];
    const suggestions = rawList.map((feature: Record<string, unknown>, index: number) => {
      const props = (feature.properties as Record<string, string | number>) || {};
      const coords = ((feature.geometry as Record<string, unknown>)?.coordinates as number[]) || [0, 0];
      
      // Photon provides various administrative levels. We'll construct a region string.
      const regionParts = [];
      if (props.city && props.city !== props.name) regionParts.push(props.city);
      else if (props.county && props.county !== props.name) regionParts.push(props.county);
      if (props.state && props.state !== props.name) regionParts.push(props.state);
      
      return {
        id: props.osm_id ? `${props.osm_id}-${index}` : index,
        name: props.name || "Unknown",
        region: regionParts.join(", "),
        country: props.country || "",
        lat: coords[1], // GeoJSON is [lon, lat]
        lon: coords[0],
        url: "", // Not used with Open-Meteo coords based fetching
      };
    });

    return NextResponse.json(suggestions);
  } catch (err: unknown) {
    logger.error("BFF suggestions route failed", err);
    return NextResponse.json([], { status: 500 });
  }
}
