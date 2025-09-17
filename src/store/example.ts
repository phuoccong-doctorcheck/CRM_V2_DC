/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DemoTicket } from "assets/data";
import { TelephoneConfig } from "components/templates/Telephone";
import {} from "pages/Dashboard";
import { TicketType } from "pages/BeforeMedicalExamination";
import { EmployeeRankType } from "services/types";

interface ExampleState {
  isLogin: boolean;
  isLoading: boolean;
  isShowNoteCompnent: boolean;
  noteDataExample: TicketType[];
  dataExampleEmployeeRank: EmployeeRankType[];
  dataSortPhoneConfigExample: TelephoneConfig;
}

const initialState: ExampleState = {
  isLogin: false,
  isLoading: false,
  noteDataExample: DemoTicket,
  isShowNoteCompnent: false,
  dataExampleEmployeeRank: [],
  dataSortPhoneConfigExample: {
    userName: "106",
    password: "IRd54Dlngp&",
    displayNames: "Test",
    authRealm: "cf-pbx0001081.cfvn.cloud",
    webSocketURL: "wss://rtc.cloudfone.vn:4433",
  },
};

export const exampleSlice = createSlice({
  name: "exampleReducer",
  initialState,
  reducers: {
    isLogined($state, action: PayloadAction<boolean>) {
      $state.isLogin = action.payload;
    },
    isLoading($state, action: PayloadAction<boolean>) {
      $state.isLoading = action.payload;
    },
    NotedataExamples($state, action: PayloadAction<TicketType[]>) {
      $state.noteDataExample = action.payload;
    },
    setShowNoteComponent($state, action: PayloadAction<boolean>) {
      $state.isShowNoteCompnent = action.payload;
    },
    setDataExampleEmployeeRank(
      $state,
      action: PayloadAction<EmployeeRankType[]>
    ) {
      $state.dataExampleEmployeeRank = action.payload;
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(incrementAsync.fulfilled, ($state, action) => {
  //     $state.language = action.payload;
  //   });
  // },
});

export const {
  isLogined,
  isLoading,
  setShowNoteComponent,
  NotedataExamples,
  setDataExampleEmployeeRank,
} = exampleSlice.actions;

export default exampleSlice.reducer;
