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
import { getAnswerSurvey } from "services/api/survey_lead";
import { SurveyResponse } from "services/api/survey_lead/types";
import { getDetailVisit } from "services/api/visitAPI";
import { VisitDataResponse } from "services/api/visitAPI/types";
import { isLoading } from "store/example";

interface SurveyLeadViewState {
  listAnswerMaster: SurveyResponse;
  isLoadingAnswerMaster: boolean;
}

const initialState: SurveyLeadViewState = {
  isLoadingAnswerMaster: false,
  listAnswerMaster: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  } as any,
};

export const getListAnswerMaster = createAsyncThunk<
SurveyResponse,any,
  { rejectValue: any }
>(
  "mapsReducer/listVisitMasterAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getAnswerSurvey(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const SurveyViewSlice = createSlice({
  name: "visitViewReducer",
  initialState,
  reducers: {
    // setItemClick($state, action: PayloadAction<MarketingAppointmentViewType>) {
    //   $state.inforClick = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getListAnswerMaster.pending, ($state) => {
        $state.isLoadingAnswerMaster = true;
      })
      .addCase(getListAnswerMaster.fulfilled, ($state, action) => {
        $state.isLoadingAnswerMaster = false;
        $state.listAnswerMaster = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });

   
  },
});

export const {} = SurveyViewSlice.actions;

export default SurveyViewSlice.reducer;
