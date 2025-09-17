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
import { getDetailVisit } from "services/api/visitAPI";
import { VisitDataResponse } from "services/api/visitAPI/types";
import { isLoading } from "store/example";

interface VisitViewState {
  listVisitItemMaster: VisitDataResponse;
  isLoadingVisitItemMaster: boolean;
}

const initialState: VisitViewState = {
  isLoadingVisitItemMaster: false,
  listVisitItemMaster: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
};

export const getListVisitItemMaster = createAsyncThunk<
VisitDataResponse,any,
  { rejectValue: any }
>(
  "mapsReducer/listVisitMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getDetailVisit(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const VisitViewSlice = createSlice({
  name: "visitViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getListVisitItemMaster.pending, ($state) => {
        $state.isLoadingVisitItemMaster = true;
      })
      .addCase(getListVisitItemMaster.fulfilled, ($state, action) => {
        $state.isLoadingVisitItemMaster = false;
        $state.listVisitItemMaster = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });

   
  },
});

export const {} = VisitViewSlice.actions;

export default VisitViewSlice.reducer;
