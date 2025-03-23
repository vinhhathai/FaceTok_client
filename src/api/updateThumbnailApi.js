// api/profileApi.js
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import JWT decode for token handling

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/';
console.log(API_BASE_URL)

// Get the auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('accessToken');
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

// Function to update profile thumbnail
export const updateProfileThumbnail = async (file) => {
    if (!file) {
        throw new Error('File is required');
    }
    
    // Get userId from token
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error('User ID could not be extracted from token');
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    try {
        const token = getAuthToken();
        
        if (!token) {
            throw new Error('Authentication token not found');
        }
        
        const response = await axios.put(
            `${API_BASE_URL}user/update-thumbnail/${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return {
            success: true,
            imageUrl: response.data.thumbnailUrl,
            message: response.data.message
        };
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};