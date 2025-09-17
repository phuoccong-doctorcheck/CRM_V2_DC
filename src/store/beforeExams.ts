/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getListBeforeExams, getTagByObjectID } from "services/api/beforeExams";
import {
  ListBeforeExams,
  PayloadGetBeforeExams,
  LeadResponse,
  TagApiResponse
} from "services/api/beforeExams/types";

interface BeforeExamState {
  beforeExamsList: LeadResponse;
  loadingBefore: boolean;
  listTagCustomer: TagApiResponse;
  loadingListTag: boolean;
}

const initialState: BeforeExamState = {
  beforeExamsList: {
    data: {
      data: [],
      paging: {
        page_number: 1,
        page_size: 0,
        total_count: 0,
        total_page: 0,
        has_previous_page: false,
        has_next_page: false,
      },
    },
    status: false,
    total_items: 0,
    client_ip: "",
    message: "", // 👈 thêm dòng này để đúng kiểu LeadResponse
  },
  loadingBefore: false,
  listTagCustomer: {
    data: [],
    message: "",
    status: false,
    client_ip:""
  },
  loadingListTag: false
};
export const getListToStoreBeforeExams = createAsyncThunk<
  LeadResponse,
  { rejectValue: any }
>(
  "mapsReducer/getListBeforeExamsAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListBeforeExams(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getListTags = createAsyncThunk<
  TagApiResponse, any,
  { rejectValue: any }
>(
  "mapsReducer/getListTagCustomerAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getTagByObjectID(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const BeforeExamSlice = createSlice({
  name: "beforeExamReducer",
  initialState,
  reducers: {
    // setItemDetail($state, action: PayloadAction<RowData>) {
    //   $state.itemDetail = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getListToStoreBeforeExams.pending, ($state, action) => {
        $state.loadingBefore = true;
      })
      .addCase(getListToStoreBeforeExams.fulfilled, ($state, action) => {
        $state.loadingBefore = false;
        $state.beforeExamsList = action.payload;
       
    
      });
      builder
      .addCase(getListTags.pending, ($state, action) => {
        $state.loadingListTag = true;
      })
      .addCase(getListTags.fulfilled, ($state, action) => {
        $state.loadingListTag = false;
        $state.listTagCustomer = action.payload;
       
    
      });
  },
});

export const {} = BeforeExamSlice.actions;

export default BeforeExamSlice.reducer;
