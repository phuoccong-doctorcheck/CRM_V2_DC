/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import axiosInstance from "../common/instance";

export const loadKPIAgency = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/get-result-kpis-company",
    data
  );
  return response.data;
};
export const loadKPIEmployeeMonth = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/get-statistic-employee-by-month",
    data
  );
  return response.data;
};
export const loadKPIEmployee = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/get-result-kpis-employee",
    data
  );
  return response.data;
};
  export const loadKPIEmployeeChart = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/get-result-kpis-of-list-employee-team-cskh",
    data
  );
  return response.data;
};
  export const loadKPIEmployeeChartV2 = async (data: any) => {
  const response = await axiosInstance.post(
    "/kpi/get-result-kpis-of-list-employee-team-cskh-v2",
    data
  );
  return response.data;
};
export const postAddKPI = async (data: any) => {
  const response = await axiosInstance.post("/kpi/add-target-kpi-of-employee-team-cskh", data);
  return response.data;
};
export const postSetStatusKPI = async (data: any) => {
  const response = await axiosInstance.post("/kpi/update-status-kpi-of-employee", data);
  return response.data;
};
export const postUpdateKPI = async (data: any) => {
  const response = await axiosInstance.post("/kpi/update-target-kpi-of-employee-team-cskh", data);
  return response.data;
};
// export const postChangeMasterCare = async (data: string) => {
//   const response = await axiosInstance.post(`/cs/change-master-care-status`, {
//     master_id: data,
//   });
//   return response.data;
// };
// // API in chỉ định phục vụ (In Bill)
// export const postPrintAppointmentServicepoint = async (data: string) => {
//   const response = await axiosInstance.post(
//     `/reports/print-appointment-servicepoint`,
//     { master_id: data }
//   );
//   return response.data;
// };

// export const getStatisticAppointmentView = async (data: any) => {
//   const body = {
//     fromdate: data?.fromDate || null,
//     todate: data?.toDate || null,
//   };
//   const response = await axiosInstance.post(
//     `/statistic/statistic-master-by-date`,
//     body
//   );
//   return response.data;
// };
