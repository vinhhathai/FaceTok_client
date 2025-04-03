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
    console.log(response.data)
    return response.data; // Trả về dữ liệu profile
  } catch (error) {
    throw error.response ? error.response.data : new Error("Unknown error occurred");
  }
}

export default getProfileApi;
