import axios from "axios";
import { link_api } from "../config/api-config";

const changePasswordApi = async (
  newPassword,
  confirmNewPassword,
  resetPasswordToken
) => {
  const apiUrl = `${link_api.CHANGE_PASSWORD_LINK}`; // Thay bằng URL API của bạn nếu cần.

  const requestBody = {
    newPassword,
    confirmNewPassword,
    resetPasswordToken,
  };

  try {
    const response = await axios.put(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Password changed successfully:", response.data);
    return response.data; // Trả về response nếu cần xử lý thêm.
  } catch (error) {
    console.error(
      "Error changing password:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi ra ngoài để xử lý ở chỗ gọi hàm.
  }
};

export default changePasswordApi;
