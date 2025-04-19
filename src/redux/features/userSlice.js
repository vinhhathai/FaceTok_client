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
    console.log('Getting user from token...');
    const accountInfo = Cookies.get('accountInformation');
    console.log('Cookie accountInformation:', accountInfo ? 'Found' : 'Not found');
    
    if (accountInfo) {
      let parsedAccountInfo;
      try {
        parsedAccountInfo = JSON.parse(accountInfo);
        console.log('Parsed account info:', parsedAccountInfo ? 'Success' : 'Failed');
      } catch (parseError) {
        console.error('Error parsing accountInformation:', parseError);
        console.log('Raw cookie content:', accountInfo);
        return null;
      }
      
      if (parsedAccountInfo && parsedAccountInfo.accessToken) {
        console.log('AccessToken found in cookie');
        let decoded;
        
        try {
          decoded = jwtDecode(parsedAccountInfo.accessToken);
          console.log('Decoded token (full):', decoded);
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          return null;
        }
        
        if (decoded) {
          // Lấy ID từ token - ID có thể là _id, id hoặc userId tùy vào cấu trúc token
          const userId = decoded._id || decoded.id || decoded.userId || '';
          
          if (!userId) {
            console.error('No user ID found in token. Available fields:', Object.keys(decoded));
            return null;
          }
          
          console.log('Successfully extracted user data from token, userId:', userId);
          
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
      } else {
        console.error('No accessToken found in parsed accountInformation');
      }
    } else {
      console.log('Checking for direct accessToken cookie');
      const accessToken = Cookies.get('accessToken');
      
      if (accessToken) {
        console.log('Direct accessToken found');
        let decoded;
        
        try {
          decoded = jwtDecode(accessToken);
          console.log('Decoded direct token (full):', decoded);
          
          if (decoded) {
            const userId = decoded._id || decoded.id || decoded.userId || '';
            
            if (!userId) {
              console.error('No user ID found in direct token. Available fields:', Object.keys(decoded));
              return null;
            }
            
            console.log('Successfully extracted user data from direct token, userId:', userId);
            
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
        } catch (decodeError) {
          console.error('Error decoding direct token:', decodeError);
        }
      } else {
        console.log('No authentication tokens found in cookies');
      }
    }
    return null;
  } catch (error) {
    console.error('Error in getUserFromToken:', error);
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