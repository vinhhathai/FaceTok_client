import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getProfileApi from '../../api/getProfileApi';

// Thunk để lấy profile từ API
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const profile = await getProfileApi(userId);
      return profile; // Dữ liệu trả về từ API
    } catch (error) {
      return rejectWithValue(error.message || "Unable to fetch profile");
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null, // Lưu trữ dữ liệu profile
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
