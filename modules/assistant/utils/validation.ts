export function validateAssistantMessage(message: unknown): { isValid: boolean; error?: string; sanitizedMessage?: string } {
  if (typeof message !== "string") {
    return { isValid: false, error: "Message must be a string." };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: "Message cannot be empty." };
  }

  if (trimmed.length > 500) {
    return { isValid: false, error: "Message exceeds the maximum allowed length of 500 characters." };
  }

  // Simple sanitization (could be expanded)
  const sanitized = trimmed.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "");

  return { isValid: true, sanitizedMessage: sanitized };
}
