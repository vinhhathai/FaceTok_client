import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import profileReducer from './features/profileSlice';
import postReducer from './features/postSlice';
import messageReducer from './features/messageSlice';
import friendReducer from './features/friendSlice';
import notificationReducer from './features/notificationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
    posts: postReducer,
    messages: messageReducer,
    friends: friendReducer,
    notifications: notificationReducer,
  },
});

export default store;
