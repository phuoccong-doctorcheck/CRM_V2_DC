/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GetCallHistory } from "services/cloudfone";
import { ResponseHistoriesCall } from "services/cloudfone/types";

interface CloudfoneState {
  historiesCall: ResponseHistoriesCall;
  historiesCallLoading: boolean;
}

const initialState: CloudfoneState = {
  historiesCall: {
    result: "",
    message: "",
    total: 0,
    data: [],
  },
  historiesCallLoading: false,
};

export const getHistoriesCallFromCloudfone = createAsyncThunk<
  ResponseHistoriesCall,
  any,
  { rejectValue: any }
>("mapsReducer/getProjectAction", async (body, { rejectWithValue }) => {
  try {
    const response = await GetCallHistory(body); 
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const CloudfoneSlice = createSlice({
  name: "CloudfoneReducer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getHistoriesCallFromCloudfone.pending, ($state, action) => {
        $state.historiesCallLoading = true;
      })
      .addCase(getHistoriesCallFromCloudfone.fulfilled, ($state, action) => {
        $state.historiesCallLoading = false;

        $state.historiesCall = action.payload;
      });
  },
});

export const {} = CloudfoneSlice.actions;

export default CloudfoneSlice.reducer;
