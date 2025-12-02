/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance from "../common/instance";
export const loadFormZNSAPI = async (data: any) => {
  const response = await axiosInstance.post("/schedules/load-csschedules-znsform", data);
  
  return response.data;
};
export const sendZNSAPI = async (body: any) => {
  const response = await axiosInstance.post("/schedules/send-csschedules-znsform", body);
  return response.data;
};