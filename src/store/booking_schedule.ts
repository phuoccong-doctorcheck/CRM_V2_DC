/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { toast } from "react-toastify";
import { getLoadCalendar } from "services/api/booking_schedule";
import {
  BookingScheduleItem,
  ResponseBooking,
} from "services/api/booking_schedule/types";
import { handleConvertDataBooking } from "utils/functions";

interface BookingScheduleState {
  listBooking: ResponseBooking;
  dataBooking: BookingScheduleItem[];
  statisticBooking: BookingScheduleItem[];
  loadingBooking: boolean;
}

const initialState: BookingScheduleState = {
  listBooking: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  dataBooking: [],
  statisticBooking: [],
  loadingBooking: false,
};
// Redux lấy lịch booking theo ngày tháng
export const getListBooking = createAsyncThunk<
  ResponseBooking,
  { rejectValue: any }
>(
  "mapsReducer/getCategoriesCustomerAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getLoadCalendar(data);
      
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const bookingScheduleSlice = createSlice({
  name: "bookingScheduleReducer",
  initialState,
  reducers: {
    postLoadingBooking($state, action: PayloadAction<boolean>) {
      $state.loadingBooking = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getListBooking.pending, ($state, action) => {
        $state.loadingBooking = true;
      })
      .addCase(getListBooking.fulfilled, ($state, action) => {
        const newData = {
          ...action.payload,
          data: handleConvertDataBooking(action.payload.data),
        };

        const newList = action?.payload?.data?.filter((i) => i?.customer_id);
        const listDataStatistic = action?.payload?.data?.filter(
          (i) => i?.customer_id !== null
        );
        $state.loadingBooking = false;
        $state.listBooking = newData;
        $state.dataBooking = newList as any;
        $state.statisticBooking = listDataStatistic as any;

        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
  },
});

export const { postLoadingBooking } = bookingScheduleSlice.actions;

export default bookingScheduleSlice.reducer;
