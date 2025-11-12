import { configureStore } from '@reduxjs/toolkit';
import authReducer from "@auth/redux";
import postReducer from "@post/redux/slices/postSlice";
import postDetailReducer from "@post/redux/slices/postDetailSlice";
import friendReducer from "@friend/redux";
import messageReducer from "@message/redux";
import notificationReducer from "@notification/redux";
import { reducers as userReducers } from "@user/redux";
import { administratorAPI } from "../../modules/administrator/api/administratorAPI";
import { announcementAPI } from "../../shared/api/announcementAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    postDetail: postDetailReducer,
    friend: friendReducer,
    ...messageReducer,
    notification: notificationReducer,
    ...userReducers,
    [administratorAPI.reducerPath]: administratorAPI.reducer,
    [announcementAPI.reducerPath]: announcementAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua kiểm tra serializable cho các action không thể serialize
        ignoredActions: ['auth/login/rejected', 'auth/register/rejected', 'auth/forgotPassword/rejected'],
        // Bỏ qua kiểm tra serializable cho các path của state
        ignoredPaths: ['auth.error'],
      },
    }).concat(administratorAPI.middleware, announcementAPI.middleware),
});

// Make store available in window object for mock socket access
if (typeof window !== 'undefined') {
  window.store = store;
}
