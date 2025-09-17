/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getFollowLeadsGrouped, getListTaskOfOneCustomer, getListTaskOfOneEmployee, getListTaskOfOneEmployeeSummary } from "services/api/tasks";
import {
  FollowResponse,
  TaskResponse,
  TaskResponseE,
  TaskSummaryResponse
} from "services/api/tasks/types";

interface TaskState {
  taskList: TaskResponse;
  loadingTaskList: boolean;
  taskListE: TaskResponseE;
  loadingTaskListE: boolean;
  taskListESummary: TaskSummaryResponse;
  loadingTaskListESummary: boolean;
  taskListFlo: FollowResponse;
  loadingTaskListFlo: boolean;
}

const initialState: TaskState = {
  taskList: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  },
  loadingTaskList: false,
  taskListE: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  },
  loadingTaskListE: false,
   taskListESummary: {
    data: [],
    message: "",
    status: false,
    client_ip: "",
  },
  loadingTaskListESummary: false,
  taskListFlo : {
    data: {
    my_task: [], // hoặc mảng Lead thật
    task_follow: {
      follow_7: [],
      follow_14: [],
      follow_23: [],
    },
  },

  message: "",
  status: true,
  client_ip: ""
  },
  loadingTaskListFlo: false,
};

export const getListTask = createAsyncThunk<
TaskResponse,
  { rejectValue: any }
>(
  "mapsReducer/getListTaskAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListTaskOfOneCustomer(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getListTaskFlo = createAsyncThunk<
FollowResponse,
  { rejectValue: any }
>(
  "mapsReducer/getListTaskFloAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getFollowLeadsGrouped(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getListTaskE = createAsyncThunk<
TaskResponseE,
  { rejectValue: any }
>(
  "mapsReducer/getListTaskEAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListTaskOfOneEmployee(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getListTaskESummary = createAsyncThunk<
TaskSummaryResponse,
  { rejectValue: any }
>(
  "mapsReducer/getListTaskESummaryAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListTaskOfOneEmployeeSummary(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const ListTaskSlice = createSlice({
  name: "listTaskReducer",
  initialState,
  reducers: {
    // setItemDetail($state, action: PayloadAction<RowData>) {
    //   $state.itemDetail = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
      .addCase(getListTask.pending, ($state, action) => {
        $state.loadingTaskList = true;
      })
      .addCase(getListTask.fulfilled, ($state, action) => {
        $state.loadingTaskList = false;
        $state.taskList = action.payload;
       
    
      });
      builder
      .addCase(getListTaskE.pending, ($state, action) => {
        $state.loadingTaskListE = true;
      })
      .addCase(getListTaskE.fulfilled, ($state, action) => {
        $state.loadingTaskListE = false;
        $state.taskListE = action.payload;
      });
      builder
      .addCase(getListTaskESummary.pending, ($state, action) => {
        $state.loadingTaskListESummary = true;
      })
      .addCase(getListTaskESummary.fulfilled, ($state, action) => {
        $state.loadingTaskListESummary = false;
        $state.taskListESummary = action.payload;
      });
     builder
      .addCase(getListTaskFlo.pending, ($state, action) => {
        $state.loadingTaskListFlo = true;
      })
      .addCase(getListTaskFlo.fulfilled, ($state, action) => {
        $state.loadingTaskListFlo = false;
        $state.taskListFlo = action.payload;
      });
  },
});

export const {} = ListTaskSlice.actions;

export default ListTaskSlice.reducer;
