/* eslint-disable import/order */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from "moment";

/* eslint-disable import/prefer-default-export */

import { ApiAfterExamTaskResponse } from "./types";
import axiosInstance from "../common/instance";


export const getListAfterExams_Task = async (data: any) => {
  const response = await axiosInstance.post("/schedules/list",data)
  return response.data;
};

export const assignt_Task = async (data: any) => {
  const response = await axiosInstance.post("/schedules/assign",data)
  return response.data;
};
export const add_Note = async (data: any) => {
  const response = await axiosInstance.post("/schedules/addnote",data)
  return response.data;
};
export const get_Note = async (data: any) => {
  const response = await axiosInstance.post("/schedules/notes",data)
  return response.data;
};
export const save_schedule_dates = async (data: any) => {
 
  const response = await axiosInstance.post("/schedules/save-schedule-dates",data)
  return response.data;
};
export const delay_dates = async (data: any) => {
  const response = await axiosInstance.post("/schedules/delay",data)
  return response.data;
};
export const changeStatus = async (data: any) => {
  const response = await axiosInstance.post("/schedules/change-status",data)
  return response.data;
};
export const AddTasks = async (data: any) => {
  console.log(data)
  const response = await axiosInstance.post("/schedules/create-schedule-task",data)
  return response.data;
};