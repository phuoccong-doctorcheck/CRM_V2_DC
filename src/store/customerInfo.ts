/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { getCustomerById, getNoteByCustomerID, getNoteCR, getNoteLog } from "services/api/beforeExams";
import { DataCustomer, GetListNotes, GetListNotesCR, InteractionHistoryResponse } from "services/api/beforeExams/types";
import {
  getCardSurvey,
  getCardSurveyPortrait,
  getCategoriesByCustomer,
  getCustomerTask,
  getCustomerTask1,
  getListExternalFie,
  getVisitResultCategory,
} from "services/api/customerInfo";
import {
  CategotiesCustomer,
  ExternalFileResp,
  ResponseGetTask,
  RespSurvey,
  Surveynotices,
  TaskResp,
} from "services/api/customerInfo/types";

interface ExampleState {
  respCustomerInfo: DataCustomer;
  loadingRespCustomerInfo: boolean;
  noteList: GetListNotes;
  noteListLoading: boolean;
  resultsCategories: CategotiesCustomer;
  resultsCategorieLoading: boolean;
  listTask: ResponseGetTask;
  listTaskById: ResponseGetTask;
  listExternalFile: ExternalFileResp;
  pendingExternalFile: boolean;
  notfound: boolean;
  isGetCustomerSuccess: boolean;
  respSurveyPortrait: any;
  responseSurvey: any;
  surveyNotices: Surveynotices;
  respMyTask: TaskResp;
  loadingTask: boolean;
  loadingTaskById: boolean;
  noteLog: InteractionHistoryResponse;
  loadingNoteLog: boolean;
    noteListCR: GetListNotesCR;
  noteListLoadingCR: boolean;
}

const initialState: ExampleState = {
  notfound: false,
  loadingTask: false,
  loadingTaskById: false,
  surveyNotices: { visibility: undefined as any, card: undefined as any, },
  responseSurvey: { data: undefined as any, message: "", status: false, client_ip: "", },
  respCustomerInfo: { data: undefined as any,touchpointlogs: undefined as any ,message: "", status: false, total_items: 0, client_ip: "", },
  respMyTask: { data: undefined as any, message: "", status: false, total_items: 0, client_ip: "", },
  noteList: { data: [], message: "", status: false, total_items: 0, client_ip: "", } as any,
  noteListLoading: false,
  resultsCategories: { data: undefined as any, message: "", status: false, client_ip: "", } as any,
  resultsCategorieLoading: false,
  listTask: { data: undefined as any, message: "", status: false, client_ip: "", } as any,
  listTaskById: { data: undefined as any, message: "", status: false, client_ip: "", } as any,
  listExternalFile: { data: undefined as any, message: "", status: false, client_ip: "", } as any,
  pendingExternalFile: false,
  isGetCustomerSuccess: false,
  respSurveyPortrait: undefined,
  loadingRespCustomerInfo: false,
  loadingNoteLog: false,
  noteLog: { data: [], message: "", status: false, total_items: 0, client_ip: "", } as any,
     noteListCR: { data: [], message: "", status: false, total_items: 0, client_ip: "", } as any,
  noteListLoadingCR: false,
};
//// Redux lấy khách hàng theo ID
export const getInfosCustomerById = createAsyncThunk<
  DataCustomer,
  any,
  { rejectValue: any }
>("mapsReducer/getInfosCustomerById", async (data, { rejectWithValue }) => {
  try {
    const response = await getCustomerById(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
export const getListNotesCR = createAsyncThunk<
  GetListNotesCR,
  any,
  { rejectValue: any }
>("mapsReducer/getListNotesCRAction", async (id, { rejectWithValue }) => {
  try {
    const response = await getNoteCR(id);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
export const getListNotes = createAsyncThunk<
  GetListNotes,
  any,
  { rejectValue: any }
>("mapsReducer/getListNotesAction", async (id, { rejectWithValue }) => {
  try {
    const response = await getNoteByCustomerID(id);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
export const getListNotesLog = createAsyncThunk<
InteractionHistoryResponse,
  any,
  { rejectValue: any }
>("mapsReducer/getListNotesLogAction", async (id, { rejectWithValue }) => {
  try {
    const response = await getNoteLog(id);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
export const getCategoriesCustomer = createAsyncThunk<
  CategotiesCustomer,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getCategoriesCustomerAction",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getVisitResultCategory(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getTaskByCustomerID = createAsyncThunk<
  ResponseGetTask,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getTaskByCustomerIDAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCustomerTask1(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getListExternalFile = createAsyncThunk<
  ExternalFileResp,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getListExternalFileAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListExternalFie(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getGroupSurveyPortrait = createAsyncThunk<
  any,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getGroupSurveyPortraitAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCardSurveyPortrait(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSurveyCustomer = createAsyncThunk<
  RespSurvey,
  any,
  { rejectValue: any }
>("mapsReducer/getSurveyCustomerAction", async (data, { rejectWithValue }) => {
  try {
    const response = await getCardSurvey(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getMyTask = createAsyncThunk<TaskResp, any, { rejectValue: any }>(
  "mapsReducer/getMyTaskAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getCustomerTask(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const customerInfoSlice = createSlice({
  name: "customerInfoReducer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getInfosCustomerById.pending, ($state, action) => {
        $state.isGetCustomerSuccess = false;
        $state.loadingRespCustomerInfo = true;
      })
      .addCase(getInfosCustomerById.fulfilled, ($state, action) => {
        $state.isGetCustomerSuccess = true;
           $state.loadingRespCustomerInfo = false;
        if ("data" in action.payload) {
          $state.notfound = false;
          $state.respCustomerInfo = action.payload;
        } else {
          $state.notfound = true;
          $state.respCustomerInfo = action.payload;
        }
      });
    builder
      .addCase(getListNotes.pending, ($state, action) => {
        $state.noteListLoading = false;
      })
      .addCase(getListNotes.fulfilled, ($state, action) => {
        $state.noteListLoading = false;
        $state.noteList = action.payload;
      });
    builder
      .addCase(getCategoriesCustomer.pending, ($state, action) => {
        $state.resultsCategorieLoading = true;
      })
      .addCase(getCategoriesCustomer.fulfilled, ($state, action) => {
        $state.resultsCategorieLoading = false;
        $state.resultsCategories = action.payload;
      });
       builder
      .addCase(getListNotesCR.pending, ($state, action) => {
        $state.noteListLoadingCR = false;
      })
      .addCase(getListNotesCR.fulfilled, ($state, action) => {
        $state.noteListLoadingCR = true;
        $state.noteListCR = action.payload;
      });
      builder
      .addCase(getListNotesLog.pending, ($state, action) => {
        $state.loadingNoteLog = true;
      })
      .addCase(getListNotesLog.fulfilled, ($state, action) => {
        $state.loadingNoteLog = false;
        $state.noteLog = action.payload;
      });
    builder
      .addCase(getTaskByCustomerID.pending, ($state, action) => {
        $state.loadingTaskById = true;
      })
      .addCase(getTaskByCustomerID.fulfilled, ($state, action) => {
        $state.loadingTaskById = false;
        $state.listTaskById = action.payload;
      });
    builder
      .addCase(getListExternalFile.pending, ($state, action) => {
        $state.pendingExternalFile = true;
      })
      .addCase(getListExternalFile.fulfilled, ($state, action) => {
        $state.listExternalFile = action.payload;
        $state.pendingExternalFile = false;
      });
    builder.addCase(getGroupSurveyPortrait.fulfilled, ($state, action) => {
      $state.respSurveyPortrait = action.payload;
    });
    builder.addCase(getSurveyCustomer.fulfilled, ($state, action) => {
      if (action.payload?.data) {
        const { survey, surveynotices } = action.payload?.data;
        if (!_.isUndefined(action.payload.data)) {
          const dataCustomize = [
            {
              id: 1,
              type: "text",
              question: survey?.card?.q1,
              anwers: survey?.card?.q1_text,
            },
            {
              id: 2,
              type: "text",
              question: survey?.card?.q2,
              anwers: survey?.card?.q2_text,
            },
            {
              id: 3,
              type: "text",
              question: survey?.card?.q3,
              anwers: survey?.card?.q3_text,
            },
            {
              id: 4,
              type: "text",
              question: survey?.card?.q4,
              anwers: survey?.card?.q4_text,
            },
            {
              id: 5,
              type: "text",
              question: survey?.card?.q5,
              anwers: survey?.card?.q5_text,
            },
            {
              id: 6,
              type: "radio",
              question: survey?.card?.q6,
              child: [
                {
                  child_id: 0,
                  child_question: "Bất thường xét nghiệm gan/ tăng men gan",
                  child_answer: [
                    survey?.card?.q6_tmg_no,
                    survey?.card?.q6_tmg_yes,
                    survey?.card?.q6_tmg_unknown,
                  ],
                },
                {
                  child_id: 1,
                  child_question: "Viêm gan",
                  child_answer: [
                    survey?.card?.q6_vg_no,
                    survey?.card?.q6_vg_yes,
                    survey?.card?.q6_vg_unknown,
                  ],
                },
                {
                  child_id: 2,
                  child_question: "Bệnh gan mật",
                  child_answer: [
                    survey?.card?.q6_bgm_no,
                    survey?.card?.q6_bgm_yes,
                    survey?.card?.q6_bgm_unknown,
                  ],
                },
                {
                  child_id: 3,
                  child_question: "Viêm loét dạ dày tá tràng",
                  child_answer: [
                    survey?.card?.q6_vldt_no,
                    survey?.card?.q6_vldt_yes,
                    survey?.card?.q6_vldt_unknown,
                  ],
                },
                {
                  child_id: 4,
                  child_question: "Nhiễm Hp",
                  child_answer: [
                    survey?.card?.q6_nhp_no,
                    survey?.card?.q6_nhp_yes,
                    survey?.card?.q6_nhp_unknown,
                  ],
                },
                {
                  child_id: 5,
                  child_question: "Viêm loét đại tràng",
                  child_answer: [
                    survey?.card?.q6_vldt_no,
                    survey?.card?.q6_vldt_yes,
                    survey?.card?.q6_vldt_unknown,
                  ],
                },
                {
                  child_id: 6,
                  child_question: "Polyp đại trực tràng",
                  child_answer: [
                    survey?.card?.q6_pldtt_no,
                    survey?.card?.q6_pldtt_yes,
                    survey?.card?.q6_pldtt_unknown,
                  ],
                },
                {
                  child_id: 7,
                  child_question: "Trĩ",
                  child_answer: [
                    survey?.card?.q6_tri_no,
                    survey?.card?.q6_tri_yes,
                    survey?.card?.q6_tri_unknown,
                  ],
                },
                {
                  child_id: 8,
                  child_question: "Thiếu máu",
                  child_answer: [
                    survey?.card?.q6_tm_no,
                    survey?.card?.q6_tm_yes,
                    survey?.card?.q6_tm_unknown,
                  ],
                },
                {
                  child_id: 9,
                  child_question: "Rối loạn đông cầm máu",
                  child_answer: [
                    survey?.card?.q6_rldcm_no,
                    survey?.card?.q6_rldcm_yes,
                    survey?.card?.q6_rldcm_unknown,
                  ],
                },
                {
                  child_id: 10,
                  child_question: "Bệnh lý huyết học khác",
                  child_answer: [
                    survey?.card?.q6_blhhk_no,
                    survey?.card?.q6_blhhk_yes,
                    survey?.card?.q6_blhhk_unknown,
                  ],
                },
                {
                  child_id: 11,
                  child_question:
                    "Động kinh hoặc đột quỵ/ tai biến mạch máu não",
                  child_answer: [
                    survey?.card?.q6_dkhdq_no,
                    survey?.card?.q6_dkhdq_yes,
                    survey?.card?.q6_dkhdq_unknown,
                  ],
                },
                {
                  child_id: 12,
                  child_question: "Tăng huyết áp",
                  child_answer: [
                    survey?.card?.q6_tha_no,
                    survey?.card?.q6_tha_yes,
                    survey?.card?.q6_tha_unknown,
                  ],
                },
                {
                  child_id: 13,
                  child_question: "Bệnh tim mạch",
                  child_answer: [
                    survey?.card?.q6_btm_no,
                    survey?.card?.q6_btm_yes,
                    survey?.card?.q6_btm_unknown,
                  ],
                },
                {
                  child_id: 14,
                  child_question: "Đái tháo đường",
                  child_answer: [
                    survey?.card?.q6_dtd_no,
                    survey?.card?.q6_dtd_yes,
                    survey?.card?.q6_dtd_unknown,
                  ],
                },
                {
                  child_id: 15,
                  child_question: "Rối loạn tâm thần kinh",
                  child_answer: [
                    survey?.card?.q6_rlttk_no,
                    survey?.card?.q6_rlttk_yes,
                    survey?.card?.q6_rlttk_unknown,
                  ],
                },
                {
                  child_id: 16,
                  child_question: "Lao phổi",
                  child_answer: [
                    survey?.card?.q6_lp_no,
                    survey?.card?.q6_lp_yes,
                    survey?.card?.q6_lp_unknown,
                  ],
                },
                {
                  child_id: 17,
                  child_question: "Bệnh phổi hoặc hen suyễn",
                  child_answer: [
                    survey?.card?.q6_bphhs_no,
                    survey?.card?.q6_bphhs_yes,
                    survey?.card?.q6_bphhs_unknown,
                  ],
                },
                {
                  child_id: 18,
                  child_question: "Bệnh tuyến giáp",
                  child_answer: [
                    survey?.card?.q6_btg_no,
                    survey?.card?.q6_btg_yes,
                    survey?.card?.q6_btg_unknown,
                  ],
                },
                {
                  child_id: 19,
                  child_question: "Thấp khớp",
                  child_answer: [
                    survey?.card?.q6_tk_no,
                    survey?.card?.q6_tk_yes,
                    survey?.card?.q6_tk_unknown,
                  ],
                },
                {
                  child_id: 20,
                  child_question: "HIV/AIDS",
                  child_answer: [
                    survey?.card?.q6_hiv_no,
                    survey?.card?.q6_hiv_yes,
                    survey?.card?.q6_hiv_unknown,
                  ],
                },
                {
                  child_id: 21,
                  child_question: "Ung thư",
                  child_answer: [
                    survey?.card?.q6_ut_no,
                    survey?.card?.q6_ut_yes,
                    survey?.card?.q6_ut_unknown,
                  ],
                },
                {
                  child_id: 22,
                  child_type: "text",
                  child_question: "Ghi chú (nếu có):",
                  child_answer: survey?.card?.q6_note_text,
                },
              ],
            },
            {
              id: 7,
              type: "text_row",
              question: survey?.card?.q7,
              child: [
                {
                  child_id: 0,
                  child_answer: [
                    { anwers: survey?.card?.q7_bl1_text, title: "Bệnh lý:" },
                    { anwers: survey?.card?.q7_n1_text, title: "Năm:" },
                    {
                      anwers: survey?.card?.q7_bc1_text,
                      title: "Biến chứng (nếu có):",
                    },
                  ],
                },
                {
                  child_id: 1,
                  child_answer: [
                    { anwers: survey?.card?.q7_bl2_text, title: "Bệnh lý:" },
                    { anwers: survey?.card?.q7_n2_text, title: "Năm:" },
                    {
                      anwers: survey?.card?.q7_bc2_text,
                      title: "Biến chứng (nếu có):",
                    },
                  ],
                },
                {
                  child_id: 2,
                  child_answer: [
                    { anwers: survey?.card?.q7_bl3_text, title: "Bệnh lý:" },
                    { anwers: survey?.card?.q7_n3_text, title: "Năm:" },
                    {
                      anwers: survey?.card?.q7_bc3_text,
                      title: "Biến chứng (nếu có):",
                    },
                  ],
                },
              ],
            },
            {
              id: 8,
              type: "yes_no",
              question: survey?.card?.q8,
              anwser: [survey?.card?.q8_yes, survey?.card?.q8_no],
            },
            {
              id: 9,
              type: "yes_no",
              question: survey?.card?.q9,
              anwser: [survey?.card?.q9_yes, survey?.card?.q9_no],
            },
            {
              id: 10,
              type: "text",
              question: survey?.card?.q10,
              anwers: survey?.card?.q10_text,
            },
            {
              id: 11,
              type: "text_row",
              question: survey?.card?.q11,
              child: [
                {
                  child_id: 0,
                  child_answer: [
                    {
                      anwers: survey?.card?.q11_pt1_text,
                      title: "Phẫu thuật:",
                    },
                    { anwers: survey?.card?.q11_n1_text, title: "Năm:" },
                    {
                      anwers: survey?.card?.q11_bc1_text,
                      title: "Biến chứng (nếu có):",
                    },
                  ],
                },
                {
                  child_id: 1,
                  child_answer: [
                    {
                      anwers: survey?.card?.q11_pt2_text,
                      title: "Phẫu thuật:",
                    },
                    { anwers: survey?.card?.q11_n2_text, title: "Năm:" },
                    {
                      anwers: survey?.card?.q11_bc2_text,
                      title: "Biến chứng (nếu có):",
                    },
                  ],
                },
                {
                  child_id: 2,
                  child_answer: [
                    {
                      anwers: survey?.card?.q11_pt3_text,
                      title: "Phẫu thuật:",
                    },
                    { anwers: survey?.card?.q11_n3_text, title: "Năm:" },
                    {
                      anwers: survey?.card?.q11_bc3_text,
                      title: "Biến chứng (nếu có):",
                    },
                  ],
                },
              ],
            },
            {
              id: 12,
              type: "radio_custom",
              question: survey?.card?.q12,
              child: [
                {
                  child_id: 0,
                  title: "Hút thuốc lá",
                  child_answer: [
                    {
                      anwers: survey?.card?.q12_htl_cth,
                      title: "Chưa từng hút",
                    },
                    {
                      anwers: survey?.card?.q12_htl_thvdb,
                      title: "Từng hút và đã bỏ:",
                    },
                    {
                      anwers: survey?.card?.q12_htl_hdch,
                      title: "Hiện đang còn hút",
                    },
                  ],
                },
                {
                  child_id: 1,
                  title: "Uống rượu bia",
                  child_answer: [
                    { anwers: survey?.card?.q12_urb_yes, title: "Có" },
                    { anwers: survey?.card?.q12_urb_no, title: "Không" },
                  ],
                },
                {
                  child_id: 2,
                  title: "Sử dụng thuốc giảm đau",
                  child_answer: [
                    { anwers: survey?.card?.q12_sdtgd_yes, title: "Có" },
                    { anwers: survey?.card?.q12_sdtgd_no, title: "Không" },
                  ],
                },
              ],
            },
            {
              id: 13,
              type: "text",
              question: survey?.card?.q13,
              anwers: survey?.card?.q13_text,
            },
            {
              id: 14,
              type: "text_row",
              question: survey?.card?.q14,
              child: [
                {
                  child_id: 0,
                  child_answer: [
                    { anwers: survey?.card?.q14_t1_text, title: "Thuốc:" },
                    { anwers: survey?.card?.q14_l1_text, title: "Liều:" },
                    {
                      anwers: survey?.card?.q14_ls1_text,
                      title: "Số lần uống mỗi ngày:",
                    },
                  ],
                },
                {
                  child_id: 1,
                  child_answer: [
                    { anwers: survey?.card?.q14_t2_text, title: "Thuốc:" },
                    { anwers: survey?.card?.q14_l2_text, title: "Liều:" },
                    {
                      anwers: survey?.card?.q14_ls2_text,
                      title: "Số lần uống mỗi ngày:",
                    },
                  ],
                },
                {
                  child_id: 2,
                  child_answer: [
                    { anwers: survey?.card?.q14_t3_text, title: "Thuốc:" },
                    { anwers: survey?.card?.q14_l3_text, title: "Liều:" },
                    {
                      anwers: survey?.card?.q14_ls3_text,
                      title: "Số lần uống mỗi ngày:",
                    },
                  ],
                },
              ],
            },
            {
              id: 15,
              type: "text",
              question: survey?.card?.q15,
              anwers: survey?.card?.q15_text,
            },
            {
              id: 16,
              type: "field",
              question: survey?.card?.q16,
              child: [
                { id: 0, title: "Bố ruột:", anwser: survey?.card?.q16_br_text },
                { id: 1, title: "Mẹ ruột:", anwser: survey?.card?.q16_mr_text },
                {
                  id: 2,
                  title: "Anh/Em trai ruột:",
                  anwser: survey?.card?.q16_aer_text,
                },
                {
                  id: 3,
                  title: "Chị/Em gái ruột:",
                  anwser: survey?.card?.q16_cer_text,
                },
              ],
            },
            {
              id: 17,
              type: "radio",
              question: survey?.card?.q17,
              child: [
                {
                  child_id: 0,
                  child_question: "Ung thư vú",
                  child_answer: [
                    survey?.card?.q17_utv_no,
                    survey?.card?.q17_utv_yes,
                    survey?.card?.q17_utv_unknown,
                  ],
                },
                {
                  child_id: 1,
                  child_question: "Ợ nóng mạn tính",
                  child_answer: [
                    survey?.card?.q17_onmt_no,
                    survey?.card?.q17_onmt_yes,
                    survey?.card?.q17_onmt_unknown,
                  ],
                },
                {
                  child_id: 2,
                  child_question: "Ung thư đại tràng",
                  child_answer: [
                    survey?.card?.q17_utdt_no,
                    survey?.card?.q17_utdt_yes,
                    survey?.card?.q17_utdt_unknown,
                  ],
                },
                {
                  child_id: 3,
                  child_question: "Polyp đại tràng",
                  child_answer: [
                    survey?.card?.q17_pldt_no,
                    survey?.card?.q17_pldt_yes,
                    survey?.card?.q17_pldt_unknown,
                  ],
                },
                {
                  child_id: 4,
                  child_question: "Bệnh Crohn/ Viêm loét đại tràng",
                  child_answer: [
                    survey?.card?.q17_vldt_no,
                    survey?.card?.q17_vldt_yes,
                    survey?.card?.q17_vldt_unknown,
                  ],
                },
                {
                  child_id: 5,
                  child_question: "Đái tháo đường",
                  child_answer: [
                    survey?.card?.q17_dtd_no,
                    survey?.card?.q17_dtd_yes,
                    survey?.card?.q17_dtd_unknown,
                  ],
                },
                {
                  child_id: 6,
                  child_question: "Rối loạn tâm thần",
                  child_answer: [
                    survey?.card?.q17_rltt_no,
                    survey?.card?.q17_rltt_yes,
                    survey?.card?.q17_rltt_unknown,
                  ],
                },
                {
                  child_id: 7,
                  child_question: "Ung thư thực quản/ rối loạn thực quản",
                  child_answer: [
                    survey?.card?.q17_uttq_no,
                    survey?.card?.q17_uttq_yes,
                    survey?.card?.q17_uttq_unknown,
                  ],
                },
                {
                  child_id: 8,
                  child_question: "Bệnh túi mật",
                  child_answer: [
                    survey?.card?.q17_btm_no,
                    survey?.card?.q17_btm_yes,
                    survey?.card?.q17_btm_unknown,
                  ],
                },
                {
                  child_id: 9,
                  child_question: "Bệnh tim mạch",
                  child_answer: [
                    survey?.card?.q17_btim_no,
                    survey?.card?.q17_btim_yes,
                    survey?.card?.q17_btim_unknown,
                  ],
                },
                {
                  child_id: 10,
                  child_question: "Tăng huyết áp",
                  child_answer: [
                    survey?.card?.q17_tha_no,
                    survey?.card?.q17_tha_yes,
                    survey?.card?.q17_tha_unknown,
                  ],
                },
                {
                  child_id: 11,
                  child_question: "Bệnh thận",
                  child_answer: [
                    survey?.card?.q17_bt_no,
                    survey?.card?.q17_bt_yes,
                    survey?.card?.q17_bt_unknown,
                  ],
                },
                {
                  child_id: 12,
                  child_question: "Ung thư buồng trứng",
                  child_answer: [
                    survey?.card?.q17_utbt_no,
                    survey?.card?.q17_utbt_yes,
                    survey?.card?.q17_utbt_unknown,
                  ],
                },
                {
                  child_id: 13,
                  child_question: "Ung thư tụy/bệnh lý tụy",
                  child_answer: [
                    survey?.card?.q17_utt_no,
                    survey?.card?.q17_utt_yes,
                    survey?.card?.q17_utt_unknown,
                  ],
                },
                {
                  child_id: 14,
                  child_question: "Loét dạ dày – tá tràng",
                  child_answer: [
                    survey?.card?.q17_lddtt_no,
                    survey?.card?.q17_lddtt_yes,
                    survey?.card?.q17_lddtt_unknown,
                  ],
                },
                {
                  child_id: 15,
                  child_question: "Polyp dạ dày/ ung thư dạ dày",
                  child_answer: [
                    survey?.card?.q17_pldd_no,
                    survey?.card?.q17_pldd_yes,
                    survey?.card?.q17_pldd_unknown,
                  ],
                },
                {
                  child_id: 16,
                  child_question: "Đột quỵ/ tai biến mạch máu não/ động kinh",
                  child_answer: [
                    survey?.card?.q17_dq_no,
                    survey?.card?.q17_dq_yes,
                    survey?.card?.q17_dq_unknown,
                  ],
                },
                {
                  child_id: 17,
                  child_question: "Các loại ung thư khác",
                  child_answer: [
                    survey?.card?.q17_utk_no,
                    survey?.card?.q17_utk_yes,
                    survey?.card?.q17_utk_unknown,
                  ],
                },
              ],
            },
            {
              id: 18,
              type: "group_radio",
              question: survey?.card?.q18,
              child: [
                {
                  id: 1,
                  title: "Mệt mỏi",
                  anwers: [survey?.card?.q18_mm_yes, survey?.card?.q18_mm_no],
                },
                {
                  id: 2,
                  title: "Chán ăn",
                  anwers: [survey?.card?.q18_ca_yes, survey?.card?.q18_ca_no],
                },
                {
                  id: 3,
                  title: "Sút cân",
                  anwers: [survey?.card?.q18_sc_yes, survey?.card?.q18_sc_no],
                },
                {
                  id: 4,
                  title: "Sốt",
                  anwers: [survey?.card?.q18_s_yes, survey?.card?.q18_s_no],
                },
                {
                  id: 5,
                  title: "Lạnh run",
                  anwers: [survey?.card?.q18_lr_yes, survey?.card?.q18_lr_no],
                },
                {
                  id: 6,
                  title: "Đổ mồ hôi trộm về đêm",
                  anwers: [
                    survey?.card?.q18_dmhtvd_yes,
                    survey?.card?.q18_dmhtvd_no,
                  ],
                },
                {
                  id: 7,
                  title: "Các vấn đề về mắt, mũi, tai, họng",
                  anwers: [
                    survey?.card?.q18_cvdvmmth_yes,
                    survey?.card?.q18_cvdvmmth_no,
                  ],
                },
                {
                  id: 8,
                  title: "Chảy máu mũi",
                  anwers: [survey?.card?.q18_cmm_yes, survey?.card?.q18_cmm_no],
                },
                {
                  id: 9,
                  title: "Loét miệng",
                  anwers: [survey?.card?.q18_lm_yes, survey?.card?.q18_lm_no],
                },
                {
                  id: 10,
                  title: "Đau mắt",
                  anwers: [survey?.card?.q18_dm_yes, survey?.card?.q18_dm_no],
                },
                {
                  id: 11,
                  title: "Ho khan",
                  anwers: [survey?.card?.q18_hk_yes, survey?.card?.q18_hk_no],
                },
                {
                  id: 12,
                  title: "Ho đàm",
                  anwers: [survey?.card?.q18_hd_yes, survey?.card?.q18_hd_no],
                },
                {
                  id: 13,
                  title: "Khò khè",
                  anwers: [survey?.card?.q18_kk_yes, survey?.card?.q18_kk_no],
                },
                {
                  id: 14,
                  title: "Khó thở khi gắng sức",
                  anwers: [
                    survey?.card?.q18_ktkgs_yes,
                    survey?.card?.q18_ktkgs_no,
                  ],
                },
                {
                  id: 15,
                  title: "Khó thở cả khi nghỉ ngơi",
                  anwers: [
                    survey?.card?.q18_ktcknn_yes,
                    survey?.card?.q18_ktcknn_no,
                  ],
                },
                {
                  id: 16,
                  title: "Khó thở cả khi nằm",
                  anwers: [
                    survey?.card?.q18_ktckn_yes,
                    survey?.card?.q18_ktckn_no,
                  ],
                },
                {
                  id: 17,
                  title: "Đau ngực",
                  anwers: [survey?.card?.q18_dn_yes, survey?.card?.q18_dn_no],
                },
                {
                  id: 18,
                  title: "Tim đập không đều",
                  anwers: [
                    survey?.card?.q18_tdkd_yes,
                    survey?.card?.q18_tdkd_no,
                  ],
                },
                {
                  id: 19,
                  title: "Phù chân",
                  anwers: [survey?.card?.q18_pc_yes, survey?.card?.q18_pc_no],
                },
                {
                  id: 20,
                  title: "Đau nhức chân khi đi lại hoặc khi tập thể thao",
                  anwers: [survey?.card?.q18_dnc_yes, survey?.card?.q18_dnc_no],
                },
                {
                  id: 21,
                  title: "Đau nhức chân cả khi nghỉ ngơi",
                  anwers: [
                    survey?.card?.q18_dnccknn_yes,
                    survey?.card?.q18_dnccknn_no,
                  ],
                },
                {
                  id: 22,
                  title: "Đau lưng",
                  anwers: [survey?.card?.q18_dl_yes, survey?.card?.q18_dl_no],
                },
                {
                  id: 23,
                  title: "Không thể chịu được nóng hoặc lạnh",
                  anwers: [
                    survey?.card?.q18_ktcdnhl_yes,
                    survey?.card?.q18_ktcdnhl_no,
                  ],
                },
                {
                  id: 24,
                  title: "Run tay",
                  anwers: [survey?.card?.q18_rt_yes, survey?.card?.q18_rt_no],
                },
                {
                  id: 25,
                  title: "Rậm lông tóc",
                  anwers: [survey?.card?.q18_rlt_yes, survey?.card?.q18_rlt_no],
                },
                {
                  id: 26,
                  title: "Lông tóc thưa",
                  anwers: [survey?.card?.q18_ltt_yes, survey?.card?.q18_ltt_no],
                },
                {
                  id: 27,
                  title: "Khát nước nhiều",
                  anwers: [survey?.card?.q18_knn_yes, survey?.card?.q18_knn_no],
                },
                {
                  id: 28,
                  title: "Đi tiểu nhiều",
                  anwers: [survey?.card?.q18_dtn_yes, survey?.card?.q18_dtn_no],
                },
                {
                  id: 29,
                  title: "Nuốt khó/ nghẹn",
                  anwers: [survey?.card?.q18_nkn_yes, survey?.card?.q18_nkn_no],
                },
                {
                  id: 30,
                  title: "Nuốt đau",
                  anwers: [survey?.card?.q18_nd_yes, survey?.card?.q18_nd_no],
                },
                {
                  id: 31,
                  title: "Ợ nóng/ Ợ chua",
                  anwers: [
                    survey?.card?.q18_onoc_yes,
                    survey?.card?.q18_onoc_no,
                  ],
                },
                {
                  id: 32,
                  title: "Ợ trớ thức ăn/dịch dạ dày",
                  anwers: [
                    survey?.card?.q18_octa_yes,
                    survey?.card?.q18_octa_no,
                  ],
                },
                {
                  id: 33,
                  title: "Buồn nôn",
                  anwers: [survey?.card?.q18_bn_yes, survey?.card?.q18_bn_no],
                },
                {
                  id: 34,
                  title: "Nôn",
                  anwers: [survey?.card?.q18_n_yes, survey?.card?.q18_n_no],
                },
                {
                  id: 35,
                  title: "Đau bụng",
                  anwers: [survey?.card?.q18_db_yes, survey?.card?.q18_db_no],
                },
                {
                  id: 36,
                  title: "Chướng bụng",
                  anwers: [survey?.card?.q18_cb_yes, survey?.card?.q18_cb_no],
                },
                {
                  id: 37,
                  title: "Tiêu chảy",
                  anwers: [survey?.card?.q18_tc_yes, survey?.card?.q18_tc_no],
                },
                {
                  id: 38,
                  title: "Táo bón",
                  anwers: [survey?.card?.q18_tb_yes, survey?.card?.q18_tb_no],
                },
                {
                  id: 39,
                  title: "Đi cầu ra máu",
                  anwers: [
                    survey?.card?.q18_dcrm_yes,
                    survey?.card?.q18_dcrm_no,
                  ],
                },
                {
                  id: 40,
                  title: "Vàng da",
                  anwers: [survey?.card?.q18_vd_yes, survey?.card?.q18_vd_no],
                },
                {
                  id: 41,
                  title: "Ngứa da mức độ nhiều",
                  anwers: [
                    survey?.card?.q18_ndmdn_yes,
                    survey?.card?.q18_ndmdn_no,
                  ],
                },
                {
                  id: 42,
                  title: "Đi cầu khó (phải rặn nhiều)",
                  anwers: [survey?.card?.q18_dck_yes, survey?.card?.q18_dck_no],
                },
                {
                  id: 43,
                  title: "Đi tiểu buốt",
                  anwers: [survey?.card?.q18_dtb_yes, survey?.card?.q18_dtb_no],
                },
                {
                  id: 44,
                  title: "Đau khớp",
                  anwers: [survey?.card?.q18_dk_yes, survey?.card?.q18_dk_no],
                },
                {
                  id: 45,
                  title: "Lo âu",
                  anwers: [survey?.card?.q18_la_yes, survey?.card?.q18_la_no],
                },
                {
                  id: 46,
                  title: "Trầm cảm",
                  anwers: [survey?.card?.q18_trc_yes, survey?.card?.q18_trc_no],
                },
                {
                  id: 47,
                  title: "Bị ngất",
                  anwers: [
                    survey?.card?.q18_bingat_yes,
                    survey?.card?.q18_bingat_no,
                  ],
                },
                {
                  id: 48,
                  title: "Chóng mặt",
                  anwers: [survey?.card?.q18_cm_yes, survey?.card?.q18_cm_no],
                },
                {
                  id: 49,
                  title:
                    "Nhìn đôi/ song thị (nhìn thấy hai hình ảnh của một đối tượng)",
                  anwers: [
                    survey?.card?.q18_ndsn_yes,
                    survey?.card?.q18_ndsn_no,
                  ],
                },
                {
                  id: 50,
                  title: "Mất thăng bằng hoặc khả năng phối hợp động tác",
                  anwers: [survey?.card?.q18_mtb_yes, survey?.card?.q18_mtb_no],
                },
                {
                  id: 51,
                  title: "Rối loạn ngôn ngữ",
                  anwers: [
                    survey?.card?.q18_rlnn_yes,
                    survey?.card?.q18_rlnn_no,
                  ],
                },
                {
                  id: 52,
                  title: "Teo tinh hoàn (đối với nam giới)",
                  anwers: [survey?.card?.q18_tth_yes, survey?.card?.q18_tth_no],
                },
                {
                  id: 53,
                  title: "Rối loạn kinh nguyệt (đối với nữ giới)",
                  anwers: [
                    survey?.card?.q18_rlkn_yes,
                    survey?.card?.q18_rlkn_no,
                  ],
                },
                {
                  id: 54,
                  title: "Bạn có đang mang thai? (đối với nữ giới)",
                  anwers: [
                    survey?.card?.q18_bcdmt_yes,
                    survey?.card?.q18_bcdmt_no,
                  ],
                },
              ],
            },
          ];
          $state.surveyNotices = surveynotices;
          $state.responseSurvey = dataCustomize;
        }
      }
    });

    builder.addCase(getMyTask.fulfilled, ($state, action) => {
      localStorage.setItem("myTask", JSON.stringify(action.payload));
      $state.respMyTask = action.payload;
    });
  },
});

export const { } = customerInfoSlice.actions;

export default customerInfoSlice.reducer;
