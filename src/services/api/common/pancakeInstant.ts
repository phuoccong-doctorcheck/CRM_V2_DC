import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
// API PANCAKE là tổng hợp các tin nhắn bên thứ 3 như zalo, fb,... và đẩy qua bên đây
const axiosPancakeInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_PANCAKE,
});


axiosPancakeInstance.interceptors.request.use(
  ($config: AxiosRequestConfig): AxiosRequestConfig => {
    return $config;
  },
  async (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  },
);

axiosPancakeInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<AxiosError> => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = '/';
          return Promise.reject(
            (error.response.data as { content: any }).content,
          );
        case 422:
          return Promise.reject(
            (error.response.data as { content: any }).content,
          );
        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosPancakeInstance;
