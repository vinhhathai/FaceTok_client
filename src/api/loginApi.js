import axios from 'axios';
import { link_api } from '../config/api-config';

async function loginApi(email, password) {
    return await axios.post(link_api.LOGIN_LINK, { email, password })
        .then(response => {
            console.log(response.data)
            return response.data;
        })
        .catch(error => {
            // Xử lý lỗi nếu cần
            throw error;
        });
}

export default loginApi;
