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
import { isLoading } from "store/example";

interface AppointmentViewState {
  listAppointmentMaster: AppointmentViewResp;
  isLoadingAppointmentMaster: boolean;
  statistic: StatisticAppointmentCustomize;
  isLoadingStatistic: boolean;
}

const initialState: AppointmentViewState = {
  isLoadingAppointmentMaster: false,
  listAppointmentMaster: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  statistic: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  isLoadingStatistic: false,
};

export const getListAppointmentMaster = createAsyncThunk<
  AppointmentViewResp,
  { rejectValue: any }
>(
  "mapsReducer/listAppointmentMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await loadAppointmentMasters(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStatisticAppointment = createAsyncThunk<
  StatisticAppointment,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getStatisticAppointmentAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getStatisticAppointmentView(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const AppointmentViewSlice = createSlice({
  name: "appointmentViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getListAppointmentMaster.pending, ($state) => {
        $state.isLoadingAppointmentMaster = true;
      })
      .addCase(getListAppointmentMaster.fulfilled, ($state, action) => {
        $state.isLoadingAppointmentMaster = false;
        $state.listAppointmentMaster = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });

    builder
      .addCase(getStatisticAppointment.pending, ($state) => {
        $state.isLoadingStatistic = true;
      })
      .addCase(getStatisticAppointment.fulfilled, ($state, action) => {
        $state.isLoadingStatistic = false;
        const transformedData: any = {};
        const { data } = action.payload;

        data.forEach((item) => {
          if (!transformedData[item.id]) {
            transformedData[item.id] = {
              id: item.id,
              title: item.title.split(" - ")[0],
              child: [],
            };
          }

          transformedData[item.id].child.push({
            id: item.id,
            sequence: item.sequence,
            title: item.title,
            count: item.count,
          });
        });

        $state.statistic = {
          ...action.payload,
          data: [...Object.values(transformedData)] as any,
        };
      });
  },
});

export const {} = AppointmentViewSlice.actions;

export default AppointmentViewSlice.reducer;
