import axios from 'axios';

async function loginApi(username, password) {
    return await axios.post('http://localhost:9999/login', { username, password })
        .then(response => {
            // Xử lý dữ liệu phản hồi nếu cần
            return response.data;
        })
        .catch(error => {
            // Xử lý lỗi nếu cần
            throw error;
        });
}

export default loginApi;
