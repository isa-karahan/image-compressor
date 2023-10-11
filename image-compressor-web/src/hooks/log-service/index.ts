import { useAxiosQuery } from "..";

export function useGetImageLogs() {
  return useAxiosQuery<Array<string>>({ url: "logs/images" });
}
