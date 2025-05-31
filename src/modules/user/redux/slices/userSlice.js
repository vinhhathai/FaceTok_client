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
      // Debug log
      console.log('API response for user profile:', response);
      return response; // The API already returns the success wrapper
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error?.message || 
        error.message || 
        "Có lỗi xảy ra khi tải thông tin người dùng"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log("Sending to API:", userData);
      
      // Call the API with updated profile data
      const response = await userApi.updateUserProfile(userData);
      
      console.log("Full API response:", response);
      
      // If successful, refresh user profile to ensure we have the latest data
      if (response.success) {
        // Return data to be used in reducers - use both userData and response.data
        // to ensure we update with both sent and returned values
        const mergedData = {
          ...userData,
          ...(response.data || {})
        };
        
        console.log("Merged data after update:", mergedData);
        
        // Get current user ID from state
        const currentUserId = getState().user.currentProfile?.id;
        
        // Refresh profile data if ID is available
        if (currentUserId) {
          setTimeout(() => {
            dispatch(fetchUserProfile(currentUserId));
          }, 300);
        }
        
        return mergedData;
      }
      
      return userData; // Return original data in case API doesn't return profile data
    } catch (error) {
      console.error("Error updating profile:", error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Profile update failed",
        status: error.status || 500,
        details: error.details || null
      });
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

export const uploadAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async ({ file, onProgress }, { rejectWithValue, getState }) => {
    try {
      const response = await userApi.uploadAvatar(file, onProgress);
      return response;
    } catch (error) {
      // Improve error handling for better UX feedback
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tải lên ảnh đại diện";
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

      // Handle updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        
        console.log('Profile update fulfilled with payload:', action.payload);
        
        // Update local state with returned profile data
        if (action.payload) {
          // Merge the updated fields into the current profile
          state.currentProfile = {
            ...state.currentProfile,
            ...action.payload
          };
          
          // Đặc biệt xử lý riêng trường relationship để đảm bảo nó được cập nhật đúng
          // Bao gồm cả giá trị rỗng ('' - Không xác định)
          if ('relationship' in action.payload) {
            state.currentProfile.relationship = action.payload.relationship;
            console.log('Updated relationship to:', action.payload.relationship);
          }
          
          // Debug the updated state
          console.log('Updated profile state:', state.currentProfile);
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        
        // Enhanced error handling
        const errorData = action.payload;
        state.error = errorData 
          ? {
              message: errorData.message || "Profile update failed",
              status: errorData.status || 500,
              details: errorData.details || null
            }
          : "Unknown error occurred during profile update";
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
      })
      
      // Xử lý uploadAvatar
      .addCase(uploadAvatar.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        // Cập nhật URL avatar mới nếu thành công
        if (state.currentProfile && action.payload && action.payload.data) {
          if (action.payload.data.profilePictureUrl) {
            state.currentProfile.profilePicture = action.payload.data.profilePictureUrl;
          } else if (action.payload.data.profilePicture) {
            state.currentProfile.profilePicture = action.payload.data.profilePicture;
          }
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload || "Có lỗi xảy ra khi tải lên ảnh đại diện";
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
