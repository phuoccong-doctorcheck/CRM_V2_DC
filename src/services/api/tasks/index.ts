/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */

import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";

import axiosInstance from "../common/instance";


export const getListTaskOfOneCustomer = async (data: any) => {
 
  const response = await axiosInstance.post("/task/list",data);
  return response.data;
};
export const getListTaskOfOneEmployee = async (data: any) => {
 
  const response = await axiosInstance.post("/task/owner-tasks",data);
  return response.data;
};
export const postNoteTask = async (data: any) => {
 
  const response = await axiosInstance.post("/task/save-note-task",data);
  return response.data;
};
export const postDelayTask = async (data: any) => {
 
  const response = await axiosInstance.post("/task/delay-task",data);
  return response.data;
};
export const postAssignTaskAPI = async (data: any) => {
 
  const response = await axiosInstance.post("/task/assign-task",data);
  return response.data;
};
export const postChangeStatusTaskAPI = async (data: any) => {
 
  const response = await axiosInstance.post("/task/change-status-task",data);
  return response.data;
};
export const postAddTaskOfOneCustomer = async (data: any) => {
 
  const response = await axiosInstance.post("/task/save-task",data);
  return response.data;
};
export const getListTaskOfOneEmployeeSummary = async (data: any) => {
 
  const response = await axiosInstance.post("/task/summary",data);
  return response.data;
};


export const getFollowLeadsGrouped = async (data: any) => {
 
  const response = await axiosInstance.post("/lead/get-follow-leads-grouped",data);
  return response.data;
};