import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";

// Default images
const DEFAULT_AVATAR = "/assets/images/avatar_default.jpg";
const DEFAULT_COVER = "/assets/images/cover_default.jpg";

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.getUserProfile(userId);
      return response; // The API already returns the success wrapper
    } catch (error) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      // API call sẽ được thêm vào đây sau
      // const response = await userApi.updateUserProfile(userData);
      // return response.data;

      // Giả lập dữ liệu
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra");
    }
  }
);

export const uploadThumbnail = createAsyncThunk(
  "user/uploadThumbnail",
  async ({ file, onProgress }, { rejectWithValue, getState }) => {
    try {
      const response = await userApi.uploadThumbnail(file, onProgress);
      return response;
    } catch (error) {
      // Improved error handling for better UX feedback
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tải lên ảnh bìa";
      return rejectWithValue({
        message: errorMessage,
        error
      });
    }
  }
);

// Initial state
const initialState = {
  currentProfile: null,
  isCurrentUser: false,
  status: "idle",
  error: null,
  uploadStatus: "idle",
  uploadError: null,
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.currentProfile = null;
      state.isCurrentUser = false;
      state.status = "idle";
      state.error = null;
      state.uploadStatus = "idle";
      state.uploadError = null;
    },
    setIsCurrentUser: (state, action) => {
      state.isCurrentUser = action.payload;
    },
    resetUploadStatus: (state) => {
      state.uploadStatus = "idle";
      state.uploadError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProfile = action.payload.data;
        state.isCurrentUser = action.payload.data.isOwner || false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Có lỗi xảy ra";
      })

      // Xử lý updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProfile = { ...state.currentProfile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Có lỗi xảy ra";
      })
      
      // Xử lý uploadThumbnail
      .addCase(uploadThumbnail.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
      })
      .addCase(uploadThumbnail.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        // Cập nhật URL thumbnail mới nếu thành công
        if (state.currentProfile && action.payload && action.payload.data) {
          if (action.payload.data.thumbnailUrl) {
            state.currentProfile.thumbnail = action.payload.data.thumbnailUrl;
          } else if (action.payload.data.thumbnail) {
            state.currentProfile.thumbnail = action.payload.data.thumbnail;
          }
        }
      })
      .addCase(uploadThumbnail.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload || "Có lỗi xảy ra khi tải lên ảnh bìa";
      });
  },
});

// Export actions
export const { resetUserState, setIsCurrentUser, resetUploadStatus } = userSlice.actions;

// Export selectors
export const selectUserProfile = (state) => state.user.currentProfile;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
export const selectIsCurrentUser = (state) => state.user.isCurrentUser;
export const selectUploadStatus = (state) => state.user.uploadStatus;
export const selectUploadError = (state) => state.user.uploadError;

// Export reducer
export default userSlice.reducer;
