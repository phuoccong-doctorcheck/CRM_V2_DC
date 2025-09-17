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
import { getListCall_ReExamming } from "services/api/call_reexamming";
import { ScheduleCallResponse } from "services/api/call_reexamming/types";
import { clearTimeout } from "timers";
// import { ConnectDB } from 'utils/indexDB';

interface CallReExammingState {

  callReExamming: ScheduleCallResponse;
  isLoadingCallReExamming: boolean;
}

const initialState: CallReExammingState = {
  
  isLoadingCallReExamming: false,
  callReExamming: {
    data: {
      data: [],
      paging: {
        page_number: 0,
        page_size: 0,
        total_count: 0,
        total_page: 0,
        has_previous_page: false,
        has_next_page: false,
      },
    },
    message: "",
    status: false,
    total_items: 0,
    client_ip: "",
  },

};


export const getListCallReExammingMaster = createAsyncThunk<
  ScheduleCallResponse,
  { rejectValue: any }
>(
  "mapsReducer/getListCallReExammingMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListCall_ReExamming(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const CallReExammingSlice = createSlice({
  name: "CallReExammingReducer",
  initialState,
  reducers: {
    // setItemDetail($state, action: PayloadAction<RowData>) {
    //   $state.itemDetail = action.payload;
    // },
  },
  extraReducers(builder) {

  
 
    builder
      .addCase(getListCallReExammingMaster.pending, ($state, action) => {
        $state.isLoadingCallReExamming = true;
      })
      .addCase(getListCallReExammingMaster.fulfilled, ($state, action) => {
        $state.callReExamming = action.payload;
        $state.isLoadingCallReExamming = false;
      });
  },
});

export const {} = CallReExammingSlice.actions;

export default CallReExammingSlice.reducer;
