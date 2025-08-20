import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postAPI from '../../api/postAPI';

// Async thunk for creating post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postAPI.createPost(postData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create post');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching timeline posts
export const fetchTimelinePosts = createAsyncThunk(
  'posts/fetchTimelinePosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await postAPI.getTimelinePosts(params);
      if (response.success) {
        return {
          posts: response.data,
          pagination: response.pagination
        };
      } else {
        return rejectWithValue(response.message || 'Failed to fetch posts');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching user posts
export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async ({ userId, params }, { rejectWithValue }) => {
    try {
      const response = await postAPI.getPostsByAuthor(userId, params);
      if (response.success) {
        return {
          posts: response.data,
          pagination: response.pagination
        };
      } else {
        return rejectWithValue(response.message || 'Failed to fetch user posts');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState = {
  timelinePosts: [],
  userPosts: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  loading: false,
  error: null,
  createPostLoading: false,
  createPostError: null
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.createPostError = null;
    },
    
    // Reset state
    resetPosts: (state) => {
      state.timelinePosts = [];
      state.userPosts = {};
      state.pagination = { page: 1, limit: 10, total: 0, pages: 0 };
      state.loading = false;
      state.error = null;
    },
    
    // Add post optimistically (before API call)
    addPostOptimistically: (state, action) => {
      const newPost = action.payload;
      // Add to timeline posts at the beginning
      state.timelinePosts.unshift(newPost);
      // Add to user posts if viewing user's own posts
      if (newPost.author._id === newPost.currentUserId) {
        const userId = newPost.author._id;
        if (!state.userPosts[userId]) {
          state.userPosts[userId] = [];
        }
        state.userPosts[userId].unshift(newPost);
      }
    },
    
    // Remove optimistic post (if API call fails)
    removeOptimisticPost: (state, action) => {
      const tempId = action.payload;
      // Remove from timeline posts
      state.timelinePosts = state.timelinePosts.filter(post => post.tempId !== tempId);
      // Remove from all user posts
      Object.keys(state.userPosts).forEach(userId => {
        state.userPosts[userId] = state.userPosts[userId].filter(post => post.tempId !== tempId);
      });
    },
    
    // Update post (for optimistic updates)
    updatePost: (state, action) => {
      const { postId, updates } = action.payload;
      
      // Update in timeline posts
      const timelineIndex = state.timelinePosts.findIndex(post => post._id === postId);
      if (timelineIndex !== -1) {
        state.timelinePosts[timelineIndex] = { ...state.timelinePosts[timelineIndex], ...updates };
      }
      
      // Update in user posts
      Object.keys(state.userPosts).forEach(userId => {
        const userIndex = state.userPosts[userId].findIndex(post => post._id === postId);
        if (userIndex !== -1) {
          state.userPosts[userId][userIndex] = { ...state.userPosts[userId][userIndex], ...updates };
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.createPostLoading = true;
        state.createPostError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createPostLoading = false;
        // Post is already added optimistically, just update with real data
        const realPost = action.payload;
        
        // Find and replace optimistic post
        const optimisticIndex = state.timelinePosts.findIndex(post => 
          post.tempId || post._id === realPost._id
        );
        
        if (optimisticIndex !== -1) {
          // Replace optimistic post with real post
          state.timelinePosts[optimisticIndex] = realPost;
        } else {
          // Add to beginning if not found
          state.timelinePosts.unshift(realPost);
        }
        
        // Update user posts
        if (realPost.author._id) {
          const userId = realPost.author._id;
          if (!state.userPosts[userId]) {
            state.userPosts[userId] = [];
          }
          
          const userIndex = state.userPosts[userId].findIndex(post => 
            post.tempId || post._id === realPost._id
          );
          
          if (userIndex !== -1) {
            state.userPosts[userId][userIndex] = realPost;
          } else {
            state.userPosts[userId].unshift(realPost);
          }
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createPostLoading = false;
        state.createPostError = action.payload;
        // Remove optimistic post on failure
        // Note: We'll handle this in the component
      })
      
      // Fetch Timeline Posts
      .addCase(fetchTimelinePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimelinePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.timelinePosts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTimelinePosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { userId } = action.meta.arg;
        state.userPosts[userId] = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  resetPosts, 
  addPostOptimistically, 
  removeOptimisticPost,
  updatePost 
} = postSlice.actions;

export default postSlice.reducer;
