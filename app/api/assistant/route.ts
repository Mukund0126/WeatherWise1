import { NextRequest, NextResponse } from "next/server";
import { geminiService } from "@/modules/assistant/services/gemini.service";
import { validateAssistantMessage } from "@/modules/assistant/utils/validation";
import { AssistantRequest, AssistantResponse, AssistantError } from "@/modules/assistant/types/assistant.types";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    
    // Validate request body structure
    if (!body || typeof body !== "object" || !("message" in body)) {
      const err: AssistantError = { error: "Invalid request payload.", statusCode: 400 };
      return NextResponse.json(err, { status: 400 });
    }

    const assistantReq = body as AssistantRequest;
    
    // Validate message content
    const validation = validateAssistantMessage(assistantReq.message);
    if (!validation.isValid) {
      const err: AssistantError = { error: validation.error || "Invalid message.", statusCode: 400 };
      return NextResponse.json(err, { status: 400 });
    }

    const safeMessage = validation.sanitizedMessage!;

    // Process message through Gemini Service
    const responseText = await geminiService.getAssistantResponse(safeMessage);

    const response: AssistantResponse = {
      answer: responseText,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    logger.error("API Assistant route error:", error);

    // Sanitize errors sent to the client (Do not expose secrets or stack traces)
    const errMessage = error.message;
    let status = 500;
    let safeError = "An internal server error occurred while processing your request.";

    if (errMessage === "GEMINI_CONFIG_ERROR") {
      safeError = "AI Assistant is currently unavailable. Please try again later.";
    } else if (errMessage === "RATE_LIMIT_EXCEEDED") {
      status = 429;
      safeError = "Too many requests. Please wait a moment before asking another question.";
    } else if (errMessage === "API_ERROR") {
      safeError = "The AI service is temporarily down. Please try again later.";
    } else if (error instanceof SyntaxError) {
      // JSON parse error
      status = 400;
      safeError = "Malformed request syntax.";
    }

    const responseErr: AssistantError = {
      error: safeError,
      statusCode: status,
    };

    return NextResponse.json(responseErr, { status });
  }
}
