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
import { getListCustomers } from "services/api/customerList";
import { CustomerResponse } from "services/api/customerList/types";
import { getCustomerWom, getCustomerWomById } from "services/api/customer_wom";
import { ResponCustomerWom, ResponCustomerWomById } from "services/api/customer_wom/types";

interface  CustomerWOMViewState {
  listCustomerMaster: CustomerResponse;
  isLoadingResponCustomer: boolean;
}

const initialState: CustomerWOMViewState = {
  isLoadingResponCustomer: false,
  listCustomerMaster: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
 
};

export const getListCustomerMaster = createAsyncThunk<
  CustomerResponse,
  { rejectValue: any }
>(
  "mapsReducer/listCustomerMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListCustomers(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const CustomerViewSlice = createSlice({
  name: "customerViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getListCustomerMaster.pending, ($state) => {
        $state.isLoadingResponCustomer = true;
      })
      .addCase(getListCustomerMaster.fulfilled, ($state, action) => {
        $state.isLoadingResponCustomer = false;
        $state.listCustomerMaster = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
     
   
  },
});

export const {} = CustomerViewSlice.actions;

export default CustomerViewSlice.reducer;
