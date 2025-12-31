/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance, { api1 } from "../common/instance";
export const getDataDBS = async (data: any,) => {
  const m = data.m;
  const y = data.y;
  const b = data.b;
  const response = await api1.get(`/leaddashboard/get-targets?page_id=${b}&month=${m}&year=${y}`);
  return response.data;
};
export const postDataDBS = async (body: any) => {
  const response = await api1.post("/leaddashboard/save-targets", body);
  return response.data;
};

export const getConfigAPI = async () => {
 
  const response = await api1.get(`/leaddashboard/get-pin-code`);
  return response.data;
};
export const postSaveConfig = async (body: any) => {
  const response = await api1.post("/leaddashboard/save-pin-code", body);
  return response.data;
};
export const postSaveVerify = async (body: any) => {
  const response = await api1.post("/leaddashboard/verify", body);
  return response.data;
};
