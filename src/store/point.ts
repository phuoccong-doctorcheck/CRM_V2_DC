/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { log } from "console";

import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getCustomerFType,
  getCustomerLeads,
  getCustomerRemind,
  getNoteCustomerRemind,
  getListCustomerPoints,
  getListPointsOfCustomer,
  getMinusListPointsOfCustomer,
} from "services/api/point";
import {
  ResponseCustomerFType,
  ResponseCustomerLeads,
  ResponseCustomerPoints,
  ResponseCustomerRemind,
  ResponseCustomerRemindNote,
  ResponseListPointOfCustomer
} from "services/api/point/types";

interface PointState {
  loadingPoint: boolean;
  responsePoint: ResponseCustomerPoints;
  loadingCustomerLeads: boolean;
  loadingCustomerRemind: boolean;
  loadingCustomerRemindNote: boolean;
  responseCustomerLeads: ResponseCustomerLeads;
  responseCustomerRemind: ResponseCustomerRemind;
  responseCustomerRemindNote: ResponseCustomerRemindNote;
  responseCustomerFType: ResponseCustomerFType;
  responseCustomerFTypeLoading: boolean;
  responsePointOfCustomer: ResponseListPointOfCustomer;
  responsePointOfCustomerLoading: boolean;
  responsePointMinusOfCustomer: ResponseListPointOfCustomer;
  responsePointMinusOfCustomerLoading: boolean;
}

const initialState: PointState = {
  loadingPoint: false,
  responsePoint: undefined as unknown as ResponseCustomerPoints,
  loadingCustomerLeads: false,
  loadingCustomerRemind: false,
  loadingCustomerRemindNote: false,
  responseCustomerLeads: undefined as unknown as ResponseCustomerLeads,
  responseCustomerRemind: undefined as unknown as ResponseCustomerRemind,
  responseCustomerRemindNote: undefined as unknown as ResponseCustomerRemindNote,
  responseCustomerFType: undefined as unknown as ResponseCustomerFType,
  responseCustomerFTypeLoading: false,
  responsePointOfCustomer: undefined as unknown as ResponseListPointOfCustomer,
  responsePointOfCustomerLoading: false,
  responsePointMinusOfCustomer: undefined as unknown as ResponseListPointOfCustomer,
  responsePointMinusOfCustomerLoading: false,
};

export const getListCustomerPoint = createAsyncThunk<
  ResponseCustomerPoints,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getListCustomerPointAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListCustomerPoints(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getListPointOfCustom = createAsyncThunk<
  ResponseListPointOfCustomer,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getListPointOfCustomerAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListPointsOfCustomer(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getListPointMinusOfCustom = createAsyncThunk<
  ResponseListPointOfCustomer,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getListPointMinusOfCustomerAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getMinusListPointsOfCustomer(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getCustomerLeadsData = createAsyncThunk<
  ResponseCustomerLeads,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getCustomerLeadsDataAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCustomerLeads(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCustomerRemindData = createAsyncThunk<
  ResponseCustomerRemind,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getCustomerRemindDataAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCustomerRemind(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getCustomerRemindNoteData = createAsyncThunk<
  ResponseCustomerRemindNote,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getCustomerRemindNoteDataAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getNoteCustomerRemind(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getCustomerFTypeByOwner = createAsyncThunk<
  ResponseCustomerFType,
  any,
  { rejectValue: any }
>("mapsReducer/getCustomerFTypeAction", async (data, { rejectWithValue }) => {
  try {
    const response = await getCustomerFType(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const pointSlice = createSlice({
  name: "PointReducer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getListPointMinusOfCustom.pending, ($state) => {
        $state.responsePointMinusOfCustomerLoading = true;
      })
      .addCase(getListPointMinusOfCustom.fulfilled, ($state, action) => {
        $state.responsePointMinusOfCustomerLoading = false;
        $state.responsePointMinusOfCustomer = action.payload;
      });
      builder
      .addCase(getListPointOfCustom.pending, ($state) => {
        $state.responsePointOfCustomerLoading = true;
      })
      .addCase(getListPointOfCustom.fulfilled, ($state, action) => {
        $state.responsePointOfCustomerLoading = false;
        $state.responsePointOfCustomer = action.payload;
      });
    builder
      .addCase(getListCustomerPoint.pending, ($state) => {
        $state.loadingPoint = true;
      })
      .addCase(getListCustomerPoint.fulfilled, ($state, action) => {
        $state.loadingPoint = false;
        $state.responsePoint = action.payload;
      });
    builder
      .addCase(getCustomerLeadsData.pending, ($state) => {
        $state.loadingCustomerLeads = true;
      })
      .addCase(getCustomerLeadsData.fulfilled, ($state, action) => {
        $state.loadingCustomerLeads = false;
        $state.responseCustomerLeads = action.payload;
      });
     builder
      .addCase(getCustomerRemindData.pending, ($state) => {
        $state.loadingCustomerRemind = true;
      })
      .addCase(getCustomerRemindData.fulfilled, ($state, action) => {
        $state.loadingCustomerRemind = false;
        $state.responseCustomerRemind = action.payload;
      });
    builder
      .addCase(getCustomerRemindNoteData.pending, ($state) => {
        $state.loadingCustomerRemindNote = true;
      })
      .addCase(getCustomerRemindNoteData.fulfilled, ($state, action) => {
        $state.loadingCustomerRemindNote = false;
        $state.responseCustomerRemindNote = action.payload;
      });
    builder
      .addCase(getCustomerFTypeByOwner.pending, ($state) => {
        $state.responseCustomerFTypeLoading = true;
      })
      .addCase(getCustomerFTypeByOwner.fulfilled, ($state, action) => {
        $state.responseCustomerFTypeLoading = false;
        $state.responseCustomerFType = action.payload;
      });
  },
});

export const {} = pointSlice.actions;

export default pointSlice.reducer;
