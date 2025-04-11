import axios from 'axios';
import { link_api } from '../config/api-config';
 
async function signUpApi(fullName, password, confirmPassword, email) {
    return await axios.post(link_api.REGISTER_LINK, {
        fullName: fullName,
        password: password,
        confirmPassword,
        email: email,
    })
    .then(response => {
        console.log('Sign up API response:', response.data);
        // Trả về response.data.data nếu có, mặc định là response.data
        return response.data.data || response.data;
    })
    .catch(error => {
        console.error('Sign up error:', error.response?.data);
        // Trả về lỗi đúng cấu trúc
        if (error.response?.data?.error) {
            throw error.response.data.error;
        }
        throw error;
    });
}

export default signUpApi;
