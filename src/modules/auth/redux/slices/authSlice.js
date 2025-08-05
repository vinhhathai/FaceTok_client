import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authAPI from '@auth/api/authAPI';
import { setCookie, getCookie, removeCookie } from '@utils/cookieUtils';

// Cookie configuration
const TOKEN_COOKIE_NAME = 'auth_token';
const TOKEN_COOKIE_EXPIRY = 7; // 7 days

/**
 * Tạo action để lấy thông tin người dùng hiện tại
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // Chỉ gọi API nếu có token
      const token = getCookie(TOKEN_COOKIE_NAME);
      if (!token) {
        return rejectWithValue('No token found');
      }
      const data = await authAPI.getCurrentUser();
      return data;
    } catch (error) {
      // Nếu lỗi 401 (Unauthorized), xóa token
      if (error.status === 401) {
        removeCookie(TOKEN_COOKIE_NAME);
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
  isAuthenticated: !!getCookie(TOKEN_COOKIE_NAME)
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
    }
  },
  
  // Reducers cho các action bất đồng bộ
  extraReducers: (builder) => {
    builder
      // ===== Các trường hợp lấy thông tin người dùng hiện tại =====
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isAuthenticated = true;
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
        state.token = action.payload.data.accessToken;
        state.isAuthenticated = true;
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
export const { logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer; 