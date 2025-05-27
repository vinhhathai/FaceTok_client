import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as messageAPI from '../api/messageAPI';

// Example async thunk
// export const getMessages = createAsyncThunk(
//   'message/getMessages',
//   async (conversationId, { rejectWithValue }) => {
//     try {
//       const data = await messageAPI.getMessages(conversationId);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    // Regular reducers here
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Handle async actions here
    // builder
    //   .addCase(getMessages.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getMessages.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.messages = action.payload;
    //   })
    //   .addCase(getMessages.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });
  }
});

export const { clearError, setCurrentConversation } = messageSlice.actions;
export default messageSlice.reducer; 