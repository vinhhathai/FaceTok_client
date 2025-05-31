import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../modules/auth/redux";
import { postsReducer } from "../../modules/post/redux";
import postDetailReducer from "../../modules/post/redux";
import friendReducer from "../../modules/friend/redux";
import messageReducer from "../../modules/message/redux";
import notificationReducer from "../../modules/notification/redux";
import { reducers as userReducers } from "../../modules/user/redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    friend: friendReducer,
    message: messageReducer,
    notification: notificationReducer,
    post: postDetailReducer,
    ...userReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua kiểm tra serializable cho các action không thể serialize
        ignoredActions: ['auth/login/rejected', 'auth/register/rejected', 'auth/forgotPassword/rejected'],
        // Bỏ qua kiểm tra serializable cho các path của state
        ignoredPaths: ['auth.error'],
      },
    }),
});
