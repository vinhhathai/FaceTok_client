# Frontend Refresh Token Setup

## ✅ Đã hoàn thành

### 1. Token Storage (`src/core/utils/tokenStorage.js`)
```javascript
TokenStorage.setTokens(accessToken, refreshToken)
TokenStorage.getAccessToken()
TokenStorage.getRefreshToken()
TokenStorage.clearTokens()
TokenStorage.hasTokens()
TokenStorage.isAuthenticated()
```

### 2. Axios Interceptor (`src/shared/httpClient/apiClient.js`)
- ✅ Auto-inject access token vào headers
- ✅ Detect 401 errors (token expired)
- ✅ Auto-refresh token khi expired
- ✅ Queue requests during refresh
- ✅ Retry failed requests with new token
- ✅ Logout on refresh failure
- ✅ Backward compatible với cookie system

### 3. Redux Auth Slice (`src/modules/auth/redux/slices/authSlice.js`)
- ✅ Store refreshToken in state
- ✅ Save both tokens on login
- ✅ Clear both tokens on logout
- ✅ updateTokens action for manual refresh
- ✅ Backward compatible với cookie

### 4. Logout Utility (`src/core/auth/logout.js`)
- ✅ Call logout API
- ✅ Clear all tokens
- ✅ Redirect to login

## 🔄 Flow hoạt động

### Login Flow
```
1. User login → API returns { accessToken, refreshToken }
2. Store tokens: localStorage + cookie (backward compat)
3. Redux state updated
4. Navigate to home
```

### API Request Flow
```
1. Request API → Interceptor adds access token
2. If 401 (expired):
   a. Get refresh token from storage
   b. Call /api/auth/refresh-token
   c. Save new tokens
   d. Retry original request
3. If refresh fails → Logout user
```

### Logout Flow
```
1. Call /api/auth/logout → Server invalidates refresh token
2. Clear localStorage tokens
3. Clear cookie
4. Redirect to /login
```

## 📝 Sử dụng

### Import và dùng logout
```javascript
import logout from '@core/auth/logout';

// Anywhere in your app
const handleLogout = () => {
  logout();
};
```

### Access tokens trong components
```javascript
import { useSelector } from 'react-redux';
import TokenStorage from '@core/utils/tokenStorage';

const MyComponent = () => {
  // From Redux
  const { token, refreshToken } = useSelector(state => state.auth);
  
  // Or from storage directly
  const accessToken = TokenStorage.getAccessToken();
  
  return <div>...</div>;
};
```

### Manual token refresh (nếu cần)
```javascript
import { useDispatch } from 'react-redux';
import { updateTokens } from '@auth/redux';
import apiClient from '@shared/httpClient/apiClient';

const refreshTokenManually = async () => {
  const refreshToken = TokenStorage.getRefreshToken();
  
  const response = await apiClient.post('/api/auth/refresh-token', {
    refreshToken
  });
  
  if (response.data.success) {
    dispatch(updateTokens({
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    }));
  }
};
```

## ⚙️ Configuration

### Environment Variables
Cần có trong `.env`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AUTH_TOKEN_NAME=auth_token
```

### Axios Base URL
Đảm bảo `apiClient` có đúng baseURL trong `src/shared/httpClient/apiClient.js`:
```javascript
baseURL: process.env.REACT_APP_API_URL
```

## 🧪 Testing

### Test Manual
1. **Login**: Check localStorage có 2 tokens
2. **API Call**: Check Network tab có Authorization header
3. **Token Expired**: 
   - Xóa accessToken từ localStorage
   - Gọi API bất kỳ
   - Check console có log "refreshing token"
   - Check request được retry sau refresh
4. **Logout**: Check localStorage cleared, redirect to /login

### Debug Logs
Thêm logs để debug (temporary):
```javascript
// In apiClient.js interceptor
console.log('[Token Refresh] Starting...');
console.log('[Token Refresh] Success, new token:', accessToken);
console.log('[Token Refresh] Failed:', error);
```

## 🔒 Security Notes

1. **localStorage vs Cookies**
   - Hiện tại dùng localStorage (simple, works với SPA)
   - Backward compatible với cookie system
   - Production: Có thể chuyển sang httpOnly cookies

2. **Token Expiry**
   - Access: 7 days (server-side)
   - Refresh: 30 days (server-side)

3. **XSS Protection**
   - Sanitize user inputs
   - Use Content Security Policy
   - Keep dependencies updated

4. **HTTPS Required**
   - Always use HTTPS in production
   - Tokens không bảo mật trên HTTP

## 🐛 Troubleshooting

### Tokens không được save
- Check localStorage có enabled không
- Check console có errors không
- Verify API response có chứa tokens

### Infinite refresh loop
- Check token expiry times
- Verify refresh API không return 401
- Check interceptor logic

### Logout không work
- Check API endpoint `/api/auth/logout` 
- Verify middleware `checkLogin` applied
- Check network tab for errors

## 📋 Checklist Deployment

- [ ] Test login flow
- [ ] Test token refresh flow
- [ ] Test logout flow
- [ ] Test expired token handling
- [ ] Set proper CORS on server
- [ ] Use HTTPS in production
- [ ] Monitor token refresh rate
- [ ] Set up error tracking (Sentry)

## 🔗 Related Files

**Backend:**
- `/src/modules/auth/services/AuthLoginService.js`
- `/src/modules/auth/controllers/AuthLoginController.js`
- `/src/modules/auth/api/routes.js`
- `/src/modules/user/models/UserModel.js`

**Frontend:**
- `/src/core/utils/tokenStorage.js`
- `/src/core/auth/logout.js`
- `/src/shared/httpClient/apiClient.js`
- `/src/modules/auth/redux/slices/authSlice.js`

**Docs:**
- `/FaceTok_Sever/REFRESH_TOKEN_IMPLEMENTATION.md`

---

**Status:** ✅ Ready for testing
**Last Updated:** 12/11/2025
