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

export const postChangeMasterCare = async (data: string) => {
  const response = await axiosInstance.post(`/visit/change-master-follower`, {
    master_id: data,
  });
  return response.data;
};
// API in chỉ định phục vụ (In Bill)
export const postPrintAppointmentServicepoint = async (data: string) => {
  const response = await axiosInstance.post(
    `/reports/print-appointment-servicepoint`,
    { master_id: data }
  );
  console.log(response.data)
  return response.data;
};

export const getStatisticAppointmentView = async (data: any) => {
  const body = {
    fromdate: data?.fromDate || null,
    todate: data?.toDate || null,
  };
  const response = await axiosInstance.post(
    `/statistic/statistic-master-by-date`,
    body
  );
  return response.data;
};
