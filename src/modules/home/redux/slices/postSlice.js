import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sample async thunk for fetching timeline posts
export const fetchTimelinePosts = createAsyncThunk(
  'posts/fetchTimeline',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      // For now, this is a placeholder. Will be implemented later
      return {
        posts: [],
        totalPages: 1,
        currentPage: page
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

const initialState = {
  timelinePosts: [],
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  createPostStatus: 'idle',
  createPostError: null
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.timelinePosts = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
    resetCreatePostStatus: (state) => {
      state.createPostStatus = 'idle';
      state.createPostError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTimelinePosts
      .addCase(fetchTimelinePosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTimelinePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.currentPage === 1) {
          state.timelinePosts = [...action.payload.posts];
        } else {
          state.timelinePosts = [...state.timelinePosts, ...action.payload.posts];
        }
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTimelinePosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch posts';
      });
  }
});

export const { clearPosts, resetCreatePostStatus } = postSlice.actions;
export default postSlice.reducer; 