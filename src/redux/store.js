import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './features/emailSlice';
import profileReducer from './features/profileSlice'; // Thêm import

const store = configureStore({
  reducer: {
    email: emailReducer,
    profile: profileReducer, // Thêm profileReducer vào Redux store
  },
});

export default store;
