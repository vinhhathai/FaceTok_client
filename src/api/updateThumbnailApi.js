// api/profileApi.js
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import JWT decode for token handling
import getCookieToken from '../utils/getCookieToken';
import { uploadThumbnailToCloudinary } from '../utils/cloudinaryThumbnailUpload';
import { store } from '../redux/store';
import { updateUserThumbnail } from '../redux/features/userSlice';
import { BASE_URL } from '../config/config';

console.log('Base URL for API:', BASE_URL);

// Get the auth token from cookie
const getAuthToken = () => {
    return getCookieToken();
};

// Function to get userId from token
const getUserIdFromToken = () => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
        const decoded = jwtDecode(token);
        return decoded._id; // Adjust based on your token structure
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Update profile thumbnail using Cloudinary
 * @param {File} file - The image file to upload
 * @param {Function} progressCallback - Optional callback for progress updates
 * @returns {Promise<Object>} - Promise with the response data
 */
export const updateProfileThumbnail = async (file, progressCallback = null) => {
    if (!file) {
        throw new Error('File is required');
    }
    
    try {
        // Get auth token
        const token = getCookieToken();
        
        if (!token) {
            throw new Error('Authentication token not found');
        }

        console.log('Updating thumbnail with token:', token.substring(0, 15) + '...');

        // Tạo URL tạm thời và cập nhật UI ngay lập tức - URL này chỉ hiển thị và không lưu vào localStorage
        const tempURL = URL.createObjectURL(file);
        store.dispatch(updateUserThumbnail(tempURL));

        // 1. Upload file directly to Cloudinary
        console.log('Uploading thumbnail to Cloudinary...');
        const cloudinaryUrl = await uploadThumbnailToCloudinary(file, progressCallback);
        console.log('Thumbnail uploaded successfully to Cloudinary:', cloudinaryUrl);

        // 2. Send the Cloudinary URL to our server API
        const apiUrl = `${BASE_URL}/user/update-thumbnail-url`;
        console.log('Sending URL to server API:', apiUrl);
        
        // Log data being sent
        const postData = { thumbnailUrl: cloudinaryUrl };
        console.log('Data being sent:', JSON.stringify(postData));
        
        // Check if thumbnailUrl is properly formed
        if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string' || !cloudinaryUrl.startsWith('http')) {
            throw new Error('Invalid cloudinary URL: ' + cloudinaryUrl);
        }
        
        // Tạo instance mới của axios với cấu hình chi tiết
        const axiosInstance = axios.create({
            baseURL: BASE_URL,
            timeout: 10000, // 10 giây
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        // Log toàn bộ requests và responses
        axiosInstance.interceptors.request.use(request => {
            console.log('Axios Request:', {
                method: request.method,
                url: request.url,
                headers: request.headers,
                data: request.data
            });
            return request;
        });
        
        axiosInstance.interceptors.response.use(
            response => {
                console.log('Axios Response:', {
                    status: response.status,
                    data: response.data,
                    headers: response.headers
                });
                return response;
            },
            error => {
                console.error('Axios Error:', {
                    message: error.message,
                    response: error.response ? {
                        status: error.response.status,
                        data: error.response.data
                    } : 'No response',
                    request: error.request ? 'Request made but no response' : 'No request'
                });
                return Promise.reject(error);
            }
        );
        
        // Gửi request với axiosInstance
        const response = await axiosInstance.put('/user/update-thumbnail-url', postData);

        console.log('Server response:', response.data);

        // 3. Cập nhật thumbnail trong Redux store với URL chính thức từ Cloudinary
        // URL này sẽ được tự động lưu vào localStorage trong reducer
        store.dispatch(updateUserThumbnail(cloudinaryUrl));
        
        // 4. Giải phóng URL tạm thời
        URL.revokeObjectURL(tempURL);

        return {
            success: true,
            imageUrl: cloudinaryUrl,
            message: response.data.message
        };
    } catch (error) {
        console.error('API Error:', error);
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
        }
        
        // Nếu có lỗi, khôi phục lại thumbnail từ localStorage
        const savedThumbnail = localStorage.getItem('userThumbnail');
        if (savedThumbnail) {
            store.dispatch(updateUserThumbnail(savedThumbnail));
        }
        
        throw error;
    }
};