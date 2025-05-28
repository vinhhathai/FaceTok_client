import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      // API call sẽ được thêm vào đây sau
      // const response = await userApi.getUserProfile(userId);
      // return response.data;
      
      // Giả lập dữ liệu
      return {
        id: userId,
        name: 'Nguyễn Văn A',
        avatar: 'https://via.placeholder.com/150',
        coverPhoto: 'https://via.placeholder.com/1200x300',
        bio: 'Đây là thông tin giới thiệu của tôi',
        location: 'Hà Nội, Việt Nam',
        education: 'Đại học XYZ',
        work: 'Công ty ABC',
        followerCount: 1250,
        followingCount: 356,
        postCount: 127,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Có lỗi xảy ra');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      // API call sẽ được thêm vào đây sau
      // const response = await userApi.updateUserProfile(userData);
      // return response.data;
      
      // Giả lập dữ liệu
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Có lỗi xảy ra');
    }
  }
);

// Initial state
const initialState = {
  currentProfile: null,
  isCurrentUser: false,
  status: 'idle',
  error: null,
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.currentProfile = null;
      state.isCurrentUser = false;
      state.status = 'idle';
      state.error = null;
    },
    setIsCurrentUser: (state, action) => {
      state.isCurrentUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Có lỗi xảy ra';
      })
      
      // Xử lý updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProfile = { ...state.currentProfile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Có lỗi xảy ra';
      });
  }
});

// Export actions
export const { resetUserState, setIsCurrentUser } = userSlice.actions;

// Export selectors
export const selectUserProfile = (state) => state.user.currentProfile;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
export const selectIsCurrentUser = (state) => state.user.isCurrentUser;

// Export reducer
export default userSlice.reducer; 