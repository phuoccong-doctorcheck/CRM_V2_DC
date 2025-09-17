import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const axiosCloudfoneInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_CLOUDFONE,
});

axiosCloudfoneInstance.interceptors.request.use(
  ($config: AxiosRequestConfig): AxiosRequestConfig => {
    return $config;
  },
  async (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

axiosCloudfoneInstance.interceptors.response.use(
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

export default axiosCloudfoneInstance;
