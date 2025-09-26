import { getCookie } from './cookieUtils';

/**
 * Get authentication token from cookie
 * @returns {string|null} The authentication token or null if not found
 */
export const getToken = () => {
  const TOKEN_COOKIE_NAME = process.env.REACT_APP_AUTH_TOKEN_NAME || 'auth_token';
  return getCookie(TOKEN_COOKIE_NAME);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getToken();
};