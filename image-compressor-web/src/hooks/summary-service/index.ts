import { useAxiosQuery } from "..";
import { AzureStorageSummary } from "@/types";

export function useGetSummaries() {
  return useAxiosQuery<AzureStorageSummary>({ url: "summary" });
}
