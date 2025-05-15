import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../modules/auth/redux/reducers';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
}); 