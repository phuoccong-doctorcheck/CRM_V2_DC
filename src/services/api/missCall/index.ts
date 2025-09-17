import callInstance from "../common/callInstance";

export const listCallByDate = async (date: any) => {
  // `date=dd-MM-yyyy`
  const response = await callInstance.get(`call/get-allcalls?date=${date}`);
  return response.data;
};
// API lấy danh sách cuộc gọi đã trả lời theo ngày
export const listCallAnsweredByDate = async (date: any) => {
  // `date=dd-MM-yyyy`
  const response = await callInstance.get(`call/get-answercalls?date=${date}`);
   
  return response.data;
};
// API lấy danh sách cuộc gọi bị nhỡ theo ngày
export const listCallMissedByDate = async (date: any) => {

  // `date=dd-MM-yyyy`
  const response = await callInstance.get(`call/get-missedcalls?date=${date}`);
  
  return response.data;
};
// API xử lý cuộc gọi bị nhỡ ( kiểu như gọi lại hoặc hủy)
export const postResolveMissedCall = async (body: any) => {
  const response = await callInstance.post(`call/resolve-missedcall`, body);
  
  return response.data;
};
