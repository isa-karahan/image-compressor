/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "react-toastify";
import { AxiosRequestHeaders, AxiosResponse } from "axios";

import { Result } from "@/types";
import httpClient from "@/lib/http-client";

type UseAxiosCommandProps = {
  url: string;
  method: "POST" | "PUT" | "DELETE";
  headers?: AxiosRequestHeaders;
};

type UseAxiosCommandFunctionProps = {
  id?: string;
  data?: any;
  params?: Object;
};

export function useAxiosCommand<T>({
  url,
  method,
  headers,
}: UseAxiosCommandProps) {
  return async function ({
    id,
    data,
    params,
  }: UseAxiosCommandFunctionProps): Promise<Result<any>> {
    try {
      const res: AxiosResponse<Result<any>> = await httpClient.request({
        data,
        method,
        params,
        headers,
        url: id ? `${url}/${id}` : url,
      });

      const result = res.data;

      if (result.isSuccess) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (err) {
      const error = err as Error;

      toast.error(error.message);

      return {
        isSuccess: false,
        data: null,
        message: error.message,
      };
    }
  };
}
