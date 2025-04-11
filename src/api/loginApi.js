import axios from 'axios';
import { link_api } from '../config/api-config';

async function loginApi(email, password) {
    return await axios.post(link_api.LOGIN_LINK, { email, password })
        .then(response => {
            console.log('Login API response:', response.data);
            // Trả về response.data.data nếu có, mặc định là response.data
            // Response mới sẽ có cấu trúc { data: {...}, success: true, statusCode: 200 }
            return response.data.data || response.data;
        })
        .catch(error => {
            console.error('Login error:', error.response?.data);
            // Trả về lỗi đúng cấu trúc
            if (error.response?.data?.error) {
                throw error.response.data.error;
            }
            throw error;
        });
}

export default loginApi;
