/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import moment from "moment";

import axiosInstance from "../common/instance";
// API danh sách đặt lịch theo ngày tháng
export const getLoadCalendar = async (data: any) => {
  const {
    dateGetList,
    launchSourceId,
    altStatus,
    keySearch,
    launchSourceGroupId,
    launchSourceTypeId,
  } = data;
  const response = await axiosInstance.post("/visit/load-calendars", {
    date:
      (dateGetList as any) || moment(new Date()).format("YYYY-MM-DDT00:00:00"),
    launch_source_id: launchSourceId || null,
    launch_source_group_id: launchSourceGroupId,
    launch_source_type_id: launchSourceTypeId,
    alt_status: altStatus || null,
    keysearch: keySearch || "",
  });
  return response.data;
};
