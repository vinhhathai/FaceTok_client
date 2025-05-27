import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as friendAPI from '../api/friendAPI';

// Example async thunk
// export const getFriends = createAsyncThunk(
//   'friend/getFriends',
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await friendAPI.getFriends();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

const initialState = {
  friends: [],
  friendRequests: [],
  loading: false,
  error: null
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    // Regular reducers here
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Handle async actions here
    // builder
    //   .addCase(getFriends.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getFriends.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.friends = action.payload;
    //   })
    //   .addCase(getFriends.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });
  }
});

export const { clearError } = friendSlice.actions;
export default friendSlice.reducer; 