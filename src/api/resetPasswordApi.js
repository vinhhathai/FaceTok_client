import { link_api } from "../config/api-config";

// API để yêu cầu reset password (gửi OTP)
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${link_api.BASE_URL}/auth/request-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const responseData = await response.json();
    console.log('Request password reset API response:', responseData);

    if (!response.ok) {
      if (responseData.error) {
        throw new Error(responseData.error.message);
      }
      throw new Error("Không thể gửi yêu cầu đặt lại mật khẩu");
    }

    return {
      success: true,
      message: responseData.data?.message || "Đã gửi email đặt lại mật khẩu"
    };
  } catch (err) {
    console.error('Request password reset error:', err);
    return { success: false, error: err.message };
  }
};

// API để reset password với OTP
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await fetch(`${link_api.BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
        newPassword
      }),
    });

    const responseData = await response.json();
    console.log('Reset password API response:', responseData);

    if (!response.ok) {
      if (responseData.error) {
        throw new Error(responseData.error.message);
      }
      throw new Error("Không thể đặt lại mật khẩu");
    }

    return {
      success: true,
      message: responseData.data?.message || "Đã đặt lại mật khẩu thành công"
    };
  } catch (err) {
    console.error('Reset password error:', err);
    return { success: false, error: err.message };
  }
};
