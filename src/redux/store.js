import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './features/emailSlice'; // Đường dẫn chính xác đến emailSlice

const store = configureStore({
  reducer: {
    email: emailReducer,
  },
});

export default store;
