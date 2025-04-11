import axios from "axios";
import { link_api } from "../config/api-config"
import getCookieToken from "../utils/getCookieToken";

async function getProfileApi(userId) {
  try {
    const token = getCookieToken(); // Lấy token từ cookie
    const response = await axios.get(`${link_api.GET_PROFILE_LINK}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Get profile API response:', response.data);
    
    // Kiểm tra và xử lý cấu trúc phản hồi mới
    if (response.data && response.data.data) {
      return response.data.data; // Trả về data từ cấu trúc mới
    }
    
    return response.data; // Trả về dữ liệu profile (cấu trúc cũ)
  } catch (error) {
    console.error('Get profile API error:', error);
    
    // Xử lý lỗi theo cấu trúc mới
    if (error.response && error.response.data) {
      if (error.response.data.error) {
        throw error.response.data.error;
      } else {
        throw error.response.data;
      }
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

export default getProfileApi;
