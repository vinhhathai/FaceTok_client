import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './features/emailSlice';
import profileReducer from './features/profileSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    email: emailReducer,
    profile: profileReducer,
    user: userReducer,
  },
});

export default store;
