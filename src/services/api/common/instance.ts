/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL_DEMO,
});

axiosInstance.interceptors.request.use(
  ($config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = Cookies.get("token");
    if ($config.headers) {
      $config.headers.Authorization = token ? token?.slice(2).toString() : "";
    }
    return $config;
  },
  async (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<AxiosError> => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = "/";
          return Promise.reject(
            (error.response.data as { content: any }).content
          );
        case 422:
          return Promise.reject(
            (error.response.data as { content: any }).content
          );
        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
