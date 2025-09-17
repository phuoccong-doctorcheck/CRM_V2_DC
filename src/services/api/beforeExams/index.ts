/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */

import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";

import axiosInstance from "../common/instance";

import { LaunchSourceTypes, LaunchSourceGroups } from "./../dashboard/types";
import { PayloadGetBeforeExams } from "./types";

/* Hành trình trước khám: beforexams */

export const getListBeforeExams = async (data: any) => {
 
  const response = await axiosInstance.post("/lead/get-list-leads",data);
  return response.data;
};
export const getInfoOfLeadFromPC = async (data: any) => {
 
  const response = await axiosInstance.post("/lead/get-data-lead-from-pancake-and-save",data);
  return response.data;
};
export const getInfoDetailCustomer = async (data: any) => {
 
  const response = await axiosInstance.post("/lead/detail",data);
  return response.data;
};
export const postAssignAPI = async (data: any) => {
 
  const response = await axiosInstance.post("/lead/assign-employee",data);
  return response.data;
};
export const getListBeforeExamsFromPC = async (data: any) => {
 
  const response = await axiosInstance.post("/lead/get-data-leads-and-save",data);
  return response.data;
};
// API tương tác lần cuối
export const postInteractAPI = async (data: any) => {
 
  const response = await axiosInstance.post("/lead/update-last-time-interact",data);
  return response.data;
};
// API 
export const postReallocateAPI = async (data: any) => {
 
  const response = await axiosInstance.post("/lead/reallocate-leads",data);
  return response.data;
};
// API lưu thông tin khách hàng đặt lịch
export const postSaveCustomerBeforeExams = async (data: any) => {
  const response = await axiosInstance.post("/lead/create-lead", data);
  
  return response.data;
};
export const postUpdateCustomer = async (data: any) => {
  const response = await axiosInstance.post("/customer/save", data);
  
  return response.data;
};
export const postAddNewCustomer = async (data: any) => {
  const response = await axiosInstance.post("/visit/save-customer", data);
  
  return response.data;
};
export const postBookCustomerAPI = async (data: any) => {
  const response = await axiosInstance.post("/visit/appointment", data);
  
  return response.data;
};
export const postUpdateCustomerBeforeExams = async (data: any) => {
  const response = await axiosInstance.post("/lead/update-info-lead", data);
  
  return response.data;
};
export const postConvertCustomerBeforeExams = async (data: any) => {
  const response = await axiosInstance.post("/lead/convert-lead-to-customer", data);
  
  return response.data;
};
export const postSavePriceQuote = async (data: any) => {
  const response = await axiosInstance.post("/saleorder/save-services-quota-customer", data);
  
  return response.data;
};
export const postSavePriceQuote1 = async (data: any) => {
  const response = await axiosInstance.post("/customer/get-services-quota", data);
  
  return response.data;
};
export const postSavePriceQuoteL = async (data: any) => {
  const response = await axiosInstance.post("/saleorder/save-services-quota-lead", data);
  
  return response.data;
};
export const postRemovePriceQuote = async (data: any) => {
  const response = await axiosInstance.post("/saleorder/remove-sale-order", data);
  
  return response.data;
};
export const postDetailSalesOrder = async (data: any) => {
  const response = await axiosInstance.post("/saleorder/detail", data);
  
  return response.data;
};
// API lưu thông tin khách hàng đặt lịch
export const postNotifyCustomer = async (data: any) => {
  const response = await axiosInstance.post("/kpi/send-alarm-scheduled-success", data);
  
  return response.data;
};
// API lấy khách hàng theo ID
export const getCustomerById = async (data: any) => {
  const body = {
  
    customer_id: data?.customer_id,
  };
  const response = await axiosInstance.post(`/customer/detail`,body);
  return response.data;
};
export const postAssignedToID = async (id: string) => {
  const employeeId = Cookies.get("employee_id");
  const body = {
    lead_id: id,
    follow_staff_id: employeeId || Cookies.get("employee_id"),
  };
  const response = await axiosInstance.post("/cs/save-lead-assigned", body);
  return response.data;
};
export const postNoteByCID = async (data: any) => {
  const response = await axiosInstance.post("/schedules/save-cs-note-customer-schedules", data);
  return response.data;
};
export const postNoteByID = async (data: any) => {
  const response = await axiosInstance.post("/notes/save-cs-note", data);
  return response.data;
};

export const getNoteByCustomerID = async (data: any) => {
  const response = await axiosInstance.post("/notes/filter-cs-notes", data);
  return response.data;
};
export const getNoteLog = async (data: any) => {
  const response = await axiosInstance.post("/touchpointlog/list", data);
  return response.data;
};
export const getNoteByModule = async (data: any) => {
  const { id, type } = data;
  const body = {
    customer_id: id || "",
    cs_node_type: type || "cs",
  };
  const response = await axiosInstance.post("/notes/filter-cs-notes", body);
  return response.data;
};

export const getTagByObjectID = async (data: any) => {

  const response = await axiosInstance.post("/tag/get-object-tags", data);
  return response.data;
};

export const postObjectTag = async (body: any) => {
  const response = await axiosInstance.post("/tag/add-object-tags", body);
  return response.data;
};

export const postRemoveObjectTag = async (data: any) => {
  const body = {
    object_id: "",
    object_type: "cs",
    tag_id: "",
  };
  const response = await axiosInstance.post("/tag/remove-object-tag", body);
  return response.data;
};

export const postChangeProcessId = async (body: any) => {
  const response = await axiosInstance.post(
    "/cs/change-process-id-before",
    body
  );
  return response.data;
};
export const getNoteCR = async (data: any) => {
  const response = await axiosInstance.post("/schedules/filter-cs-notes-customer-schedules", data);
  return response.data;
};