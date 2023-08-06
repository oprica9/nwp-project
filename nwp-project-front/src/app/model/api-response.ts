export interface ApiResponse<T> {
  timestamp: string;
  status: string;
  data: T;
}
