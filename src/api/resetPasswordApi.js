import axios from 'axios';
import { link_api } from "../config/api-config";

/**
 * Gọi API yêu cầu đặt lại mật khẩu (gửi OTP)
 * @param {string} email - Email của người dùng
 * @returns {Promise<Object>} - Kết quả yêu cầu
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${link_api.BASE_URL}/auth/request-reset`, { email });

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error?.message || 'Không thể yêu cầu đặt lại mật khẩu');
    }

    return {
      success: true,
      message: response.data.message || 'Đã gửi email đặt lại mật khẩu',
      data: response.data.data
    };
  } catch (error) {
    if (error.response?.data?.error) {
      return { 
        success: false, 
        error: error.response.data.error.message || 'Yêu cầu đặt lại mật khẩu thất bại' 
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Không thể kết nối đến server' 
    };
  }
};

/**
 * Gọi API xác thực OTP
 * @param {string} otp - Mã OTP
 * @param {string} email - Email của người dùng
 * @returns {Promise<Object>} - Kết quả xác thực OTP
 */
export const verifyOTP = async (otp, email) => {
  try {
    const response = await axios.post(`${link_api.VERIFY_OTP_LINK}`, { 
      email: email,
      otp: otp
    });

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error?.message || 'Xác thực OTP thất bại');
    }

    // Trích xuất resetToken từ response
    const resetToken = response.data.data?.resetToken || null;

    return {
      success: true,
      message: response.data.message || 'Xác thực OTP thành công',
      data: { resetToken }
    };
  } catch (error) {
    if (error.response?.data?.error) {
      return { 
        success: false, 
        error: error.response.data.error.message 
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Không thể kết nối đến server' 
    };
  }
};

/**
 * Gọi API đặt lại mật khẩu
 * @param {string} token - Token xác thực
 * @param {string} newPassword - Mật khẩu mới
 * @param {string} confirmPassword - Xác nhận mật khẩu
 * @returns {Promise<Object>} - Kết quả đặt lại mật khẩu
 */
export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await axios.post(
      `${link_api.BASE_URL}/auth/reset-password`, 
      { newPassword, confirmPassword },
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error?.message || 'Đặt lại mật khẩu thất bại');
    }

    return {
      success: true,
      message: response.data.message || 'Đặt lại mật khẩu thành công'
    };
  } catch (error) {
    if (error.response?.data?.error) {
      return { 
        success: false, 
        error: error.response.data.error.message || 'Đặt lại mật khẩu thất bại' 
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Không thể kết nối đến server' 
    };
  }
};
