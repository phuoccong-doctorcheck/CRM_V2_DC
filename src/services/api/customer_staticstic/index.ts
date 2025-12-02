/* eslint-disable import/order */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from "moment";

/* eslint-disable import/prefer-default-export */

import axiosInstance from "../common/instance";


export const loadCustomerStatisticAPI = async (data: any) => {
  const response = await axiosInstance.post("/visit/load-visit-mtypes",data)
  return response.data;
};

export const updateTypeStatisticAPI = async (data: any) => {
  const response = await axiosInstance.post("/visit/update-visit-mtype",data)
  return response.data;
};

