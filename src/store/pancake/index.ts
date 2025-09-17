/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import {
  getConversationsByPageId,
  getListPagePancake,
  getListTagsByPageId,
  getMessageByCustomer,
  getUsersStatisticsPancake,
  postMessageByConversationId,
} from "services/pancake/channel";
import {
  ConversationItem,
  ListPages,
  PageActivated,
  RespConversation,
  RespListTag,
  RespMessage,
  StatisticUserResponse,
} from "services/pancake/channel/types";

export interface InfoAds {
  id_ads: string;
  title_ads: string;
  image_ads: string;
}

interface PancakeState {
  respListPage: ListPages;
  loadingRespListPage: boolean;
  respConversation: RespConversation;
  loadingConversation: boolean;
  respMessage: RespMessage;
  loadingMessage: boolean;
  respTag: RespListTag;
  /* danh sách page, conversation đã chọn */
  pageActive: PageActivated;
  conversationActive: ConversationItem;
  infoAds: InfoAds;
}

const initialState: PancakeState = {
  respListPage: {
    categorized: undefined as any,
    success: false,
  } as any,
  loadingRespListPage: false,
  respConversation: {
    conversations: [],
    success: false,
  } as any,
  loadingConversation: false,
  respMessage: undefined as any,
  loadingMessage: false,
  respTag: {
    tags: [],
  },
  conversationActive: undefined as any,
  pageActive: undefined as any,
  infoAds: undefined as any,
};

export const getListPageWithPancake = createAsyncThunk<
  ListPages,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getListPageWithPancakeAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getListPagePancake();
    
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getListConversationByPageId = createAsyncThunk<
  RespConversation,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getListConversationByPageIdAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getConversationsByPageId(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getListTagOfPage = createAsyncThunk<
  RespListTag,
  any,
  { rejectValue: any }
>("mapsReducer/getListTagOfPageAction", async (data, { rejectWithValue }) => {
  try {
    const response = await getListTagsByPageId(data);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getMessageByCustomerId = createAsyncThunk<
  RespMessage,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getMessageByCustomerIdAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getMessageByCustomer(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStatisticByUser = createAsyncThunk<
  StatisticUserResponse,
  any,
  { rejectValue: any }
>(
  "mapsReducer/getMessageByCustomerIdAction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getUsersStatisticsPancake(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const panCakeSlice = createSlice({
  name: "pancakeReducer",
  initialState,
  reducers: {
    postConversationActive($state, action: PayloadAction<ConversationItem>) {
      $state.conversationActive = action.payload;
    },
    postPageActive($state, action: PayloadAction<PageActivated>) {
      $state.pageActive = action.payload;
    },
    postMessageActive($state, action: PayloadAction<RespMessage>) {
      $state.respMessage = action.payload;
    },
    postSetInfoAdsMessageItem($state, action: PayloadAction<InfoAds>) {
      $state.infoAds = action.payload;
    },
  },
  extraReducers(builder) {
    /* Get List Page */
    builder
      .addCase(getListPageWithPancake.pending, ($state, action) => {
        $state.loadingRespListPage = true;
      })
      .addCase(getListPageWithPancake.fulfilled, ($state, action) => {
        const { categorized } = action.payload;

        const listPage: any[] = [];
        categorized?.activated?.length &&
          categorized.activated.map((activated) => {
            const pageItem = {
              page_id: activated.id,
              page_access_token: activated.settings?.page_access_token,
              platform: activated.platform,
              name: `${activated.platform} - ${activated?.name}`,
            };

            listPage.push(pageItem);
          });

        localStorage.setItem("listPage", JSON.stringify(listPage));

        $state.respListPage = action.payload;
        $state.loadingRespListPage = false;
      });
    /* Get Conversation */
    builder
      .addCase(getListConversationByPageId.pending, ($state, action) => {
        $state.loadingConversation = true;
      })
      .addCase(getListConversationByPageId.fulfilled, ($state, action) => {
        $state.respConversation = action.payload;
        $state.loadingConversation = false;
      });
    /* Get Message */
    builder
      .addCase(getMessageByCustomerId.pending, ($state, action) => {
        $state.loadingMessage = true;
      })
      .addCase(getMessageByCustomerId.fulfilled, ($state, action) => {
        $state.respMessage = action.payload;
        $state.loadingMessage = false;
      });
    /* Get Tag */
    builder.addCase(getListTagOfPage.fulfilled, ($state, action) => {
      $state.respTag = action.payload;
    });
  },
});

export const {
  postConversationActive,
  postPageActive,
  postMessageActive,
  postSetInfoAdsMessageItem,
} = panCakeSlice.actions;

export default panCakeSlice.reducer;
