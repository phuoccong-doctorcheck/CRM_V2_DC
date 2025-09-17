import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const callInstance = axios.create({
  baseURL: "https://restcall.doctorcheck.online/api/",
});

callInstance.interceptors.request.use(
  ($config: AxiosRequestConfig): AxiosRequestConfig => {
    if ($config.headers) {
      $config.headers["App-Id"] = "89304572146127564150679";
      $config.headers["App-Key"] = "BC2Sd4gr339w3vOc9s4psAQXk5U5==";
      $config.headers.Accept = "*/*";
      $config.headers["Access-Control-Allow-Origin"] = "*";
    }
    return $config;
  },
  async (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

callInstance.interceptors.response.use(
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

export default callInstance;
