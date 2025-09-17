/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import axiosInstance from "../common/instance";

export const loadKPIDays_C1 = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/employee/1",
    data
  );
  return response.data;
};
export const loadKPIDays_C2 = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/employee/2",
    data
  );
  return response.data;
};
export const loadKPIDays_C3 = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/employee/3",
    data
  );
  return response.data;
};
export const loadKPIDays = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/get-statistic-employee",
    data
  );
  return response.data;
};


export const loadKPIDays1 = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/get-statistic-employee-cskh",
    data
  );
  return response.data;
};
