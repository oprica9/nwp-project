export interface ApiErrorResponse {
  timestamp: string;  // You could also use Date type if you're processing this timestamp.
  errorMessage: string;
  errorCode: string;
}
