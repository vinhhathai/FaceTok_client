import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Tạo userSlice để quản lý thông tin người dùng hiện tại
const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    // Khởi tạo từ localStorage trước, nếu không có thì để rỗng
    profilePicture: localStorage.getItem('userProfilePicture') || '',
    fullName: '',
    thumbnail: localStorage.getItem('userThumbnail') || '',
    isAuthenticated: false,
  },
  reducers: {
    // Cập nhật thông tin người dùng từ token
    setUserFromToken: (state) => {
      try {
        const accountInfo = Cookies.get('accountInformation');
        if (accountInfo) {
          const parsedAccountInfo = JSON.parse(accountInfo);
          if (parsedAccountInfo.accessToken) {
            const decoded = jwtDecode(parsedAccountInfo.accessToken);
            state.id = decoded._id;
            state.fullName = decoded.fullName;
            state.isAuthenticated = true;
            
            // Cập nhật profilePicture từ localStorage nếu có, ngược lại lấy từ token và lưu vào localStorage
            const savedProfilePicture = localStorage.getItem('userProfilePicture');
            if (savedProfilePicture) {
              state.profilePicture = savedProfilePicture;
            } else if (decoded.profilePicture) {
              state.profilePicture = decoded.profilePicture;
              localStorage.setItem('userProfilePicture', decoded.profilePicture);
            }
            
            // Cập nhật thumbnail từ localStorage nếu có, ngược lại lấy từ token và lưu vào localStorage
            const savedThumbnail = localStorage.getItem('userThumbnail');
            if (savedThumbnail) {
              state.thumbnail = savedThumbnail;
            } else if (decoded.thumbnail) {
              state.thumbnail = decoded.thumbnail;
              localStorage.setItem('userThumbnail', decoded.thumbnail);
            }
          }
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    },
    
    // Cập nhật avatar người dùng
    updateUserAvatar: (state, action) => {
      // Chỉ lưu vào localStorage nếu là URL Cloudinary thực tế, không phải URL tạm thời
      if (action.payload && !action.payload.startsWith('blob:')) {
        localStorage.setItem('userProfilePicture', action.payload);
      }
      state.profilePicture = action.payload;
    },
    
    // Cập nhật thumbnail người dùng
    updateUserThumbnail: (state, action) => {
      // Chỉ lưu vào localStorage nếu là URL Cloudinary thực tế, không phải URL tạm thời
      if (action.payload && !action.payload.startsWith('blob:')) {
        localStorage.setItem('userThumbnail', action.payload);
      }
      state.thumbnail = action.payload;
    },
    
    // Đăng xuất - xóa thông tin người dùng
    clearUser: (state) => {
      state.id = '';
      state.profilePicture = '';
      state.fullName = '';
      state.thumbnail = '';
      state.isAuthenticated = false;
      
      // Xóa dữ liệu trong localStorage
      localStorage.removeItem('userProfilePicture');
      localStorage.removeItem('userThumbnail');
    }
  }
});

export const { setUserFromToken, updateUserAvatar, updateUserThumbnail, clearUser } = userSlice.actions;

export default userSlice.reducer; 