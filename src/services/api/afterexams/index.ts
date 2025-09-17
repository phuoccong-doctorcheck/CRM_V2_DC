/* eslint-disable import/order */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from "moment";

/* eslint-disable import/prefer-default-export */

import { RequestListAfterExams } from "./types";
import axiosInstance from "../common/instance";

// lấy data để đổ vào select box trang sau khi khám : Đã khám xong, tầm soát, chưa liên lạc được,...
export const initAfterExams = async () => {
  const response = await axiosInstance.get("/afterexams/init");
  return response.data;
};

export const getUserGuidsDetail = async (id: string) => {
  const response = await axiosInstance.get(`/userguid/detail/${id}`);
  return response.data;
};
export const getListUserGuids = async (body: any) => {
  const response = await axiosInstance.post(`/userguid/list`, body);
  return response.data;
};
export const getInfoDetailGuid = async (body: any) => {
  const response = await axiosInstance.get(`/userguid/detail/${body}`);
  return response.data;
};
export const postChangeStep = async (body: any) => {
  const response = await axiosInstance.post(`/lead/update-step`,body);
  return response.data;
};
export const getDataGPT = async (body: any) => {
  const response = await axiosInstance.post(`/userguid/get-from-chatgpt`,body);
  return response.data;
};
export const postUserGuids = async (body: any) => {
  const response = await axiosInstance.post(`/userguid/save-userguid`, body);
  return response.data;
};
export const postNoteLog= async (body: any) => {
  const response = await axiosInstance.post(`/touchpointlog/add-touchpointlog-lead`,body);
  return response.data;
};
export const postNoteLogC= async (body: any) => {
  const response = await axiosInstance.post(`/touchpointlog/add-touchpointlog-customer`,body);
  return response.data;
};
export const getListAfterExams = async (data: RequestListAfterExams) => {
  const {
    processKeyId,
    launchSourceID,
    fromDay,
    toDay,
    keyWord,
    pages,
    limits,
    dateFilterType,
    launchSourceGroupID,
    launchSourceTypeID,
    isDefault,
    statusRes,
  } = data;

  const response = await axiosInstance.post("/afterexams/list", {
    process_key_id: processKeyId,
    launch_source_ids: launchSourceID || "all",
    launch_source_group_id: launchSourceGroupID || 0,
    launch_source_type_id: launchSourceTypeID || 0,
    date_filter_type: dateFilterType || 0,
    fromdate: isDefault
      ? moment(fromDay).format("YYYY-MM-DDT00:00:00")
      : fromDay || moment(new Date()).format("YYYY-MM-DDT00:00:00"),
    todate: toDay || moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
    keyword: keyWord,
    status: statusRes,
    page: pages || 1,
    limit: limits || 20,
  })
  return response.data;
};

export const SaveQuickNoteAfterExams = async (data: any) => {
  const { customerId, content } = data;
  const response = await axiosInstance.post("/afterexams/save-quick-note", {
    customer_id: customerId,
    note: content,
    user_note: {
      employee_id: "NV29",
      fullname: "Lê Thị Kim Giang",
      employee_signature_name: "CS. Lê Thị Kim Giang",
    },
  });
  return response.data;
};

export const postStagesByIdAfterExams = async (data: any) => {
  const { customerId, stageId, employeeId } = data;
  const response = await axiosInstance.post("/afterexams/change-stage-id", {
    customer_id: customerId,
    stage_id: stageId,
    employee_id: employeeId,
  });
  return response.data;
};

export const getDetailDocumentItem = async (id: string) => {
  const response = await axiosInstance.get(`/userguid/detail/${id}`);
  return response.data;
};

export const getStatisticAfterExams = async (data: any) => {
  const response = await axiosInstance.post(
    `/statistic/statistic-stages-by-date`,
    data
  );
  return response.data;
};
