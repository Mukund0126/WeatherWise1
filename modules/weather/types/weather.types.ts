export interface WeatherCondition {
  text: string;
  icon: string;
  code?: number;
}

export interface HourlyForecast {
  time: string;
  icon: string;
  temp: number;
}

export interface ForecastDay {
  day: string;
  icon: string;
  high: number;
  low: number;
  condition: string;
}

export interface WeatherHighlight {
  name: string;
  value: string;
  description: string;
}

export interface WeatherMetric {
  icon: string;
  name: string;
  value: string;
  description: string;
}

export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  localtime: string;
}

export interface CurrentWeather {
  city: string;
  temp: number;
  condition: string;
  feelsLike: number;
  high: number;
  low: number;
  icon: string;
}

export interface WeatherData {
  location: WeatherLocation;
  greeting: {
    userName: string;
    weatherSummary: string;
    dateString: string;
  };
  hero: CurrentWeather;
  recommendation: {
    score: number;
    text: string;
    bullets: string[];
    metrics: {
      outdoorComfort: string;
      travel: string;
      exercise: string;
      photography: string;
    };
  };
  metrics: WeatherMetric[];
  hourlyForecast: HourlyForecast[];
  dailyForecast: ForecastDay[];
  highlights: WeatherHighlight[];
  favorites: Array<{
    name: string;
    temp: number;
    condition: string;
    icon: string;
  }>;
  aiAssistant: {
    placeholder: string;
    defaultAnswer: string;
  };
}

export interface WeatherError {
  statusCode: number;
  type: string;
  message: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

export interface SearchSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}
