/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance from "../common/instance";

export const getListCustomers = async (body: any) => {
  const response = await axiosInstance.post(
    "/customer/get-list-customers",
    body
  );
  return response.data;
};
