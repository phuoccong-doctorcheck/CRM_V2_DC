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
import { loadCustomerStatisticAPI } from "services/api/customer_staticstic";
import { CustomerStatisticResponse } from "services/api/customer_staticstic/types";
import { clearTimeout } from "timers";
// import { ConnectDB } from 'utils/indexDB';

interface LoadCustomerStatisticState {

  loadCustomerStatistic: CustomerStatisticResponse;
  isLoadCustomerStatistic: boolean;
}

const initialState: LoadCustomerStatisticState = {
  
  isLoadCustomerStatistic: false,
  loadCustomerStatistic: {
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


export const getLoadCustomerStatisticStateMaster = createAsyncThunk<
  CustomerStatisticResponse,
  { rejectValue: any }
>(
  "mapsReducer/getLoadCustomerStatisticStateMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await loadCustomerStatisticAPI(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const LoadCustomerStatisticSlice = createSlice({
  name: "LoadCustomerStatisticReducer",
  initialState,
  reducers: {
    // setItemDetail($state, action: PayloadAction<RowData>) {
    //   $state.itemDetail = action.payload;
    // },
  },
  extraReducers(builder) {

  
 
    builder
      .addCase(getLoadCustomerStatisticStateMaster.pending, ($state, action) => {
        $state.isLoadCustomerStatistic = true;
      })
      .addCase(getLoadCustomerStatisticStateMaster.fulfilled, ($state, action) => {
        $state.loadCustomerStatistic = action.payload;
        $state.isLoadCustomerStatistic = false;
      });
  },
});

export const {} = LoadCustomerStatisticSlice.actions;

export default LoadCustomerStatisticSlice.reducer;
