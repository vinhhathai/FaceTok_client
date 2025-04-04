import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Thiết lập giá trị cho localStorage để sử dụng trong các components khác
const updateLocalUserData = (userData) => {
  if (userData && userData._id) {
    localStorage.setItem('userId', userData._id);
    
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
            user: {
              _id: userId,
              fullName: decoded.fullName || decoded.name || '',
              profilePicture: decoded.profilePicture || '',
              username: decoded.username || decoded.fullName || '',
              email: decoded.email || ''
            },
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
  user: {
    _id: localStorage.getItem('userId') || '',
    profilePicture: localStorage.getItem('userProfilePicture') || '',
    fullName: localStorage.getItem('userFullName') || '',
    thumbnail: localStorage.getItem('userThumbnail') || '',
    username: localStorage.getItem('userFullName') || '',
    email: ''
  },
  isAuthenticated: false,
};

// Đảm bảo lưu dữ liệu vào localStorage cho lần sau
if (initialUserState.user && initialUserState.user._id) {
  updateLocalUserData(initialUserState.user);
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
        state.user = userData.user;
        state.isAuthenticated = true;
        
        // Cập nhật localStorage để các components khác có thể truy cập
        updateLocalUserData(userData.user);
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
      state.user.profilePicture = action.payload;
    },
    
    // Cập nhật thumbnail người dùng
    updateUserThumbnail: (state, action) => {
      const thumbnailUrl = action.payload;
      state.user.thumbnail = thumbnailUrl;
      
      // Lưu vào localStorage
      localStorage.setItem('userThumbnail', thumbnailUrl);
    },
    
    // Cập nhật thông tin người dùng (để cập nhật sau khi người dùng thay đổi profile)
    updateUserInfo: (state, action) => {
      const { fullName, profilePicture, username, email } = action.payload;
      
      if (fullName) {
        state.user.fullName = fullName;
        localStorage.setItem('userFullName', fullName);
      }
      
      if (profilePicture) {
        state.user.profilePicture = profilePicture;
        localStorage.setItem('userProfilePicture', profilePicture);
      }
      
      if (username) {
        state.user.username = username;
      }
      
      if (email) {
        state.user.email = email;
      }
    },
    
    // Đăng xuất - xóa thông tin người dùng
    clearUserData: (state) => {
      state.user = {
        _id: '',
        fullName: '',
        profilePicture: '',
        thumbnail: '',
        username: '',
        email: ''
      };
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