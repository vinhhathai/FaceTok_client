import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as postAPI from '../../api/postAPI';

// Example async thunk for timeline posts
export const fetchTimelinePosts = createAsyncThunk(
  'posts/fetchTimeline',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      // Chờ implement API:
      // const response = await postAPI.getTimelinePosts(page, limit);
      // return response.data;
      
      // Demo data
      return {
        posts: [],
        currentPage: page,
        totalPages: 0
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Không thể tải bài viết');
    }
  }
);

const initialState = {
  timelinePosts: [],
  currentPage: 1,
  totalPages: 1
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetCreatePostStatus: (state) => {
      // Placeholder for future use
    },
    likePost: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.timelinePosts.find(p => p.id === postId);
      if (post) {
        if (post.likes.includes(userId)) {
          post.likes = post.likes.filter(id => id !== userId);
        } else {
          post.likes.push(userId);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimelinePosts.fulfilled, (state, action) => {
        // Nếu là trang đầu tiên, thay thế toàn bộ, ngược lại thì thêm vào
        if (action.meta.arg.page === 1) {
          state.timelinePosts = action.payload.posts;
        } else {
          state.timelinePosts = [...state.timelinePosts, ...action.payload.posts];
        }
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      });
  }
});

export const { resetCreatePostStatus, likePost } = postsSlice.actions;
export default postsSlice.reducer; 