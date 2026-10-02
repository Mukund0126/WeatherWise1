export interface WeatherContextPayload {
  city: string;
  temp?: number;
  feelsLike?: number;
  condition?: string;
  humidity?: string | number;
  windSpeed?: string | number;
  uvIndex?: string | number;
  high?: number;
  low?: number;
  recommendationScore?: number;
  forecastSummary?: string;
}

export interface AssistantRequest {
  message: string;
  weatherContext?: WeatherContextPayload;
}

export interface AssistantResponse {
  answer: string;
}

export interface AssistantError {
  error: string;
  statusCode: number;
}

