/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import AddPriceQuoteReducer from "./AddPriceQuote";
import LoadCustomerStatisticReducer from "./CustomerStaticstic";
import afterExamsReducer from "./afterexams";
import afterexamtaskReducer from "./afterexams_task"
import appointmentMasterReducer from "./appointment_view";
import beforeExamReducer from "./beforeExams";
import bookingScheduleReducer from "./booking_schedule";
import callReExammingReducer from "./callreexamming";
import cloudfoneReducer from "./cloudfone/index";
import infoCustomer from "./customerInfo";
import listCustomerReducer from "./customerList"
import CustomerWOMReducer from "./customerWOM_view"
import dashboardReducer from "./dashboard";
import dashboardSalesReducer from "./dashboardSales";
import exampleReducer from "./example";
import homeReducer from "./home";
import KPIMonthViewReducer from "./kpi_month"
import KPIDayViewReducer from "./kpi_taskview"
import messageReducer from "./message";
import misscallReducer from "./misscall";
import pancakeReducer from "./pancake/index";
import pointReducer from "./point";
import statisticReducer from "./statistics";
import listSurveyReducer from "./survey_lead";
import listTaskReducer from "./tasks";
import listVisitReducer from "./visit";
// Initialize config for Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // List of reducers you want to store
};

const rootReducer = combineReducers({
  example: exampleReducer,
  dashboard: dashboardReducer,
  message: messageReducer,
  afterExams: afterExamsReducer,
  home: homeReducer,
  beforeExams: beforeExamReducer,
  infosCustomer: infoCustomer,
  bookingSchedule: bookingScheduleReducer,
  appointmentMaster: appointmentMasterReducer,
  pancake: pancakeReducer,
  statistic: statisticReducer,
  misscall: misscallReducer,
  cloudfone: cloudfoneReducer,
  point: pointReducer,
  kpiday: KPIDayViewReducer,
  kpiMonth: KPIMonthViewReducer,
  CustomerWOM: CustomerWOMReducer,
  afterexamtask: afterexamtaskReducer,
  addPriceQuote: AddPriceQuoteReducer,
  listTaskReducer: listTaskReducer,
  listVisit: listVisitReducer,
  listCustomer: listCustomerReducer,
  listSurvey: listSurveyReducer,
  callReExamming: callReExammingReducer,
  dashboardSales: dashboardSalesReducer,
  LoadCustomerStatistic: LoadCustomerStatisticReducer,
});

// Apply Redux Persist to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  devTools: process.env.NODE_ENV === "development",
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
// Create persistor to use for Redux Persist initialization
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
