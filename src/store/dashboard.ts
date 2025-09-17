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
import { clearTimeout } from "timers";
// import { ConnectDB } from 'utils/indexDB';

interface DashBoardState {

  dashboardMaster: DashboardResponse;
  isLoadingDashboard: boolean;
  dashboardMarketingMaster: DashboardMarketingResponse;
  isLoadingDashboardMarketing: boolean;
  AdsAMarketingMaster: AdsAccountResponse;
  isLoadingAdsAMarketing: boolean;
}

const initialState: DashBoardState = {
  
  isLoadingDashboard: false,
  dashboardMaster: {
    data: [] ,
    message: "",
    status: false,
    client_ip: "",
  },
  isLoadingAdsAMarketing: false,
  AdsAMarketingMaster: {
    data: [] ,
    message: "",
    status: false,
    client_ip: "",
  },
  isLoadingDashboardMarketing: false,
  dashboardMarketingMaster: {
    data: {
      targets: [],
      data_reports: [],
      tag_statistics_by_ad: [],
      revenue_from_erp:[]
    },
    message: "",
    status: false,
    client_ip: "",
  },
};


export const postDashBoardMaster = createAsyncThunk<
  DashboardResponse, any,
  { rejectValue: any }
>(
  "mapsReducer/postDashBoardMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postDashboardAPI(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const postDashBoardMarketingMaster = createAsyncThunk<
  DashboardMarketingResponse, any,
  { rejectValue: any }
>(
  "mapsReducer/postDashBoardMarketingMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postDashboardMarketingAPI(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const postAdsAMarketingMasterMarketingMaster = createAsyncThunk<
  AdsAccountResponse,
  void, // <-- Không cần truyền dữ liệu vào
  { rejectValue: any }
>(
  "mapsReducer/postAdsAccountMarketingMasterAction",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postGetCampaignDashboardMarketingAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const dashBoardSlice = createSlice({
  name: "dashboardReducer",
  initialState,
  reducers: {
    // setItemDetail($state, action: PayloadAction<RowData>) {
    //   $state.itemDetail = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(postDashBoardMaster.pending, ($state, action) => {
        $state.isLoadingDashboard = true;
      })
      .addCase(postDashBoardMaster.fulfilled, ($state, action) => {
        $state.dashboardMaster = action.payload;
        $state.isLoadingDashboard = false;
      });
       builder
      .addCase(postDashBoardMarketingMaster.pending, ($state, action) => {
        $state.isLoadingDashboardMarketing = true;
      })
      .addCase(postDashBoardMarketingMaster.fulfilled, ($state, action) => {
        $state.dashboardMarketingMaster = action.payload;
        $state.isLoadingDashboardMarketing = false;
      });
     builder
      .addCase(postAdsAMarketingMasterMarketingMaster.pending, ($state, action) => {
        $state.isLoadingAdsAMarketing = true;
      })
      .addCase(postAdsAMarketingMasterMarketingMaster.fulfilled, ($state, action) => {
        $state.AdsAMarketingMaster = action.payload;
        $state.isLoadingAdsAMarketing = false;
      });
  },
});

export const {} = dashBoardSlice.actions;

export default dashBoardSlice.reducer;
