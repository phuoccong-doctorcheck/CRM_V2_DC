/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable array-callback-return */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";

import { DropdownData } from "components/atoms/Dropdown";
import { toast } from "react-toastify";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */

import {
  getListAfterExams,
  getListUserGuids,
  getStatisticAfterExams,
  getUserGuidsDetail,
  initAfterExams,
} from "services/api/afterexams";
import {
  ListAfterExams,
  RequestListAfterExams,
  RespInitAfterExams,
  StatisticAfterExams,
  UserGuidListResp,
  UserguidsAfterExamsItemType,
  detailUserGuid,
  UserGuidListResp2
} from "services/api/afterexams/types";
import { clearTimeout } from "timers";
// import { ConnectDB } from 'utils/indexDB';

interface AfterExamsState {
  userguidsAfterExams: UserguidsAfterExamsItemType[];
  stateAfterExams: DropdownData[];
  dataList: ListAfterExams;
  isLoadingAfterExam: boolean;
  afterExamsStatistic: StatisticAfterExams;
  listUserGuids2: UserGuidListResp2;
  listUserGuids: UserGuidListResp;
  loadingListUserGuids: boolean;
  detailUserGuidData: detailUserGuid;
  loadingDetailUserGuid: boolean;
}

const initialState: AfterExamsState = {
  userguidsAfterExams: [],
  stateAfterExams: [],
  dataList: {
    data: {
      data: [],
      paging: {
        page_number: 0,
        page_size: 0,
        total_count: 0,
        total_page: 0,
        has_previous_page: false,
        has_next_page: false,
      },
    },
    message: "",
    status: false,
    total_items: 0,
    client_ip: "",
  },
  isLoadingAfterExam: false,
  afterExamsStatistic: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  },
  listUserGuids2: {
    data: undefined as any,
    message: "",
    status: false,
    total_items: 0,
    client_ip: "",
  },
  listUserGuids: {
    data: undefined as any,
    message: "",
    status: false,
    client_ip: "",
  },
  loadingListUserGuids: false,
  detailUserGuidData: {
    data: undefined as any,
    message: "",
    status: false,
    client_ip: "",
  },
  loadingDetailUserGuid: false,
};
// xử lý gắn dữ liệu vào redux
export const getInitAfterExams = createAsyncThunk<
  RespInitAfterExams,
  void,
  { rejectValue: any }
>("mapsReducer/getProjectAction", async (_, { rejectWithValue }) => {
  try {
    const response = await initAfterExams();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getListUserGuidsCRM = createAsyncThunk<
UserGuidListResp2,
  any,
  { rejectValue: any }
>("mapsReducer/getListUserGuidsAction", async (data, { rejectWithValue }) => {
  try {
    const response = await getListUserGuids(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getListToStoreAfterExams = createAsyncThunk<
  ListAfterExams,
  RequestListAfterExams,
  { rejectValue: any }
>(
  "mapsReducer/getListToStoreAfterExamsAction",
  async (data: RequestListAfterExams, { rejectWithValue }) => {
    try {
      const response = await getListAfterExams(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStatisticAllowRangeDate = createAsyncThunk<
  StatisticAfterExams,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getStatisticAllowRangeDateAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getStatisticAfterExams(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getDtailUserGuidById = createAsyncThunk<
  detailUserGuid,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getDtailUserGuidByIdAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getUserGuidsDetail(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const AfterExamsSlice = createSlice({
  name: "AfterExamsReducer",
  initialState,
  reducers: {
    // setItemDetail($state, action: PayloadAction<RowData>) {
    //   $state.itemDetail = action.payload;
    // },
  },
  extraReducers(builder) {
    builder.addCase(getInitAfterExams.fulfilled, ($state, action) => {
      const { stages, userguids } = action.payload.data;
      const newStages: DropdownData[] = [];
      const newUserguids: UserguidsAfterExamsItemType[] = [];
      /*  */
      stages?.length &&
        stages.map((item) => {
          const convertStages = {
            id: item.id,
            label: item.name,
            value: item.id,
          };
          newStages.push(convertStages);
        });

      userguids?.length &&
        userguids.map((userInfo) => {
          newUserguids.push(userInfo);
        });

      localStorage.setItem("stages", JSON.stringify(newStages));
      localStorage.setItem("userguids", JSON.stringify(newUserguids));
      $state.stateAfterExams = newStages;
      $state.userguidsAfterExams = newUserguids;
    });
    builder
      .addCase(getListToStoreAfterExams.pending, ($state, action) => {
        $state.isLoadingAfterExam = true;
      })
      .addCase(getListToStoreAfterExams.fulfilled, ($state, action) => {
        $state.isLoadingAfterExam = false;
        $state.dataList = action.payload;
        if (!action.payload.status) {
          toast.error(action.payload.message);
        }
      });
    builder.addCase(getStatisticAllowRangeDate.fulfilled, ($state, action) => {
      $state.afterExamsStatistic = action.payload;
    });
    builder
      .addCase(getListUserGuidsCRM.pending, ($state, action) => {
        $state.loadingListUserGuids = true;
      })
      .addCase(getListUserGuidsCRM.fulfilled, ($state, action) => {
        $state.listUserGuids2 = action.payload;
        $state.loadingListUserGuids = false;
      });
    builder
      .addCase(getDtailUserGuidById.pending, ($state, action) => {
        $state.loadingDetailUserGuid = true;
      })
      .addCase(getDtailUserGuidById.fulfilled, ($state, action) => {
        $state.detailUserGuidData = action.payload;
        $state.loadingDetailUserGuid = false;
      });
  },
});

export const {} = AfterExamsSlice.actions;

export default AfterExamsSlice.reducer;
