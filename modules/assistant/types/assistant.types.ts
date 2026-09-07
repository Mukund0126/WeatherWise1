export interface AssistantRequest {
  message: string;
}

export interface AssistantResponse {
  answer: string;
}

export interface AssistantError {
  error: string;
  statusCode: number;
}
