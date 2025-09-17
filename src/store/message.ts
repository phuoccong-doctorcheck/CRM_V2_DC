/* eslint-disable import/no-cycle */
import { /* createAsyncThunk */PayloadAction, createSlice } from '@reduxjs/toolkit';

interface MessageState {
  isEmptyContent: boolean;
  isEmptyInteract: boolean;
}

const initialState: MessageState = {
  isEmptyContent: false,
  isEmptyInteract: false,
};

// export const getUserAction = createAsyncThunk<
//   User,
//   number,
//   { rejectValue: any }
// >('mapsReducer/getProjectAction', async (id, { rejectWithValue }) => {
//   try {
//     const response = await getUserInfo(id);
//     return response;
//   } catch (error) {
//     return rejectWithValue(error);
//   }
// });

export const messageSlice = createSlice({
  name: 'messageReducer',
  initialState,
  reducers: {

    setIsEmptyContentChat($state, action: PayloadAction<boolean>) {
      $state.isEmptyContent = action.payload;
    },
    setIsEmptyInteract($state, action: PayloadAction<boolean>) {
      $state.isEmptyInteract = action.payload;
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(getUserAction.fulfilled, ($state, action) => {
  //     $state.infuser = action.payload;
  //   });

  // },
});

export const {
  setIsEmptyContentChat,
   setIsEmptyInteract,
} = messageSlice.actions;

export default messageSlice.reducer;
