/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import axiosInstance from "../common/instance";


export const postDashboardAPI = async (data: any) => {
  const response = await axiosInstance.post(
    "/erp/sale/get-total-dashboard-by-date",
    data
  );
  return response.data;
};
export const postDashboardMarketingAPI = async (data: any) => {
  const response = await axiosInstance.post(
    "/statistic-marketing/reports-evaluation-criteria",
    data
  );
  return response.data;
};
export const postHideShowCrtDashboardMarketingAPI = async (data: any) => {
  const response = await axiosInstance.post(
    "/statistic-marketing/hide-or-show-evaluation-criterias",
    data
  );
  return response.data;
};
export const postAddCampaignDashboardMarketingAPI = async (data: any) => {
  const response = await axiosInstance.post(
    "/statistic-marketing/add-campaign",
    data
  );
  return response.data;
};
export const postGetCampaignDashboardMarketingAPI = async () => {
  const response = await axiosInstance.post(
    "/statistic-marketing/ads-campaigns"
  );
  return response.data;
};
export const postSyncDashboardMarketingAPI = async () => {
  const response = await axiosInstance.post(
    "/sync-data/report-data-marketing"
  );
  return response.data;
};
