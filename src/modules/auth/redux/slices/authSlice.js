import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authAPI from '@auth/api/authAPI';
import { getCookie, removeCookie } from '@utils/cookieUtils';

// Cookie configuration (cookies are httpOnly, set by backend)
const ACCESS_TOKEN_COOKIE = process.env.REACT_APP_AUTH_TOKEN_NAME || 'auth_token';
const REFRESH_TOKEN_COOKIE = process.env.REACT_APP_REFRESH_TOKEN_NAME || 'refresh_token';

/**
 * Tạo action để lấy thông tin người dùng hiện tại
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // Chỉ gọi API nếu có token
      const token = getCookie(ACCESS_TOKEN_COOKIE);
      if (!token) {
        return rejectWithValue('No token found');
      }
      const data = await authAPI.getCurrentUser();
      return data;
    } catch (error) {
      // Nếu lỗi 401 (Unauthorized), xóa token
      if (error.status === 401) {
        removeCookie(ACCESS_TOKEN_COOKIE);
        removeCookie(REFRESH_TOKEN_COOKIE);
      }
      return rejectWithValue(error);
    }
  }
);

/**
 * Tạo action đăng nhập
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const data = await authAPI.loginUser(credentials);
      
      // Backend sets httpOnly cookies automatically
      // Socket.IO will also use httpOnly cookies now (no localStorage needed)
      
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Tạo action đăng ký
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authAPI.registerUser(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Tạo action quên mật khẩu
 */
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authAPI.requestPasswordReset(data);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Tạo action xác thực OTP
 */
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authAPI.verifyOTP(data);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Tạo action đặt lại mật khẩu
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authAPI.resetPassword(data);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Load user from localStorage
 */
const loadUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
};

/**
 * Save user to localStorage
 */
const saveUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      
      // Prioritize _id (MongoDB ObjectId) over id (UUID) for message system compatibility
      const userId = user._id || user.id;
      
      if (userId) {
        localStorage.setItem('currentUserId', String(userId));
      } else {
        console.error('Error: User missing both _id and id fields');
      }
    }
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

/**
 * Trạng thái ban đầu của slice auth
 */
const initialState = {
  // Thông tin người dùng (from localStorage)
  user: loadUserFromStorage(),
  // Token status - since tokens are in httpOnly cookies (not accessible from JS),
  // we determine auth status by whether we have user data
  isAuthenticated: !!loadUserFromStorage()
};

/**
 * Tạo slice auth với Redux Toolkit
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  
  // Reducers thông thường (không bất đồng bộ)
  reducers: {
    /**
     * Đăng xuất: xóa thông tin người dùng và cookies
     */
    logout: (state) => {
      // Clear all cookies (httpOnly cookies will be cleared by backend)
      removeCookie(ACCESS_TOKEN_COOKIE);
      removeCookie(REFRESH_TOKEN_COOKIE);
      
      // Clear user from localStorage
      localStorage.removeItem('user');
      
      state.user = null;
      state.isAuthenticated = false;
    },
    /**
     * Set user: cập nhật thông tin người dùng (dùng khi reload trang)
     */
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Save to localStorage
      saveUserToStorage(action.payload);
    }
  },
  
  // Reducers cho các action bất đồng bộ
  extraReducers: (builder) => {
    builder
      // ===== Các trường hợp lấy thông tin người dùng hiện tại =====
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isAuthenticated = true;
        // Save to localStorage
        saveUserToStorage(action.payload.data);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        if (action.payload === 'No token found') {
          state.isAuthenticated = false;
        } else {
          // Nếu lỗi 401, đặt isAuthenticated thành false
          if (action.payload?.status === 401) {
            state.isAuthenticated = false;
          }
        }
      })
      
      // ===== Các trường hợp đăng nhập =====
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        // Save user to localStorage
        saveUserToStorage(action.payload.data.user);
        // Tokens are stored in cookies automatically
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false;
      })
      
      // ===== Các trường hợp đăng ký =====
      .addCase(register.fulfilled, (state) => {
        // Không set authenticated vì cần đăng nhập sau khi đăng ký
      })
      
      // ===== Các trường hợp quên mật khẩu =====
      .addCase(forgotPassword.fulfilled, (state) => {
        // Không cần thay đổi state
      })
      
      // ===== Các trường hợp xác thực OTP =====
      .addCase(verifyOTP.fulfilled, (state) => {
        // Không cần thay đổi state
      })
      
      // ===== Các trường hợp đặt lại mật khẩu =====
      .addCase(resetPassword.fulfilled, (state) => {
        // Không cần thay đổi state
      });
  }
});

// Export actions
export const { logout, setUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;