import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "@/lib/logger";

const SYSTEM_PROMPT = `You are the WeatherWise AI Weather Assistant.
Your purpose is to provide practical, weather-related guidance based on user questions.

Follow these strict rules:
1. Never invent or hallucinate weather information or forecasts.
2. If weather context is provided to you, use it. (Note: Weather context will be added in a future update; currently you only have general knowledge).
3. Clearly indicate when real-time or specific weather information is unavailable to you.
4. Keep your answers concise, useful, and directly addressing the user's prompt.
5. Avoid claiming absolute certainty when weather information is inherently uncertain.
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

  async getAssistantResponse(message: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_CONFIG_ERROR");
    }

    try {
      const result = await this.model.generateContent(message);
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
