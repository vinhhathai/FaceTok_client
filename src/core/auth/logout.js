/**
 * Logout Utility
 * 
 * Handle user logout with API call and cleanup
 * - Tokens stored in httpOnly cookies (secure)
 * - User data stored in localStorage (non-sensitive)
 */

import apiClient from '../../../shared/httpClient/apiClient';
import { removeCookie } from '../../../shared/utils/cookieUtils';
import UserStorage from '../../utils/tokenStorage';

const ACCESS_TOKEN_COOKIE = process.env.REACT_APP_AUTH_TOKEN_NAME || 'auth_token';
const REFRESH_TOKEN_COOKIE = process.env.REACT_APP_REFRESH_TOKEN_NAME || 'refresh_token';

/**
 * Logout user
 * - Call logout API (invalidate refresh token on server)
 * - Clear all cookies (tokens)
 * - Clear user data from localStorage
 * - Redirect to login page
 */
export const logout = async () => {
  try {
    // Call logout API to invalidate refresh token on server
    await apiClient.post('/api/auth/logout');
  } catch (error) {
    // Log error but don't prevent logout
    console.error('Logout API error:', error);
  } finally {
    // Clear all cookies (tokens)
    removeCookie(ACCESS_TOKEN_COOKIE);
    removeCookie(REFRESH_TOKEN_COOKIE);
    
    // Clear user data from localStorage
    UserStorage.clearAll();
    
    // Redirect to login page
    window.location.href = '/login';
  }
};

export default logout;
