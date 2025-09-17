/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance from "../common/instance";
// API danh sách đặt lịch theo ngày tháng
export const postSavePriceQuote = async (data: any) => {
  const response = await axiosInstance.post("/cs/get-services-quota", data);
  
  return response.data;
};
// In báo giá
export const postPrintQuote = async (body: any) => {
  const response = await axiosInstance.post("/reports/export-services-quota", body);
  return response.data;
};