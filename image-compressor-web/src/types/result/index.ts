export type Result<T> = {
  isSuccess: boolean;
  data: T | null;
  message: string;
};