import axios from "axios";
import { publicRuntimeConfig } from "@/../next.config";

const httpClient = axios.create({
  baseURL: publicRuntimeConfig?.apiURL
});

httpClient.interceptors.response.use(
  (res) => res,
  (res) => res.error
);

export default httpClient;
