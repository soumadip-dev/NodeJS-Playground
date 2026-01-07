export type ErrorResponse = {
  message: string; // Human-readable error message
  success: false; // Always false for error responses
  errors?: Record<string, string> | string[]; // Optional detailed error information
};
