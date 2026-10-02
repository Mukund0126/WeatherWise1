import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "@/lib/logger";
import { WeatherContextPayload } from "../types/assistant.types";

const SYSTEM_PROMPT = `You are the WeatherWise AI Weather Assistant.
Your purpose is to provide practical, weather-related guidance based on user questions and real-time weather data.

Follow these strict rules:
1. Never invent or hallucinate weather information or forecasts.
2. Rely primarily on the provided live weather context when giving advice about outdoor activities, clothing, or forecasts.
3. Clearly indicate when real-time weather information is unavailable or incomplete.
4. Keep your answers concise (2-4 sentences max), clear, friendly, and directly addressing the user's prompt.
5. Avoid claiming absolute certainty when weather information is inherently subject to change.
6. Do NOT provide medical, legal, or financial advice under any circumstances.
7. Do not pretend to be a human. Be a helpful AI assistant.
`;

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.warn("GEMINI_API_KEY is not defined in environment variables.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "");
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 250,
      }
    });
  }

  async getAssistantResponse(
    message: string,
    weatherContext?: WeatherContextPayload
  ): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_CONFIG_ERROR");
    }

    try {
      let fullPrompt = message;

      if (weatherContext && weatherContext.city) {
        const details = [
          `Location: ${weatherContext.city}`,
          weatherContext.temp !== undefined ? `Current Temp: ${weatherContext.temp}°C` : null,
          weatherContext.feelsLike !== undefined ? `Feels Like: ${weatherContext.feelsLike}°C` : null,
          weatherContext.condition ? `Condition: ${weatherContext.condition}` : null,
          weatherContext.high !== undefined && weatherContext.low !== undefined ? `High/Low Today: ${weatherContext.high}°C / ${weatherContext.low}°C` : null,
          weatherContext.humidity !== undefined ? `Humidity: ${weatherContext.humidity}%` : null,
          weatherContext.windSpeed !== undefined ? `Wind: ${weatherContext.windSpeed} km/h` : null,
          weatherContext.uvIndex !== undefined ? `UV Index: ${weatherContext.uvIndex}` : null,
          weatherContext.recommendationScore !== undefined ? `Outdoor Score: ${weatherContext.recommendationScore}/10` : null,
          weatherContext.forecastSummary ? `Forecast Summary: ${weatherContext.forecastSummary}` : null,
        ].filter(Boolean).join("\n- ");

        fullPrompt = `[Live Weather Data Context]\n- ${details}\n\n[User Question]\n${message}`;
      }

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error: any) {
      logger.error("Gemini API call failed", error);
      
      // Handle rate limits or specific API errors
      if (error?.status === 429) {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      
      throw new Error("API_ERROR");
    }
  }
}

export const geminiService = new GeminiService();

