/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getAppointmentByEmployee,
  getCreateSummaryPerfReportByDate,
  getCreateSummaryPerfReportByDays,
  getCreateSummaryPerfReportByWeek,
  getCustomerForStatistic,
  getReportByDate,
  getReportByDates,
  getReportByWeek,
  getSurveyStatisticsAPI,
} from "services/api/statistics";
import {
  ReportData,
  ReportlaunchSource,
  RespStatistic,
  ResponseAppointmentByEmployee,
  ResponseGrowthReport,
  ResponseSurveyStatistics,
  responseReport,
} from "services/api/statistics/types";
const storageLaunchSources = localStorage.getItem("launchSources");
const storageLaunchSourcesGroup = localStorage.getItem("launchSourcesGroups");

interface StatisticState {
  responseStatiscal: RespStatistic;
  isLoadingStatiscal: boolean;
  responseAppointmentEmployee: ResponseAppointmentByEmployee;
  isLoadingAppointmentEmployee: boolean;
  /* report-summary */
  reponseRePortSummary: responseReport;
  reponseRePortSummaryLoading: boolean;
  /* compare */
  responseCompare?: responseReport;
  loadingCompare?: boolean;
  /* report-growth */
  responseReportGrowth: ResponseGrowthReport;
  loadingReportGrowth: boolean;
   /* survey statistics */
  responseSurveyStatistics: ResponseSurveyStatistics;
  loadingSurveyStatistics: boolean;
}

const initialState: StatisticState = {
  responseStatiscal: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  isLoadingStatiscal: false,
  responseAppointmentEmployee: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
  isLoadingAppointmentEmployee: false,
  reponseRePortSummary: {
    data: undefined as any,
    message: "",
    status: false,
    client_ip: "",
  },
  reponseRePortSummaryLoading: false,
  /* report-growth */
  responseReportGrowth: {
    data: undefined as any,
    message: "",
    status: false,
    client_ip: "",
  },
  loadingReportGrowth: false,
   /* survey statistics */
  responseSurveyStatistics: {
    data: undefined as any,
    message: "",
    status: false,
    client_ip: "",
  },
  loadingSurveyStatistics: false,
};

export const getCustomerStatiscal = createAsyncThunk<
  RespStatistic,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getTaskByCustomerIDAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCustomerForStatistic(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAppointmentEmployee = createAsyncThunk<
  ResponseAppointmentByEmployee,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getAppointmentEmployeeAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getAppointmentByEmployee(data);
  
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
  /* survey statistics */
export const getSurveyStatistics = createAsyncThunk<
  ResponseSurveyStatistics,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getSurveyStatisticsAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getSurveyStatisticsAPI(data);
  
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getSummaryReportByDate = createAsyncThunk<
  responseReport,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getSummaryReportByDateAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCreateSummaryPerfReportByDate(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSummaryReportByDays = createAsyncThunk<
  responseReport,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getSummaryReportByDaysAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCreateSummaryPerfReportByDays(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getGrowthReportByWeek = createAsyncThunk<
  responseReport,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getSummaryReportByWeeksAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCreateSummaryPerfReportByWeek(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSummaryReportByDaysCompare = createAsyncThunk<
  responseReport,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getSummaryReportByDaysCompareAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCreateSummaryPerfReportByDays(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSummaryReportByWeeksCompare = createAsyncThunk<
  responseReport,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getSummaryReportByWeeksCompareAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCreateSummaryPerfReportByWeek(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getReportGrowthByDate = createAsyncThunk<
  ResponseGrowthReport,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getReportGrowthByDateAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getReportByDate(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getReportGrowthByDates = createAsyncThunk<
  ResponseGrowthReport,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getReportGrowthByDatesAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getReportByDates(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getReportGrowthByWeeks = createAsyncThunk<
  ResponseGrowthReport,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getReportGrowthByWeeksAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getReportByWeek(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const statisticSlice = createSlice({
  name: "statisticReducer",
  initialState,
  reducers: {
    // setIsEmptyInteract($state, action: PayloadAction<boolean>) {
    //   $state.isEmptyInteract = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getReportGrowthByDate.pending, ($state) => {
        $state.loadingReportGrowth = true;
      })
      .addCase(getReportGrowthByDate.fulfilled, ($state, action) => {
        $state.loadingReportGrowth = false;
        $state.responseReportGrowth = action.payload;
      });
      builder
      .addCase(getSurveyStatistics.pending, ($state) => {
        $state.loadingSurveyStatistics = true;
      })
      .addCase(getSurveyStatistics.fulfilled, ($state, action) => {
        $state.loadingSurveyStatistics = false;
        $state.responseSurveyStatistics = action.payload;
      });
    builder
      .addCase(getReportGrowthByDates.pending, ($state) => {
        $state.loadingReportGrowth = true;
      })
      .addCase(getReportGrowthByDates.fulfilled, ($state, action) => {
        $state.loadingReportGrowth = false;
        $state.responseReportGrowth = action.payload;
      });
    builder
      .addCase(getReportGrowthByWeeks.pending, ($state) => {
        $state.loadingReportGrowth = true;
      })
      .addCase(getReportGrowthByWeeks.fulfilled, ($state, action) => {
        $state.loadingReportGrowth = false;
        $state.responseReportGrowth = action.payload;
      });
    builder
      .addCase(getCustomerStatiscal.pending, ($state) => {
        $state.isLoadingStatiscal = true;
      })
      .addCase(getCustomerStatiscal.fulfilled, ($state, action) => {
        $state.isLoadingStatiscal = false;
        $state.responseStatiscal = action.payload;
      });
    builder
      .addCase(getAppointmentEmployee.pending, ($state) => {
        $state.isLoadingAppointmentEmployee = true;
      })
      .addCase(getAppointmentEmployee.fulfilled, ($state, action) => {
        $state.isLoadingAppointmentEmployee = false;
        const newData = action.payload.data?.map((item, index) => ({
          index: index + 1,
          ...item,
        }));
        $state.responseAppointmentEmployee = {
          ...action.payload,
          data: newData,
        };
      });
    builder
      .addCase(getSummaryReportByDate.pending, ($state) => {
        $state.reponseRePortSummaryLoading = true;
      })
      .addCase(getSummaryReportByDate.fulfilled, ($state, action) => {
        $state.reponseRePortSummaryLoading = false;
        const newlist: any[] = [];
        const listLaunchSources = JSON.parse(storageLaunchSources || "");
        const listLaunchSourcesGroup = JSON.parse(
          storageLaunchSourcesGroup || ""
        );

        action.payload?.data?.data[0].details?.map((item) => {
          const checkExit = newlist.find(
            (i) => i.launch_source_name === item.launch_source_name
          );
          const newItem = {
            ...item,
            launch_source_group_id: listLaunchSourcesGroup?.find(
              (i: any) => i?.label === item.launch_source_group_name
            )?.id,
            launch_source_group_name: item.launch_source_group_name,
            launch_source_name: item.launch_source_name,
            launch_source_id: listLaunchSources?.find(
              (i: any) => i?.label === item.launch_source_name
            )?.id,
          };

          if (checkExit) {
            checkExit?.child?.push(newItem);
          } else {
            newlist.push({
              launch_source_name: item.launch_source_name,
              launch_source_id: listLaunchSources.find(
                (i: any) => i?.label === item.launch_source_name
              )?.id,
              child: [newItem as any],
            });
          }
        });

        const newData = {
          ...action.payload,
          data: {
            ...action.payload.data,
            launch_source: newlist,
          },
        };

        $state.reponseRePortSummary = newData;
      });

    builder
      .addCase(getSummaryReportByDays.pending, ($state) => {
        $state.reponseRePortSummaryLoading = true;
      })
      .addCase(getSummaryReportByDays.fulfilled, ($state, action) => {
        $state.reponseRePortSummaryLoading = false;
        const newlist: any[] = [];

        action.payload?.data?.data?.map((record, index) => {
          record.details?.map((item) => {
            const checkExit = newlist.find(
              (i) => i.launch_source_id === item.launch_source_id
            );
            const newItem = {
              ...item,
              launch_source_group_id: item.launch_source_group_id,
              launch_source_group_name: item.launch_source_group_name,
              launch_source_name: item.launch_source_name,
              launch_source_id: item?.launch_source_id,
            };

            if (checkExit) {
              checkExit?.child?.push(newItem);
            } else {
              newlist.push({
                launch_source_name: item.launch_source_name,
                launch_source_id: item?.launch_source_id,
                child: [newItem as any],
              });
            }
          });
        });

        const newData = {
          ...action.payload,
          data: {
            ...action.payload.data,
            launch_source: newlist,
          },
        };

        $state.reponseRePortSummary = newData;
      });
    builder
      .addCase(getGrowthReportByWeek.pending, ($state) => {
        $state.reponseRePortSummaryLoading = true;
      })
      .addCase(getGrowthReportByWeek.fulfilled, ($state, action) => {
        $state.reponseRePortSummaryLoading = false;
        const newlist: any[] = [];

        action.payload?.data?.data?.map((record, index) => {
          record.details?.map((item) => {
            const checkExit = newlist.find(
              (i) => i.launch_source_id === item.launch_source_id
            );
            const newItem = {
              ...item,
              week: record.week,
            };

            if (checkExit) {
              checkExit?.child?.push(newItem);
            } else {
              newlist.push({
                launch_source_name: item.launch_source_name,
                launch_source_id: item?.launch_source_id,
                child: [newItem as any],
              });
            }
          });
        });

        const newData = {
          ...action.payload,
          data: {
            ...action.payload.data,
            launch_source: newlist,
          },
        };

        $state.reponseRePortSummary = newData;
      });
    builder
      .addCase(getSummaryReportByWeeksCompare.pending, ($state) => {
        $state.loadingCompare = true;
      })
      .addCase(getSummaryReportByWeeksCompare.fulfilled, ($state, action) => {
        $state.loadingCompare = false;
        const endoData = action.payload?.data?.data?.map((item) => {
          return {
            ...item,
            endo_report: {
              launch_source_group_id: 2,
              launch_source_group_name: "Endo Clinic - Tiêu Hoá",
              investment_amount: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce(
                  (init: any, item: any) => init + item.investment_amount,
                  0
                ),
              customer_number: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce(
                  (init: any, item: any) => init + item.customer_number,
                  0
                ),
              revenue: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce((init: any, item: any) => init + item.revenue, 0),
              cost_price: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce((init: any, item: any) => init + item.cost_price, 0),
              gross_profit: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce((init: any, item: any) => init + item.gross_profit, 0),
            },
            dc_report: {
              launch_source_group_id: 1,
              launch_source_group_name: "Doctor Check - Tầm Soát Bệnh",
              investment_amount: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce(
                  (init: any, item: any) => init + item.investment_amount,
                  0
                ),
              customer_number: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce(
                  (init: any, item: any) => init + item.customer_number,
                  0
                ),
              revenue: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce((init: any, item: any) => init + item.total_revenue, 0),
              cost_price: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce((init: any, item: any) => init + item.cost_price, 0),
              gross_profit: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce((init: any, item: any) => init + item.gross_profit, 0),
            },
            dataChart: {
              id: item.day,
              value: [
                item.investment_amount,
                item.total_revenue,
                item.gross_profit,
              ],
            },
          };
        });

        $state.responseCompare = {
          ...action.payload,
          data: {
            success: true,
            message: action.payload.message,
            data: endoData,
          },
        };
      });
    builder
      .addCase(getSummaryReportByDaysCompare.pending, ($state) => {
        $state.loadingCompare = true;
      })
      .addCase(getSummaryReportByDaysCompare.fulfilled, ($state, action) => {
        $state.loadingCompare = false;

        const endoData = action.payload?.data?.data?.map((item) => {
          return {
            ...item,
            endo_report: {
              launch_source_group_id: 2,
              launch_source_group_name: "Endo Clinic - Tiêu Hoá",
              investment_amount: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce(
                  (init: any, item: any) => init + item.investment_amount,
                  0
                ),
              customer_number: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce(
                  (init: any, item: any) => init + item.customer_number,
                  0
                ),
              revenue: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce((init: any, item: any) => init + item.total_revenue, 0),
              cost_price: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce((init: any, item: any) => init + item.cost_price, 0),
              gross_profit: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 2)
                .reduce((init: any, item: any) => init + item.gross_profit, 0),
            },
            dc_report: {
              launch_source_group_id: 1,
              launch_source_group_name: "Doctor Check - Tầm Soát Bệnh",
              investment_amount: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce(
                  (init: any, item: any) => init + item.investment_amount,
                  0
                ),
              customer_number: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce(
                  (init: any, item: any) => init + item.customer_number,
                  0
                ),
              revenue: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce((init: any, item: any) => init + item.total_revenue, 0),
              cost_price: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce((init: any, item: any) => init + item.cost_price, 0),
              gross_profit: item?.details
                ?.filter((i: any) => i.launch_source_group_id === 1)
                .reduce((init: any, item: any) => init + item.gross_profit, 0),
            },
          };
        });

        $state.responseCompare = {
          ...action.payload,
          data: {
            success: true,
            message: action.payload.message,
            data: endoData,
          },
        };
      });
  },
});

export const {} = statisticSlice.actions;

export default statisticSlice.reducer;
