import axios from 'axios';
import { link_api } from '../config/api-config';

async function loginApi(email, password) {
    return await axios.post(link_api.LOGIN_LINK, { email, password })
        .then(response => {
            console.log('Login API response:', response.data);
            // Trả về đúng format từ server mới
            if (response.data.accessToken) {
                return {
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                };
            }
            // Fallback to old format if needed
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
