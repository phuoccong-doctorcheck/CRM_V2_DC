/* eslint-disable import/order */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from "moment";

/* eslint-disable import/prefer-default-export */

import axiosInstance from "../common/instance";

export const getCustomerWom = async (data:any) => {
  const response = await axiosInstance.post("/statistic/get-customer-referrals",data);
  return response.data;
};

export const getCustomerWomById = async (data:any) => {
  const response = await axiosInstance.post("/statistic/get-customers-by-referrer",data);
  return response.data;
};
