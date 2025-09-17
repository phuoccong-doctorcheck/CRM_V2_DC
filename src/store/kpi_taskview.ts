/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice, createAction } from "@reduxjs/toolkit";
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
import { loadKPIDays, loadKPIDays1, } from "services/api/kpi_taskView";
import { loadKPIDaysView,loadKPIDaysType, loadKPIDaysView1} from "services/api/kpi_taskView/types"
import { isLoading } from "store/example";

interface KPIViewState {

  listKPIDay: loadKPIDaysView[];
  listKPIDay1: loadKPIDaysView1;
  isLoadingKPIMaster: boolean;
  statistic: StatisticAppointmentCustomize;
  isLoadingStatistic: boolean;
}

const initialState: KPIViewState = {
  isLoadingKPIMaster: false,
  
  listKPIDay: [],
  listKPIDay1:  {
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

export const getKPIDays = createAsyncThunk<
  loadKPIDaysView,
  { rejectValue: any }
>(
  "mapsReducer/listKPIAction",
  async (data, { rejectWithValue }) => {

    try {
      const response = await loadKPIDays(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getKPIDays1 = createAsyncThunk<
  loadKPIDaysView1,
  { rejectValue: any }
>(
  "mapsReducer/listKPI1Action",
  async (data, { rejectWithValue }) => {

    try {
      const response = await loadKPIDays1(data);
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

export const KPIDayViewSlice = createSlice({
  name: "appointmentViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
     builder
      .addCase(getKPIDays.pending, ($state) => {
        $state.isLoadingKPIMaster = true;
         // $state.listKPIDay = []; 
      })
      .addCase(getKPIDays.fulfilled, ($state, action) => {
        $state.isLoadingKPIMaster = false;
        $state.listKPIDay.push(action.payload); 
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
     builder
      .addCase(getKPIDays1.pending, ($state) => {
        $state.isLoadingKPIMaster = true;
      })
      .addCase(getKPIDays1.fulfilled, ($state, action) => {
        $state.isLoadingKPIMaster = false;
        $state.listKPIDay1 = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
    //  builder
    //   .addCase(getKPIDays1.pending, ($state) => {
    //     $state.isLoadingKPIMaster = true;
    //      // $state.listKPIDay = []; 
    //   })
    //   .addCase(getKPIDays1.fulfilled, ($state, action) => {
    //     $state.isLoadingKPIMaster = false;
    //     $state.listKPIDay1.push(action.payload); 
    //     if (!action.payload.status) {
    //       toast.error(action.payload.message);
    //     }
    //   });
      builder
  .addCase(clearKPIDays, ($state) => {
    $state.listKPIDay = []; 
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
export const clearKPIDays = createAction('CLEAR_KPI_DAYS');

export const {} = KPIDayViewSlice.actions;

export default KPIDayViewSlice.reducer;
