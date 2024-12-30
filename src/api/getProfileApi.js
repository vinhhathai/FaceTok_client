import axios from "axios";
import { link_api } from "../config/api-config"

async function getProfileApi(userId) {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const response = await axios.get(`${link_api.GET_PROFILE_LINK}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Trả về dữ liệu profile
  } catch (error) {
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
}

export default getProfileApi;
