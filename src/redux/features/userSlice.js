import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Thiết lập giá trị cho localStorage để sử dụng trong các components khác
const updateLocalUserData = (userData) => {
  if (userData && userData.id) {
    localStorage.setItem('userId', userData.id);
    
    if (userData.fullName) {
      localStorage.setItem('userFullName', userData.fullName);
    }
    
    if (userData.profilePicture) {
      localStorage.setItem('userProfilePicture', userData.profilePicture);
    }
  }
};

// Lấy thông tin từ token JWT
const getUserFromToken = () => {
  try {
    const accountInfo = Cookies.get('accountInformation');
    if (accountInfo) {
      const parsedAccountInfo = JSON.parse(accountInfo);
      
      if (parsedAccountInfo && parsedAccountInfo.accessToken) {
        const decoded = jwtDecode(parsedAccountInfo.accessToken);
        
        if (decoded) {
          // Lấy ID từ token - ID có thể là _id hoặc id tùy vào cấu trúc token
          const userId = decoded._id || decoded.id || '';
          
          return {
            id: userId,
            fullName: decoded.fullName || decoded.name || '',
            profilePicture: decoded.profilePicture || '',
            isAuthenticated: true
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Khởi tạo state từ token
const initialUserState = getUserFromToken() || {
  id: '',
  profilePicture: localStorage.getItem('userProfilePicture') || '',
  fullName: localStorage.getItem('userFullName') || '',
  thumbnail: localStorage.getItem('userThumbnail') || '',
  isAuthenticated: false,
};

// Đảm bảo lưu dữ liệu vào localStorage cho lần sau
if (initialUserState.id) {
  updateLocalUserData(initialUserState);
}

// Tạo userSlice để quản lý thông tin người dùng hiện tại
const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    // Cập nhật thông tin người dùng từ token
    setUserFromToken: (state) => {
      const userData = getUserFromToken();
      if (userData) {
        state.id = userData.id;
        state.fullName = userData.fullName;
        state.profilePicture = userData.profilePicture;
        state.isAuthenticated = true;
        
        // Cập nhật localStorage để các components khác có thể truy cập
        updateLocalUserData(userData);
      } else {
        state.isAuthenticated = false;
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
      const thumbnailUrl = action.payload;
      state.thumbnail = thumbnailUrl;
      
      // Lưu vào localStorage
      localStorage.setItem('userThumbnail', thumbnailUrl);
    },
    
    // Cập nhật thông tin người dùng (để cập nhật sau khi người dùng thay đổi profile)
    updateUserInfo: (state, action) => {
      const { fullName, profilePicture } = action.payload;
      
      if (fullName) {
        state.fullName = fullName;
        localStorage.setItem('userFullName', fullName);
      }
      
      if (profilePicture) {
        state.profilePicture = profilePicture;
        localStorage.setItem('userProfilePicture', profilePicture);
      }
    },
    
    // Đăng xuất - xóa thông tin người dùng
    clearUserData: (state) => {
      state.id = '';
      state.fullName = '';
      state.profilePicture = '';
      state.thumbnail = '';
      state.isAuthenticated = false;
      
      // Xóa khỏi localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('userFullName');
      localStorage.removeItem('userProfilePicture');
      localStorage.removeItem('userThumbnail');
    }
  }
});

export const { setUserFromToken, updateUserAvatar, updateUserThumbnail, updateUserInfo, clearUserData } = userSlice.actions;

export default userSlice.reducer; 