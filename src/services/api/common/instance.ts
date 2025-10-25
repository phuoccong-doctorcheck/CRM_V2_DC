/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
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


const baseURL =  "https://statistics-api.doctorcheck.online/api";

const apiKey = "h6MiO59QaBCVnxL927s1VsEz5Mq9"

export const api1 = axios.create({
  baseURL,
  timeout: 15_000,
});

// Thêm header X-Key tự động cho mọi request
api1.interceptors.request.use((config) => {
  // Nếu chạy thuần trình duyệt (Vite), key sẽ lấy từ VITE_API_KEY.
  // Nếu Next.js server-side, key lấy từ DC_API_KEY.
  if (apiKey) {
    // eslint-disable-next-line no-param-reassign
    config.headers = {
      ...config.headers,
      "X-Key": apiKey,
    };
  }
  return config;
});

// (Tuỳ chọn) Xử lý lỗi chung
api1.interceptors.response.use(
  (res) => res,
  (err) => {
    // Log/transform theo ý muốn
    return Promise.reject(err);
  }
);
api1.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // ✅ Trả dữ liệu gốc (tuỳ dự án có thể chỉ cần response.data)
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 👉 Nếu token hết hạn hoặc không hợp lệ → quay lại trang đăng nhập
          window.location.href = "/";
          return Promise.reject(
            (error.response.data as { content: any })?.content ?? "Unauthorized"
          );

        case 422:
          // 👉 Lỗi validate dữ liệu (Unprocessable Entity)
          return Promise.reject(
            (error.response.data as { content: any })?.content ?? "Validation error"
          );

        default:
          // 👉 Các lỗi khác: 400, 403, 404, 500...
          return Promise.reject(error);
      }
    }

    // Không có response (mất kết nối, timeout...)
    return Promise.reject(error);
  }
);
export default axiosInstance;
