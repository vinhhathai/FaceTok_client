import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import profileReducer from './features/profileSlice';
import postReducer from './features/postSlice';
import messageReducer from './features/messageSlice';
import friendReducer from './features/friendSlice';
import notificationReducer from './features/notificationSlice';
import emailReducer from './features/emailSlice';

/**
 * Middleware để xử lý các lỗi liên quan đến các thuộc tính undefined khi khởi tạo hoặc cập nhật store
 * Điều này giúp đảm bảo rằng các action luôn có dạng chuẩn { type, payload } và không bị lỗi
 */
const errorCatchingMiddleware = store => next => action => {
  try {
    // Trường hợp 1: action hoàn toàn undefined
    if (action === undefined || action === null) {
      console.error('[Redux Middleware] Received undefined/null action');
      return next({ type: 'UNKNOWN_ACTION', payload: {} });
    }

    // Trường hợp 2: Không phải object
    if (typeof action !== 'object') {
      console.error('[Redux Middleware] Action is not an object:', action);
      return next({ type: 'INVALID_ACTION', payload: {} });
    }

    // Trường hợp 3: action.type không tồn tại
    if (action.type === undefined || action.type === null) {
      console.error('[Redux Middleware] Action type is undefined/null:', action);
      return next({ ...action, type: 'UNKNOWN_ACTION' });
    }

    // Trường hợp 4: action.payload không tồn tại
    if (action.payload === undefined) {
      console.log('[Redux Middleware] Adding empty payload to action:', action.type);
      action = { ...action, payload: {} };
    }

    // Ghi log thông tin hành động trong môi trường development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Redux Action] ${action.type}`);
    }

    return next(action);
  } catch (error) {
    // Xử lý bất kỳ lỗi nào xảy ra trong middleware
    console.error('[Redux Middleware Error]', error);
    
    // Đảm bảo action có định dạng chuẩn trước khi chuyển tiếp
    return next({ 
      type: action?.type || 'ERROR_ACTION', 
      payload: action?.payload || {},
      error: true,
      meta: {
        originalError: error.message
      }
    });
  }
};

// Middleware để cảnh báo và sửa lỗi trong reducer
const reducerErrorCatcher = createReducer => (state, action) => {
  try {
    return createReducer(state, action);
  } catch (error) {
    console.error(`[Redux Reducer Error] Action: ${action?.type}`, error);
    return state; // Trả về state hiện tại thay vì làm crash ứng dụng
  }
};

// Bọc tất cả reducer trong wrapper để bắt lỗi
const wrapReducers = reducers => {
  const wrappedReducers = {};
  Object.keys(reducers).forEach(key => {
    wrappedReducers[key] = (state, action) => {
      try {
        return reducers[key](state, action);
      } catch (error) {
        console.error(`[Redux Reducer Error in ${key}] Action: ${action?.type}`, error);
        return state || reducers[key](undefined, { type: '@@INIT' });
      }
    };
  });
  return wrappedReducers;
};

// Các reducer gốc
const originalReducers = {
  user: userReducer,
  profile: profileReducer,
  posts: postReducer,
  messages: messageReducer,
  friends: friendReducer,
  notifications: notificationReducer,
  email: emailReducer
};

// Tạo store với middleware bắt lỗi
export const store = configureStore({
  reducer: wrapReducers(originalReducers),
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(errorCatchingMiddleware)
});

export default store;
