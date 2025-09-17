/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  listCallAnsweredByDate,
  listCallByDate,
  listCallMissedByDate,
} from "services/api/missCall";
import { ListCallResponse } from "services/api/missCall/types";
import { handleAddIndex } from "utils/functions";

interface missCallState {
  allCall: ListCallResponse;
  allCallLoading: boolean;
  answerCall: ListCallResponse;
  answerCallLoading: boolean;
  missCall: ListCallResponse;
  missCallLoading: boolean;
}

const initialState: missCallState = {
  allCall: {
    data: [],
    message: "",
    status: false,
    total_items: 0,
    client_ip: "",
  },
  allCallLoading: false,
  answerCall: {
    data: [],
    message: "",
    status: false,
    total_items: 0,
    client_ip: "",
  },
  answerCallLoading: false,
  missCall: {
    data: [],
    message: "",
    status: false,
    total_items: 0,
    client_ip: "",
  },
  missCallLoading: false,
};

export const handleGetListCall = createAsyncThunk<
  ListCallResponse,
  any,
  { rejectValue: any }
>("mapsReducer/handleGetListCallAction", async (data, { rejectWithValue }) => {
  try {
    const response = await listCallByDate(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
export const handleGetListAnswerCall = createAsyncThunk<
  ListCallResponse,
  any,
  { rejectValue: any }
>(
  "mapsReducer/handleGetListAnswerCallAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await listCallAnsweredByDate(data);
      
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const handleGetListMissedCall = createAsyncThunk<
  ListCallResponse,
  any,
  { rejectValue: any }
>("mapsReducer/handleMissedCallAction", async (data, { rejectWithValue }) => {
  try {
    const response = await listCallMissedByDate(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const missCallSlice = createSlice({
  name: "homeReducer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    //all of list call
    builder
      .addCase(handleGetListCall.pending, ($state, action) => {
        $state.allCallLoading = true;
      })
      .addCase(handleGetListCall.fulfilled, ($state, action) => {
        $state.allCall = action.payload;
        $state.allCallLoading = false;
      });
    // answer
    builder
      .addCase(handleGetListAnswerCall.pending, ($state, action) => {
        $state.answerCallLoading = true;
      })
      .addCase(handleGetListAnswerCall.fulfilled, ($state, action) => {
        const convert = handleAddIndex(action.payload?.data);
        $state.answerCall = {
          ...action.payload,
          data: convert,
        };
        $state.answerCallLoading = false;
      });
    // miss call
    builder
      .addCase(handleGetListMissedCall.pending, ($state, action) => {
        $state.missCallLoading = true;
      })
      .addCase(handleGetListMissedCall.fulfilled, ($state, action) => {
        const convert = handleAddIndex(action.payload?.data);
        $state.missCall = {
          ...action.payload,
          data: convert,
        };
        $state.missCallLoading = false;
      });
  },
});
export const {} = missCallSlice.actions;

export default missCallSlice.reducer;
