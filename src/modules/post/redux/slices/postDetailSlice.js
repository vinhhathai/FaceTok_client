import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPost: null,
  loading: false,
  error: null
};

const postDetailSlice = createSlice({
  name: 'postDetail',
  initialState,
  reducers: {
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setCurrentPost, 
  clearCurrentPost, 
  setLoading, 
  setError 
} = postDetailSlice.actions;

export default postDetailSlice.reducer;
