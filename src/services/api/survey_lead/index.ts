/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance from "../common/instance";
// API get answer from survey
export const getAnswerSurvey = async (data: any) => {
  const response = await axiosInstance.post("/survey/get-surveys-lead", data);
  
  return response.data;
};
// Lưu câu trả lời
export const postSaveAnswerAPI = async (body: any) => {
  const response = await axiosInstance.post("/survey/save-survey", body);
  return response.data;
};