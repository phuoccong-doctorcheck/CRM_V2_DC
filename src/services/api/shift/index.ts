/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */

import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";

import axiosInstance from "../common/instance";


export const postCreateShiftAPI = async (data: any) => {
 
  const response = await axiosInstance.post("/shift/create-shift-type",data);
  return response.data;
};
export const postAssignShiftAPI = async (data: any) => {
 
  const response = await axiosInstance.post("/shift/assign",data);
  return response.data;
};
export const postAddTagsAPI = async (data: any) => {
 
  const response = await axiosInstance.post("/tag/save-tag",data);
  return response.data;
};
export const postAddTaskOfOneCustomer = async (data: any) => {
 
  const response = await axiosInstance.post("/task/save-task",data);
  return response.data;
};
