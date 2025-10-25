/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import axiosInstance from "../common/instance";
// API lấy các tỉnh, thành phố
export const getProvinceAPIsNew = async (country: string) => {
  const response = await axiosInstance.get(`/dms/provinces/${country}`);
  return response.data;
};
// API lấy các huyện, quận
export const getDistrictsAPIsNew = async (provinces: string) => {
  const response = await axiosInstance.get(`/dms/wards/${provinces}`);
  return response.data;
};
// API lấy xã, phường
export const getWardsAPIsNew = async (districts: string) => {
  const response = await axiosInstance.get(`/dms/wards/${districts}`);
  return response.data;
};
// API lấy các tỉnh, thành phố
export const getProvinceAPIs = async (country: string) => {
  const response = await axiosInstance.get(`/dms/province_old/${country}`);
  return response.data;
};
// API lấy các huyện, quận
export const getDistrictsAPIs = async (provinces: string) => {
  const response = await axiosInstance.get(`/dms/district_old/${provinces}`);
  return response.data;
};
// API lấy xã, phường
export const getWardsAPIs = async (districts: string) => {
  const response = await axiosInstance.get(`/dms/ward_old/${districts}`);
  return response.data;
};
// API chuyển đổi
export const postConvertAddress = async (ward_id: string) => {
  const response = await axiosInstance.post(`/dms/location-convert`,ward_id);
  return response.data;
};
export const manualCall = async (phone: string) => {
  const body = {
    ServiceName: "CF-PBX0001081",
    AuthUser: "ODS000675",
    AuthKey: "e975f955-abf7-4274-99a7-0b723cabdb9a",
    Ext: "TongDaiTuDong",
    PhoneNumber: `HTC02856789999/${phone}`,
    KeySearch: "",
  };
  const response = await axiosInstance.post(
    "api.cloudfone.vn/api/CloudFone/AutoCallV2",
    body
  );
  return response.data;
};

export const getResourceCRM = async () => {
  // call api lấy all danh sách ở các select box chỗ thêm khách hàng mới: giới tính, đối tác, dân tộc, nghề nghiệp,... và còn có thông tin user đăng nhập, từ đây sẽ gán dữ liệu ở 
  // file home.ts, những dữ liệu ở trang này sẽ được gán vào localstorage
  const response = await axiosInstance.get("/dms/all");
  return response.data;
};
export const getLS = async (data:any) => {
  // call api lấy all danh sách ở các select box chỗ thêm khách hàng mới: giới tính, đối tác, dân tộc, nghề nghiệp,... và còn có thông tin user đăng nhập, từ đây sẽ gán dữ liệu ở 
  // file home.ts, những dữ liệu ở trang này sẽ được gán vào localstorage
  const response = await axiosInstance.post("/dms/get-customer-owners",data);
  return response.data;
};
export const getPackagesItems = async () => {
  // call api lấy all danh sách ở các select box chỗ thêm khách hàng mới: giới tính, đối tác, dân tộc, nghề nghiệp,... và còn có thông tin user đăng nhập, từ đây sẽ gán dữ liệu ở 
  // file home.ts, những dữ liệu ở trang này sẽ được gán vào localstorage
  const response = await axiosInstance.get("/dms/service-packages-with-items");
  return response.data;
};
// API  lấy danh sách những tên khách hàng cũ
export const getCustomerByKey = async (data: string) => {
  const response = await axiosInstance.post("/customer/search", {
    keyword: data,
  });
  return response.data.data;
};
// API  lấy danh sách những nhóm nguồn cũ của 1 khách hàng
export const getListSourceCustomer = async (data: string) => {
  const response = await axiosInstance.post("/customer/get-customer-owners", data);
  return response.data.data;
};
// API lấy thông tin khách hành theo sdt
export const getCustomerWhenCallIn = async (data: string) => {
  const response = await axiosInstance.post("/customer/call-incomming-customer", {
    phonenumber: data,
  });
  return response.data.data;
};
export const getAgentRecentlyHistoried = async (agent: string) => {
  const response = await axiosInstance.post(
    "/customer/get-agent-recently-histories",
    { phone_agent: agent }
  );
  return response.data.data;
};

export const postMergeustomer = async (body: any) => {
  const response = await axiosInstance.post("/customer/merge-customer", body);
  return response.data;
};
// Lấy các gói dịch vụ như:
//+ "Tầm Soát Ung Thư Thực Quản - Dạ Dày - Tá Tràng Dành Cho Nữ"
//+ "Gói Tổng Quát Chuyên Sâu Dành Cho Nam"
// ==> Cái này có ở chỗ khi mà add thêm mới khách hàng trang đặt lịch khi chọn Khám gói dịch vụ sẽ có select box hiện ra, đây là data để hiện chỗ đó
export const getPackagesDetail = async () => {
  const response = await axiosInstance.get("/dms/service-packages-with-items");
  return response.data;
};

export const getIdTypeCustom = async () => {
  const response = await axiosInstance.post("/kpi/get-kpis-by-team", {
    employee_team_id: "CSKH"
  });
  return response.data;
};
