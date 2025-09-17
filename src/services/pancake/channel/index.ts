/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from "moment";

import axiosPancakeInstance from "../../api/common/pancakeInstant";
const tokenEmployeePancake = localStorage.getItem("pancakeToken");

export const getListPagePancake = async () => {
  const response = await axiosPancakeInstance.get(
    `/v1/pages?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI5YzU2ZGVlNC00MmY2LTQzMGUtODhhYi1kNDAyMWE2ZjUyNWQiLCJzZXNzaW9uX2lkIjoid2lPMTVTUlZYa042YkQ3YnVZQ1B1WHg4TFVXNmRLeG5udFl4QkorSEJYOCIsIm5hbWUiOiLDgWkgVHJhbmcgTmd1eeG7hW4iLCJsb2dpbl9zZXNzaW9uIjpudWxsLCJpYXQiOjE3MDg1Njk3NTYsImZiX25hbWUiOiLDgWkgVHJhbmcgTmd1eeG7hW4iLCJmYl9pZCI6IjEwMjYxMTUyNDQxNzM1MTYiLCJleHAiOjE3MTYzNDU3NTYsImFwcGxpY2F0aW9uIjoxfQ.S3M-EBqmSMYDbrPmm-21eO1MXzmaHemHVJasvEUtKrg`
  );
  return response.data;
};

export const getConversationsByPageId = async (data: any) => {
  const response = await axiosPancakeInstance.get(
    `public_api/v1/pages/${data?.pageId}/conversations?page_access_token=${
      data.pageToken
    }&order_by=updated_at&since=${
      Date.parse(
        moment(new Date()).subtract(1, "day").format("YYYY-MM-DDT00:00:00")
      ) / 1000
    }&until=${
      Date.parse(moment(new Date()).format("YYYY-MM-DDT23:59:59")) / 1000
    }&page_id=${data?.pageId}&page_number=1${
      data?.tag ? `&tags=${data?.tag}` : ""
    }`
  );
  return response.data;
};

export const getListTagsByPageId = async (data: any) => {
  const response = await axiosPancakeInstance.get(
    `public_api/v1/pages/${data?.pageId}/tags?page_id=${data?.pageId}&page_access_token=${data?.pageToken}`
  );
  return response.data;
};

export const getMessageByCustomer = async (data: any) => {
  const response = await axiosPancakeInstance.get(
    `public_api/v1/pages/${data?.pageId}/conversations/${data?.conversationId}/messages?page_access_token=${data?.pageToken}&customer_id=${data?.customerId}&conversation_id=${data?.conversationId}&page_id=${data?.pageId}`
  );
  return response.data;
};

export const postTagByConversationId = async (data: any) => {
  const response = await axiosPancakeInstance.post(
    `public_api/v1/pages/${data?.pageId}/conversations/${data?.conversationId}/tags?conversation_id=${data?.conversationId}&page_id=${data?.pageId}&page_access_token=${data?.pageToken}`,
    { ...data?.body }
  );
  return response.data;
};

export const postMessageByConversationId = async (data: any) => {
  const response = await axiosPancakeInstance.post(
    `public_api/v1/pages/${data?.pageId}/conversations/${
      data?.conversationId
    }/messages?access_token=${
      tokenEmployeePancake
        ? tokenEmployeePancake
        : localStorage.getItem("pancakeToken")
    }`,
    data?.body,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const getPageStatisticsPancake = async (data: any) => {
  const response = await axiosPancakeInstance.get(
    `/public_api/v1/pages/${data.page_id}/statistics/pages?page_id=${data.page_id}&page_access_token=${data.page_access_token}&since=${data.since}&until=${data.until}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const getTagStatisticsPancake = async (data: any) => {
  const response = await axiosPancakeInstance.get(
    `/public_api/v1/pages/${data.page_id}/statistics/tags?page_id=${data.page_id}&page_access_token=${data.page_access_token}&since=${data.since}&until=${data.until}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const getUsersStatatisticsMultiplePagesPancake = async (data: any) => {
  const response = await axiosPancakeInstance.get(
    `/v1/statistics/user?access_token=${data.access_token}&page_ids=${data.since}&date_range=${data.date_range}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const getNewCustomerStatisticsPancake = async (data: any) => {
  const response = await axiosPancakeInstance.get(
    `/public_api/v1/pages/${data.page_id}/statistics/customers?page_access_token=${data.page_access_token}&date_range=${data.date_range}&page_id=${data.page_id}&group_by=${data.group_by}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const getUsersStatisticsPancake = async (data: any) => {
  const response = await axiosPancakeInstance.get(
    `/public_api/v1/pages/${data?.page_id}/statistics/users?page_access_token=${data.page_access_token}&date_range=${data.date_range}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};
