import axiosInstance from "../common/instance";

// Lấy danh sách điểm cộng của khách hàng
export const getListPointsOfCustomer = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-customer-history-point",
    data
  );
  return response.data;
};
// Lấy danh sách điểm sử dụng của khách hàng
export const getMinusListPointsOfCustomer = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-loyalty-history-mius",
    data
  );
  return response.data;
};
// Lấy danh sách điểm của khách hàng
export const getListCustomerPoints = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-customer-points",
    data
  );
  return response.data;
};

// Lấy tất cả dịch vụ của 1 KH đã làm trong quá khứ
export const getCustomerPastServices = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-customer-past-services",
    data
  );
  return response.data;
};

// Thống kê tất cả dịch vụ của 1 KH đã làm trong quá khứ nhóm theo số lần sử dụng
export const getCustomerServicesByUsage = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-customer-services-by-usage",
    data
  );
  return response.data;
};

// Lấy lịch sử đổi quà của 1 KH đã làm trong quá khứ
export const getCustomerGiftExchanges = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-customer-gift-exchanges",
    data
  );
  return response.data;
};

// Campaigns
/* Lấy danh sách SMS Templates */
export const getSMSTemplates = async () => {
  const response = await axiosInstance.get("/campaign/get-sms-templates");
  return response.data;
};

/*Lấy danh sách chiến dịch */
export const getCampaigns = async () => {
  const response = await axiosInstance.get("/campaign/get-campaigns");
  return response.data;
};

/* Tạo hoặc Update 1 chiến dịch */
export const postMakeOrUpdateCampaigns = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/create-or-update-campaign",
    data
  );
  return response.data;
};

// Lấy danh sách khách hàng đã gửi cho 1 chiến dịch đã gửi (log chiến dịch)
export const getCampaignLogs = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-campaign-logs",
    data
  );
  return response.data;
};

// Lấy danh sách khách hàng đã gửi cho 1 chiến dịch đã gửi (log chiến dịch)
export const postSendCampaign = async (data: any) => {
  const response = await axiosInstance.post("/campaign/send", data);
  return response.data;
};
// Thêm note nhắc nhở tầm soát
export const postSendNoteRemind = async (data: any) => {
  const response = await axiosInstance.post("/campaign/save-suggestion_note", data);
  return response.data;
};

// Lấy danh sách khách hàng đã gửi cho 1 chiến dịch đã gửi (log chiến dịch)
export const getCustomerLeads = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-customer-leads",
    data
  );
  return response.data;
};
// Lấy danh sách khách hàng nhắc nhở tầm soát
export const getCustomerRemind = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-customer-suggestions",
    data
  );
  return response.data;
};
// Lấy danh sách note của 1 khách hàng nhắc nhở tầm soát
export const getNoteCustomerRemind = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-suggestion_notes",
    data
  );
  return response.data;
};
// Duyệt hoa hồng cho CSKH
export const approveEmployeeCommission = async (data: any) => {
  const response = await axiosInstance.post(
    "/beforexams/approve-employee-commission",
    data
  );
  return response.data;
};
//API Get danh sách KH thuôc F1 hoặc F2 hoặc F3
export const getCustomerFType = async (data: any) => {
  const response = await axiosInstance.post(
    "/campaign/get-customer-f-type",
    data
  );
  return response.data;
};
