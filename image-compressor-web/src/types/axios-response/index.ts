export type UseAxiosResponse<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};