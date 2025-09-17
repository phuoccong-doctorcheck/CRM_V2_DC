/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getStatisticAppointmentView,
  loadAppointmentMasters,
} from "services/api/appointmentView";
import {
  AppointmentViewResp,
  StatisticAppointment,
  StatisticAppointmentCustomize,
} from "services/api/appointmentView/types";
import { getCustomerWom, getCustomerWomById } from "services/api/customer_wom";
import { ResponCustomerWom, ResponCustomerWomById } from "services/api/customer_wom/types";

interface  CustomerWOMViewState {
  listCustomerWOMMaster: ResponCustomerWom;
  isLoadingResponCustomerWom: boolean;
  listCustomerWOMByIdMaster: ResponCustomerWomById;
  isLoadingResponCustomerWomById: boolean;
}

const initialState: CustomerWOMViewState = {
  isLoadingResponCustomerWom: false,
  listCustomerWOMMaster: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  isLoadingResponCustomerWomById: false,
  listCustomerWOMByIdMaster: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
};

export const getListCustomerWOMMaster = createAsyncThunk<
  ResponCustomerWom,
  { rejectValue: any }
>(
  "mapsReducer/listCustomerWOMMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCustomerWom(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getListCustomerWOMByIdMaster = createAsyncThunk<
  ResponCustomerWomById,
  { rejectValue: any }
>(
  "mapsReducer/listCustomerWOMMByIdasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCustomerWomById(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const CustomerWOMViewSlice = createSlice({
  name: "customerWOMViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getListCustomerWOMMaster.pending, ($state) => {
        $state.isLoadingResponCustomerWom = true;
      })
      .addCase(getListCustomerWOMMaster.fulfilled, ($state, action) => {
        $state.isLoadingResponCustomerWom = false;
        $state.listCustomerWOMMaster = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
      builder
      .addCase(getListCustomerWOMByIdMaster.pending, ($state) => {
        $state.isLoadingResponCustomerWomById = true;
      })
      .addCase(getListCustomerWOMByIdMaster.fulfilled, ($state, action) => {
        $state.isLoadingResponCustomerWomById = false;
        $state.listCustomerWOMByIdMaster = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });

   
  },
});

export const {} = CustomerWOMViewSlice.actions;

export default CustomerWOMViewSlice.reducer;
