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
import { loadKPIAgency, loadKPIEmployee, loadKPIEmployeeChart, loadKPIEmployeeChartV2, loadKPIEmployeeMonth } from "services/api/kpiMonth";
import { loadKPIAgencyView, loadKPIEmployeeView ,loadKPIEmployeeChartView, loadKPIEmployeeViewMonth} from "services/api/kpiMonth/types";
import { loadKPIDays, loadKPIDays_C1, loadKPIDays_C2, loadKPIDays_C3 } from "services/api/kpi_taskView";
import { loadKPIDaysView,loadKPIDaysType} from "services/api/kpi_taskView/types"
import { isLoading } from "store/example";

interface KPIMonthViewState {
  
  listKPIEmployee: loadKPIEmployeeView;
  listKPIEmployeeMonth: loadKPIEmployeeViewMonth;
  listKPIAgency: loadKPIAgencyView;
  listKPIEmployeeChart: loadKPIEmployeeChartView;
  isLoadingKPIMasterChart: boolean;
  listKPIEmployeeChart2: loadKPIEmployeeChartView;
  isLoadingKPIMasterChart2: boolean;
  isLoadingKPIMaster: boolean;
  isLoadingKPIMasterMonth: boolean;
  statistic: StatisticAppointmentCustomize;
  isLoadingStatistic: boolean;
}

const initialState: KPIMonthViewState = {
  isLoadingKPIMaster: false,
  
  listKPIEmployee: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
   listKPIEmployeeMonth: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  listKPIEmployeeChart: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
   listKPIEmployeeChart2: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  listKPIAgency: {
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
  isLoadingKPIMasterChart: false,
  isLoadingKPIMasterChart2: false,
  isLoadingKPIMasterMonth: false
};

export const getKPIEmployee = createAsyncThunk<
  loadKPIEmployeeView,
  { rejectValue: any }
>(
  "mapsReducer/listKPIEmployeeAction",
  async (data, { rejectWithValue }) => {

    try {
      const response = await loadKPIEmployee(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getKPIEmployeeMonth = createAsyncThunk<
  loadKPIEmployeeViewMonth,
  { rejectValue: any }
>(
  "mapsReducer/listKPIEmployeeMonthAction",
  async (data, { rejectWithValue }) => {

    try {
      const response = await loadKPIEmployeeMonth(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getKPIEmployeeChart = createAsyncThunk<
  loadKPIEmployeeChartView,
  { rejectValue: any }
>(
  "mapsReducer/listKPIEmployeeChartAction",
  async (data, { rejectWithValue }) => {

    try {
      const response = await loadKPIEmployeeChart(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getKPIEmployeeChart2 = createAsyncThunk<
  loadKPIEmployeeChartView,
  { rejectValue: any }
>(
  "mapsReducer/listKPIEmployeeChart2Action",
  async (data, { rejectWithValue }) => {

    try {
      const response = await loadKPIEmployeeChartV2(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getKPIAgency = createAsyncThunk<
  loadKPIAgencyView,
  { rejectValue: any }
>(
  "mapsReducer/listKPIAgencyAction",
  async (data, { rejectWithValue }) => {
    
    try {
      const response = await loadKPIAgency(data);
      console.log(response)
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

export const KPIMonthViewSlice = createSlice({
  name: "appointmentViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
     builder
      .addCase(getKPIEmployee.pending, ($state) => {
        $state.isLoadingKPIMaster = true;
      })
      .addCase(getKPIEmployee.fulfilled, ($state, action) => {
        $state.isLoadingKPIMaster = false;
        $state.listKPIEmployee = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
      builder
      .addCase(getKPIEmployeeMonth.pending, ($state) => {
        $state.isLoadingKPIMasterMonth = true;
      })
      .addCase(getKPIEmployeeMonth.fulfilled, ($state, action) => {
        $state.isLoadingKPIMasterMonth = false;
        $state.listKPIEmployeeMonth = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
      builder
  .addCase(clearKPIMonth, ($state) => {
    $state.listKPIEmployeeMonth = {
          data: {
      employee_id: "",       // Giá trị mặc định
      from_date: new Date(),  // Ngày hiện tại làm giá trị mặc định
      to_date: new Date(),    // Ngày hiện tại làm giá trị mặc định
      details: [],            // Mảng rỗng cho chi tiết
    },
        message: "",
        status: false,
        client_ip: "",
    }; 
  });
     builder
      .addCase(getKPIEmployeeChart.pending, ($state) => {
        $state.isLoadingKPIMasterChart = true;
      })
      .addCase(getKPIEmployeeChart.fulfilled, ($state, action) => {
        $state.isLoadingKPIMasterChart = false;
        $state.listKPIEmployeeChart = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
         builder
      .addCase(getKPIEmployeeChart2.pending, ($state) => {
        $state.isLoadingKPIMasterChart2 = true;
      })
      .addCase(getKPIEmployeeChart2.fulfilled, ($state, action) => {
        $state.isLoadingKPIMasterChart2 = false;
        $state.listKPIEmployeeChart2 = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
    builder
      .addCase(getKPIAgency.pending, ($state) => {
        $state.isLoadingKPIMaster = true;
      })
      .addCase(getKPIAgency.fulfilled, ($state, action) => {
        $state.isLoadingKPIMaster = false;
        $state.listKPIAgency = action.payload;
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
export const clearKPIMonth = createAction('CLEAR_KPI_MONTH');
export const {} = KPIMonthViewSlice.actions;

export default KPIMonthViewSlice.reducer;
