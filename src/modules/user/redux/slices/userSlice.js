import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '@user/api/userApi';

// Async thunk để lấy thông tin người dùng
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserProfile(userId);
      return {
        data: response.data,
        isOwner: response.data.isOwner || false
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

// Async thunk để cập nhật thông tin người dùng
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUserProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Async thunk để upload avatar
export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file, { rejectWithValue }) => {
    try {
      const response = await userApi.uploadAvatar(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  }
);

// Async thunk để upload cover photo
export const uploadCoverPhoto = createAsyncThunk(
  'user/uploadCoverPhoto',
  async (file, { rejectWithValue }) => {
    try {
      const response = await userApi.uploadThumbnail(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload cover photo');
    }
  }
);

// Async thunk để cập nhật tên người dùng
export const updateUserFullname = createAsyncThunk(
  'user/updateUserFullname',
  async (fullName, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await userApi.updateFullname(fullName);
      
      // Refresh user profile sau khi cập nhật
      const currentState = getState();
      const currentUserId = currentState.user.currentProfile?._id;
      
      if (currentUserId) {
        dispatch(fetchUserProfile(currentUserId));
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update fullname');
    }
  }
);

// Initial state
const initialState = {
  currentProfile: null,
  isCurrentUser: false
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.currentProfile = null;
      state.isCurrentUser = false;
    },
    setIsCurrentUser: (state, action) => {
      state.isCurrentUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchUserProfile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.currentProfile = action.payload.data;
        state.isCurrentUser = action.payload.isOwner || false;
      })

      // Handle updateUserProfile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        // Cập nhật profile nếu là user hiện tại
        if (state.isCurrentUser) {
          state.currentProfile = { ...state.currentProfile, ...action.payload };
        }
      })

      // Handle uploadAvatar
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.profilePicture = action.payload.profilePicture;
        }
      })

      // Handle uploadCoverPhoto
      .addCase(uploadCoverPhoto.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.coverPhoto = action.payload.coverPhoto;
        }
      })

      // Handle updateUserFullname
      .addCase(updateUserFullname.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.fullName = action.payload.fullName;
        }
      });
  }
});

export const { resetUserState, setIsCurrentUser } = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user.currentProfile;
export const selectIsCurrentUser = (state) => state.user.isCurrentUser;

export default userSlice.reducer;
