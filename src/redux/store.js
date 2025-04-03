import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import profileReducer from './features/profileSlice';
import postReducer from './features/postSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    posts: postReducer,
  },
});

export default store;
