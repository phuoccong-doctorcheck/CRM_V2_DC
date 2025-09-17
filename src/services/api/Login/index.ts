/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */

/* eslint-disable import/no-cycle */

/* eslint-disable import/prefer-default-export */

import {} from "./types";

import axiosInstance from "../common/instance";

// login với tài khoản và mật khẩu
export const loginWithAccount = async (data: any) => {
  const { userName, passwords } = data;
  const response = await axiosInstance.post("/account/authenticate", {
    username: userName,
    password: passwords,
  });
  return response.data;
};
export const loginWithLink = async (data: any) => {
  const response = await axiosInstance.get(
    `/account/sso?username=${data?.username}&auth=${data?.token}`
  );
  return response.data;
};
export const changePassword = async (passwords: any) => {
  const response = await axiosInstance.post("/account/change-password", {
    new_password: passwords,
  });
  return response.data;
};
