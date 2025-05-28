import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as postAPI from '../../api/postAPI';

// Example async thunk
// export const getPostDetail = createAsyncThunk(
//   'post/getPostDetail',
//   async (postId, { rejectWithValue }) => {
//     try {
//       const data = await postAPI.getPostDetail(postId);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const createPost = createAsyncThunk(
//   'post/createPost',
//   async (postData, { rejectWithValue }) => {
//     try {
//       const data = await postAPI.createPost(postData);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

const initialState = {
  posts: [],
  singlePost: null,
  loading: false,
  error: null
};

const postDetailSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    // Regular reducers here
    clearError: (state) => {
      state.error = null;
    },
    likePost: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.liked = !post.liked;
        post.likeCount = post.liked ? post.likeCount + 1 : Math.max(0, post.likeCount - 1);
      }
    }
  },
  extraReducers: (builder) => {
    // Handle async actions here
    // builder
    //   .addCase(getPostDetail.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getPostDetail.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.singlePost = action.payload;
    //   })
    //   .addCase(getPostDetail.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
    //   .addCase(createPost.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(createPost.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.posts = [action.payload, ...state.posts];
    //   })
    //   .addCase(createPost.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });
  }
});

export const { clearError, likePost } = postDetailSlice.actions;
export default postDetailSlice.reducer; 