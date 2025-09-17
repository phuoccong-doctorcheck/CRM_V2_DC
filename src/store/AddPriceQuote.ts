/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { toast } from "react-toastify";
import { QuoteData, QuoteResponse } from "services/api/add_price_quote/types";
import { postSavePriceQuote, postSavePriceQuote1 } from "services/api/beforeExams";
import { getLoadCalendar } from "services/api/booking_schedule";
import { handleConvertDataBooking } from "utils/functions";

interface AddPriceQuoteState {
  AddPriceQuote: QuoteResponse;
  dataAddPriceQuote: QuoteData[];
  statisticAddPriceQuote: QuoteData[];
  loadingAddPriceQuote: boolean;
}

const initialState: AddPriceQuoteState = {
  AddPriceQuote: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  dataAddPriceQuote: [],
  statisticAddPriceQuote: [],
  loadingAddPriceQuote: false,
};
// Redux lấy lịch booking theo ngày tháng
export const getAddPriceQuote = createAsyncThunk<
  QuoteResponse,
  { rejectValue: any }
>(
  "mapsReducer/getAddPriceQuoteAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postSavePriceQuote(data);
      return response;
    } catch (error) {
      return rejectWithValue("Lỗi khi gửi yêu cầu báo giá");
    }
  }
);
export const getAddPriceQuote1 = createAsyncThunk<
  QuoteResponse,
  { rejectValue: any }
>(
  "mapsReducer/getAddPriceQuote1Action",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postSavePriceQuote1(data);
      return response;
    } catch (error) {
      return rejectWithValue("Lỗi khi gửi yêu cầu báo giá");
    }
  }
);
export const addPriceQuoteSlice = createSlice({
  name: "AddPriceQuoteReducer",
  initialState,
  reducers: {
   
  },
  extraReducers(builder) {
      builder
          .addCase(getAddPriceQuote.pending, ($state) => {
            $state.loadingAddPriceQuote = true;
          })
          .addCase(getAddPriceQuote.fulfilled, ($state, action) => {
            $state.loadingAddPriceQuote = false;
            $state.AddPriceQuote = action.payload;
            if (!action.payload.status) {
              toast.error(action.payload.message);
            }
          });
      builder
          .addCase(getAddPriceQuote1.pending, ($state) => {
            $state.loadingAddPriceQuote = true;
          })
          .addCase(getAddPriceQuote1.fulfilled, ($state, action) => {
            $state.loadingAddPriceQuote = false;
            $state.AddPriceQuote = action.payload;
            if (!action.payload.status) {
              toast.error(action.payload.message);
            }
          });
  },
});

export const {} = addPriceQuoteSlice.actions;

export default addPriceQuoteSlice.reducer;
