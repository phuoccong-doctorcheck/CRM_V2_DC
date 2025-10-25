/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance, { api1 } from "../common/instance";
// API danh sách đặt lịch theo ngày tháng
export const getDataDBS = async (data: any,) => {
  const m = data.m;
  const y = data.y;
  const b = data.b;
  const response = await api1.get(`/dashboardtaget/get-targets?page_id=${b}&month=${m}&year=${y}`);
  return response.data;
};
// In báo giá
export const postDataDBS = async (body: any) => {
  const response = await api1.post("/dashboardtaget/save-targets", body);
  return response.data;
};