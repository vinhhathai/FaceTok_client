import axios from 'axios';
import { link_api } from '../config/api-config';

/**
 * Gọi API đăng nhập
 * @param {string} email - Email của người dùng
 * @param {string} password - Mật khẩu của người dùng
 * @returns {Promise<Object>} - Thông tin đăng nhập (token và thông tin người dùng)
 */
async function loginApi(email, password) {
    try {
        const response = await axios.post(link_api.LOGIN_LINK, { email, password });
            console.log('Login API response:', response.data);
        
        // Kiểm tra response từ server
        if (!response.data || !response.data.success) {
            throw new Error(response.data?.error?.message || 'Đăng nhập thất bại');
        }
        
        // Lấy dữ liệu từ response
        const { data } = response.data;
        
                return {
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
                };
    } catch (error) {
        console.error('Login error:', error);
        
        // Xử lý lỗi từ server
            if (error.response?.data?.error) {
                throw error.response.data.error;
            }
        
        // Lỗi network hoặc lỗi không xác định
        throw {
            code: 'ERR_NETWORK',
            message: error.message || 'Không thể kết nối đến server'
        };
    }
}

export default loginApi;
