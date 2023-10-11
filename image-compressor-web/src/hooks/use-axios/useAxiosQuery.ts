/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import httpClient from "@/lib/http-client";
import { Result, UseAxiosResponse } from "@/types";

type AxiosQueryProps = {
  url: string;
  params?: object;
};

export function useAxiosQuery<T>({
  url,
  params,
}: AxiosQueryProps): UseAxiosResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<Result<T>> = await httpClient.get(url, {
        params,
      });
      setData(response.data.data);

      const { isSuccess, message } = response.data;

      if (message) {
        if (isSuccess) toast.success(message);
        else toast.error(message);
      }
    } catch (err) {
      const error = err as Error;

      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, params]);

  return { data, loading, error, refetch: fetchData };
}
