import axiosInstance from "../common/instance";

export const getCustomerForStatistic = async (data: any) => {
  const response = await axiosInstance.post("/visit/get-statistic-masters", data);
  return response.data;
};
// API lấy data số tiền hoa hồng nhận được theo tháng
export const getAppointmentByEmployee = async (data: any) => {
  const response = await axiosInstance.post(
    "/beforexams/get-employee-appointment-by-month",
    data
  );
  return response.data;
};
// API thống kê khảo sát chất lượng dịch vụ của Doctor Check
export const getSurveyStatisticsAPI = async (data: any) => {
  const response = await axiosInstance.post(
    "/statistic/get-survey-statistic",
    data
  );
  return response.data;
};
export const postCreateSummaryPerfReport = async (data: any) => {
  const response = await axiosInstance.post(
    "/statistic/create-summary-perf-report",
    data
  );
  return response.data;
};

export const getCreateSummaryPerfReportByDate = async (date: any) => {
  const response = await axiosInstance.get(
    `/statistic/get-summary-pref-report-by-date?date=${date}`
  );
  return response.data;
};

export const getCreateSummaryPerfReportByDays = async (data: any) => {
  const response = await axiosInstance.post(
    `/statistic/get-summary-pref-report-by-days`,
    data
  );
  return response.data;
};

export const exportFileReport = async (data: any) => {
  const response = await axiosInstance.get(
    `statistic/export-summary-pref-report-by-date?date=${data}`
  );
  return response.data;
};

export const getCreateSummaryPerfReportByWeek = async (data: any) => {
  const response = await axiosInstance.post(
    `/statistic/get-summary-pref-report-by-weeks`,
    data
  );
  return response.data;
};
export const getReportFacebookByDate = async (data: any) => {
  const response = await axiosInstance.get(
    `/statistic/growth-report-by-date?date=${data?.date}&launch_source_group_id=${data?.launch_source_group_id}&launch_source_id=${data?.launch_source_id}`,
    data
  );
  return response.data;
};

export const updateReport = async (data: any) => {
  const response = await axiosInstance.post(
    `/statistic/update-growth-report`,
    data
  );
  return response.data;
};

export const getReportByDate = async (data: any) => {
  const response = await axiosInstance.post(
    `/statistic/get-growth-report-by-date`,
    data
  );
  return response.data;
};

export const getReportByDates = async (data: any) => {
  const response = await axiosInstance.post(
    `/statistic/get-growth-report-by-dates`,
    data
  );
  return response.data;
};

export const getReportByWeek = async (data: any) => {
  const response = await axiosInstance.post(
    `/statistic/get-growth-report-by-weeks`,
    data
  );
  return response.data;
};

export const postTransferCommission = async (data: any) => {
  const response = await axiosInstance.post(
    `/beforexams/change-commission-appointment-employee`,
    data
  );
  return response.data;
};
