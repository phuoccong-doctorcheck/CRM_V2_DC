import axiosCloudfoneInstance from "services/api/common/cloudfoneInstance";

export const GetCallHistory = async (body: any) => {
  const data = {
    ...body,
    HideFWOut: 1,
    ServiceName: "VTP0004049",
    AuthUser: "MBO012694",
    AuthKey: "ec6b67d0-5ad7-4e75-800a-bf9314313cfa",
  };
  const response = await axiosCloudfoneInstance.post(`GetCallHistory`, data);
  return response.data;
};
