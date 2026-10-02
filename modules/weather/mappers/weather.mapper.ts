import { NormalizedWeatherData } from "../normalizers/weather.normalizer";
import { WeatherData } from "../types/weather.types";
import { weatherIcons } from "../utils/weather.icons";

const formatDate = (localtimeStr: string) => {
  try {
    if (!localtimeStr) return new Date().toDateString();
    const date = new Date(localtimeStr.replace(/-/g, "/"));
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return new Date().toDateString();
  }
};

export const weatherMapper = {
  map(normalized: NormalizedWeatherData, userName = "Mukund"): WeatherData {
    const cur = normalized.current;
    const loc = normalized.location;
    const todayForecast = normalized.forecast[0] || {
      maxTempC: cur.tempC + 2,
      minTempC: cur.tempC - 4,
      sunrise: "06:00 AM",
      sunset: "07:00 PM",
      moonPhase: "Waxing Gibbous",
      moonIllumination: 50,
      hours: [],
    };

    // Calculate score
    let score = 10.0;
    const condLower = cur.conditionText.toLowerCase();
    if (condLower.includes("rain") || condLower.includes("drizzle") || condLower.includes("shower") || condLower.includes("thunder")) {
      score -= 3.0;
    } else if (condLower.includes("cloud") || condLower.includes("overcast")) {
      score -= 1.0;
    }
    if (cur.tempC > 33) {
      score -= Math.min(2.0, (cur.tempC - 33) * 0.3);
    } else if (cur.tempC < 15) {
      score -= Math.min(2.0, (15 - cur.tempC) * 0.3);
    }
    if (cur.uv > 7) {
      score -= 1.0;
    }
    if (cur.humidity > 80) {
      score -= 1.0;
    }
    score = Math.round(Math.max(1, Math.min(10, score)) * 10) / 10;

    // Recommendation logic
    let recommendationText = "Perfect weather for outdoor activities.";
    if (score < 5.0) {
      recommendationText = "Fewer outdoor activities recommended due to adverse conditions.";
    } else if (score < 7.5) {
      recommendationText = "Fairly good conditions. Suitable for general outings.";
    }

    const bullets: string[] = [];
    if (cur.uv >= 4) {
      bullets.push("Carry sunglasses and apply sun protection.");
    } else {
      bullets.push("UV index is low; sun protection not urgent.");
    }
    if (condLower.includes("rain") || condLower.includes("drizzle") || condLower.includes("shower")) {
      bullets.push("Carry an umbrella or raincoat.");
    } else {
      bullets.push("No rain expected; no umbrella required.");
    }
    if (cur.tempC > 30) {
      bullets.push("Stay hydrated; wear light clothing.");
    } else if (cur.tempC < 15) {
      bullets.push("Wear warm clothing layers.");
    } else {
      bullets.push("Temperatures are highly comfortable.");
    }

    const outdoorComfort = score >= 8.5 ? "Excellent" : score >= 6.5 ? "Good" : "Fair";
    const travel = cur.windKph > 35 ? "Caution advised" : "Safe";
    const exercise = cur.tempC > 35 || cur.tempC < 5 ? "Not recommended" : "Recommended";
    const photography = condLower.includes("clear") || condLower.includes("sunny") || condLower.includes("partly") ? "Excellent" : "Fair";

    // Map metrics
    const metrics = [
      {
        icon: "droplets",
        name: "Humidity",
        value: `${cur.humidity}%`,
        description: cur.humidity < 40 ? "Dry ambient air" : cur.humidity > 70 ? "Sticky/humid air" : "Comfortable moisture",
      },
      {
        icon: "wind",
        name: "Wind Speed",
        value: `${cur.windKph} km/h`,
        description: cur.windKph < 15 ? "Gentle breeze" : cur.windKph > 30 ? "Strong gusty wind" : "Moderate breeze",
      },
      {
        icon: "gauge",
        name: "Atmospheric Pressure",
        value: `${cur.pressureMb} hPa`,
        description: cur.pressureMb < 1010 ? "Low pressure system" : "Standard sea-level range",
      },
      {
        icon: "eye",
        name: "Visibility Range",
        value: `${cur.visKm} km`,
        description: cur.visKm > 9 ? "Clear visible horizons" : "Reduced visibility range",
      },
      {
        icon: "sun",
        name: "UV Index",
        value: String(cur.uv),
        description: cur.uv < 3 ? "Low sun exposure hazard" : cur.uv > 6 ? "High sun exposure hazard" : "Moderate hazard",
      },
      {
        icon: "activity",
        name: "Air Quality Index",
        value: `${cur.aqiUSIndex} (${cur.aqiText})`,
        description: cur.aqiUSIndex < 3 ? "Clean/healthy air quality" : "Safe for general groups",
      },
    ];

    // Filter Hourly (next 8 hours)
    let currentHour = new Date().getHours();
    try {
      if (loc.localtime) {
        const parts = loc.localtime.split(" ");
        if (parts[1]) {
          currentHour = parseInt(parts[1].split(":")[0], 10);
        }
      }
    } catch {
      // Fallback
    }

    const hourlyForecast = [];
    const todayHours = todayForecast.hours || [];
    const tomorrowForecast = normalized.forecast[1];
    const tomorrowHours = tomorrowForecast ? tomorrowForecast.hours || [] : [];
    const combinedHours = [...todayHours, ...tomorrowHours];

    for (let i = 0; i < 8; i++) {
      const targetIdx = currentHour + i * 2; // Spaced every 2 hours
      const hObj = combinedHours[targetIdx];
      if (hObj) {
        const idx = targetIdx % 24;
        let timeLabel = `${idx}:00`;
        if (idx === 0) timeLabel = "12 AM";
        else if (idx === 12) timeLabel = "12 PM";
        else if (idx > 12) timeLabel = `${idx - 12} PM`;
        else timeLabel = `${idx} AM`;

        hourlyForecast.push({
          time: timeLabel,
          icon: weatherIcons.getIconByCode(hObj.conditionCode, hObj.conditionText),
          temp: Math.round(hObj.tempC),
        });
      }
    }

    // Map Daily (Upcoming Forecast)
    const dailyForecast = normalized.forecast.map((day) => {
      let dayName = "Today";
      try {
        const dateObj = new Date(day.date.replace(/-/g, "/"));
        const today = new Date();
        if (
          dateObj.getDate() === today.getDate() &&
          dateObj.getMonth() === today.getMonth() &&
          dateObj.getFullYear() === today.getFullYear()
        ) {
          dayName = "Today";
        } else {
          dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        }
      } catch {
        // Fallback
      }

      return {
        day: dayName,
        icon: weatherIcons.getIconByCode(day.conditionCode, day.conditionText),
        high: Math.round(day.maxTempC),
        low: Math.round(day.minTempC),
        condition: day.conditionText,
      };
    });

    // Map Highlights
    const highlights = [
      {
        name: "Sunrise",
        value: todayForecast.sunrise,
        description: "First light of morning",
      },
      {
        name: "Sunset",
        value: todayForecast.sunset,
        description: "Evening golden hour",
      },
      {
        name: "Moon Phase",
        value: todayForecast.moonPhase,
        description: `Illumination at ${todayForecast.moonIllumination}%`,
      },
      {
        name: "Atmospheric Pressure",
        value: `${cur.pressureMb} hPa`,
        description: "Barometric sea-level standard",
      },
      {
        name: "Visibility Range",
        value: `${cur.visKm} km`,
        description: "Clear line-of-sight range",
      },
      {
        name: "UV Gauge",
        value: `${cur.uv} Index`,
        description: cur.uv < 3 ? "Low UV hazard" : "Moderate-to-high UV hazard",
      },
      {
        name: "Air Quality Index",
        value: `${cur.aqiUSIndex} (EPA)`,
        description: cur.aqiText,
      },
      {
        name: "Thermal Sensation",
        value: `${Math.round(cur.feelsLikeC)}°`,
        description: `Actual reading is ${Math.round(cur.tempC)}°`,
      },
    ];

    // Favorites Placeholder (we'll fetch or display static fallback city cards)
    const favorites = [
      {
        id: "fav-london",
        name: "London",
        temp: 18,
        condition: "Partly Cloudy",
        icon: "cloud-sun",
      },
      {
        id: "fav-ny",
        name: "New York",
        temp: 24,
        condition: "Sunny",
        icon: "sun",
      },
      {
        id: "fav-mumbai",
        name: "Mumbai",
        temp: 30,
        condition: "Light Rain",
        icon: "cloud-rain",
      },
    ];

    return {
      location: {
        name: loc.name,
        region: loc.region,
        country: loc.country,
        lat: loc.lat,
        lon: loc.lon,
        localtime: loc.localtime,
      },
      greeting: {
        userName,
        weatherSummary: `The weather in ${loc.name} is ${Math.round(cur.tempC)}°C and ${cur.conditionText}. ${recommendationText}`,
        dateString: formatDate(loc.localtime),
      },
      hero: {
        city: loc.name,
        temp: Math.round(cur.tempC),
        condition: cur.conditionText,
        feelsLike: Math.round(cur.feelsLikeC),
        high: Math.round(todayForecast.maxTempC),
        low: Math.round(todayForecast.minTempC),
        icon: weatherIcons.getIconByCode(cur.conditionCode, cur.conditionText),
      },
      recommendation: {
        score,
        text: recommendationText,
        bullets,
        metrics: {
          outdoorComfort,
          travel,
          exercise,
          photography,
        },
      },
      metrics,
      hourlyForecast,
      dailyForecast,
      highlights,
      favorites,
      aiAssistant: {
        placeholder: "Can I play cricket tomorrow?",
        defaultAnswer: "Ask me details about exercise comfort, travel safety, or general weather trends!",
      },
    };
  },
};

export default weatherMapper;
