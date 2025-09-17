/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import axiosInstance from "../common/instance";

export const loadAppointmentMasters = async (data: any) => {
  const body = {
    date: data?.date,
    launch_source_id: data?.launchSourceId || 0,
    launch_source_group_id: data?.launchSourceGroupID || 0,
    keyword: data?.keyWord || "",
    page: data?.pages || 1,
    limit: data?.limits || 500,
  };
  const response = await axiosInstance.post(
    "/visit/load-appointment-masters",
    body
  );
  return response.data;
};

export const getDetailVisit = async (data: any) => {
  const response = await axiosInstance.post(`/visit/detail`, data);
  return response.data;
};
