import axios from 'axios';
import { link_api } from '../config/api-config';
 
/**
 * Gọi API đăng ký tài khoản
 * @param {string} fullName - Họ tên của người dùng
 * @param {string} password - Mật khẩu
 * @param {string} confirmPassword - Xác nhận mật khẩu
 * @param {string} email - Email
 * @returns {Promise<Object>} - Kết quả đăng ký
 */
async function signUpApi(fullName, password, confirmPassword, email) {
    try {
        const response = await axios.post(link_api.REGISTER_LINK, {
            fullName,
            password,
        confirmPassword,
            email
        });
        
        console.log('Sign up API response:', response.data);
        
        // Kiểm tra response từ server
        if (!response.data || !response.data.success) {
            throw new Error(response.data?.error?.message || 'Đăng ký thất bại');
        }
        
        // Lấy dữ liệu từ response
        const { data } = response.data;
        
        return {
            status: true,
            user: data.user,
            message: response.data.message || 'Đăng ký thành công'
        };
    } catch (error) {
        console.error('Sign up error:', error);
        
        // Xử lý lỗi từ server
        if (error.response?.data?.error) {
            throw {
                status: false,
                error: error.response.data.error
            };
        }
        
        // Lỗi network hoặc lỗi không xác định
        throw {
            status: false,
            error: {
                code: 'ERR_NETWORK',
                message: error.message || 'Không thể kết nối đến server'
            }
        };
    }
}

export default signUpApi;
