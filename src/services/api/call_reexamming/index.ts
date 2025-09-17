/* eslint-disable import/order */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from "moment";

/* eslint-disable import/prefer-default-export */

import axiosInstance from "../common/instance";


export const getListCall_ReExamming  = async (data: any) => {
  const response = await axiosInstance.post("/schedules/list-csschedules",data)
  return response.data;
};


export const postUpdateStatusAPI = async (data: any) => {
  const response = await axiosInstance.post("/schedules/change-status-csschedules",data)
  return response.data;
};


export const postDelayDates = async (data: any) => {
  const response = await axiosInstance.post("/schedules/delay-csschedules",data)
  return response.data;
};

