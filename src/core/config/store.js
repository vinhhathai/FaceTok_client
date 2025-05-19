import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../modules/auth/redux/reducers';
import postsReducer from '../../modules/home/redux/slices/postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
}); 