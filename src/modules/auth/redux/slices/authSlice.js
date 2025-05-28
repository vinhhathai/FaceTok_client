import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authAPI from '../../api/authAPI';
import { setCookie, getCookie, removeCookie } from '../../../../shared/utils/cookieUtils';

// Cookie configuration
const TOKEN_COOKIE_NAME = 'auth_token';
const TOKEN_COOKIE_EXPIRY = 7; // 7 days

/**
 * Tạo action đăng nhập
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authAPI.loginUser(credentials);
      // Lưu token vào cookie khi đăng nhập thành công
      if (data.data.accessToken) {
        setCookie(TOKEN_COOKIE_NAME, data.data.accessToken, { expires: TOKEN_COOKIE_EXPIRY });
      }
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
 * Trạng thái ban đầu của slice auth
 */
const initialState = {
  // Thông tin người dùng và token
  user: null,
  token: getCookie(TOKEN_COOKIE_NAME) || null,
  isAuthenticated: !!getCookie(TOKEN_COOKIE_NAME),
  
  // Trạng thái tải và lỗi
  loading: false,
  error: null
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
     * Đăng xuất: xóa thông tin người dùng, token và lỗi
     */
    logout: (state) => {
      removeCookie(TOKEN_COOKIE_NAME);
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    /**
     * Xóa lỗi: đặt state.error về null
     */
    clearError: (state) => {
      state.error = null;
    }
  },
  
  // Reducers cho các action bất đồng bộ
  extraReducers: (builder) => {
    builder
      // ===== Các trường hợp đăng nhập =====
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // ===== Các trường hợp đăng ký =====
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // Không set authenticated vì cần đăng nhập sau khi đăng ký
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== Các trường hợp quên mật khẩu =====
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== Các trường hợp xác thực OTP =====
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== Các trường hợp đặt lại mật khẩu =====
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

// Export actions
export const { logout, clearError } = authSlice.actions;

// Export reducer
export default authSlice.reducer; 