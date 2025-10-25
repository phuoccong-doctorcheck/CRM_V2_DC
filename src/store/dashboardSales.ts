/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable array-callback-return */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { DropdownData } from "components/atoms/Dropdown";
import { toast } from "react-toastify";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */

import {
  getListAfterExams,
  getListUserGuids,
  getStatisticAfterExams,
  getUserGuidsDetail,
  initAfterExams,
} from "services/api/afterexams";
import {
  ListAfterExams,
  RequestListAfterExams,
  RespInitAfterExams,
  StatisticAfterExams,
  UserGuidListResp,
  UserguidsAfterExamsItemType,
  detailUserGuid,
} from "services/api/afterexams/types";
import { getListAfterExams_Task } from "services/api/afterexams_task";
import { ApiAfterExamTaskResponse } from "services/api/afterexams_task/types";
import { postDashboardAPI, postDashboardMarketingAPI, postGetCampaignDashboardMarketingAPI } from "services/api/dashboardnew";
import { AdsAccountResponse, DashboardMarketingResponse, DashboardResponse } from "services/api/dashboardnew/types";
import { getDataDBS } from "services/api/dashboardSales";
import { TargetResponseDB } from "services/api/dashboardSales/types";
import { clearTimeout } from "timers";
// import { ConnectDB } from 'utils/indexDB';

interface DashBoardSaleState {

  dashboardSalesMaster: TargetResponseDB;
  isLoadingDashboardSales: boolean;

}

const initialState: DashBoardSaleState = {
  
  isLoadingDashboardSales: false,
  dashboardSalesMaster: {
    data: [] ,
    message: "",
    status: false,
    client_ip: "",
  },

};


export const postDashBoardSalesMaster = createAsyncThunk<
  TargetResponseDB, any,
  { rejectValue: any }
>(
  "mapsReducer/postDashBoardSalesMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getDataDBS(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const dashBoardSalesSlice = createSlice({
  name: "dashboardSalesReducer",
  initialState,
  reducers: {
    // setItemDetail($state, action: PayloadAction<RowData>) {
    //   $state.itemDetail = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(postDashBoardSalesMaster.pending, ($state, action) => {
        $state.isLoadingDashboardSales = true;
      })
      .addCase(postDashBoardSalesMaster.fulfilled, ($state, action) => {
        $state.dashboardSalesMaster = action.payload;
        $state.isLoadingDashboardSales = false;
      });

  },
});

export const {} = dashBoardSalesSlice.actions;

export default dashBoardSalesSlice.reducer;
