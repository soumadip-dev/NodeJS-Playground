export type ErrorResponse<T = unknown> = {
  message: string; // Human-readable error message
  success: false; // Always false for error responses
  errors?: T;
};
