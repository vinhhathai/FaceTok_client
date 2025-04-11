import { link_api } from "../config/api-config";

export const resetPassword = async (email) => {
  try {
    const response = await fetch(`${link_api.RESET_PASSWORD_LINK}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const responseData = await response.json();
    console.log('Reset password API response:', responseData);

    if (!response.ok) {
      // Xử lý lỗi theo cấu trúc mới
      if (responseData.error) {
        throw new Error(responseData.error.message || "Không thể đặt lại mật khẩu");
      }
      throw new Error("Không thể đặt lại mật khẩu");
    }

    // Trả về dữ liệu theo cấu trúc mới
    const data = responseData.data || responseData;
    return { success: true, message: data.message || "Đã gửi email đặt lại mật khẩu" };
  } catch (err) {
    console.error('Reset password error:', err);
    return { success: false, error: err.message };
  }
};
