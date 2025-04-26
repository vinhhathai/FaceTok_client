import Cookies from 'js-cookie';

/**
 * Get authentication token from cookies
 * @returns {string|null} The access token or null if not found
 */
export const getTokenFromCookies = () => {
  try {
    const accountInfo = Cookies.get('accountInformation');
    if (accountInfo) {
      const parsedInfo = JSON.parse(accountInfo);
      return parsedInfo.accessToken || null;
    }
    
    // Fallback to direct accessToken cookie if accountInformation is not found
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      return accessToken;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting token from cookies:', error);
    return null;
  }
};

/**
 * Save authentication data to cookies
 * @param {Object} data - The data to save
 * @param {string} cookieName - The name of the cookie
 * @param {number} expiresInDays - The number of days the cookie should last
 * @returns {boolean} - Whether the operation was successful
 */
export const saveAuthToCookies = (data, cookieName = 'accountInformation', expiresInDays = 7) => {
  try {
    const valueToStore = typeof data === 'object' ? JSON.stringify(data) : String(data);
    
    Cookies.set(cookieName, valueToStore, { 
      expires: expiresInDays, 
      path: '/',
      sameSite: 'strict'
    });
    
    return true;
  } catch (error) {
    console.error('Error saving auth data to cookies:', error);
    return false;
  }
};

/**
 * Remove authentication cookies
 * @param {string} cookieName - The name of the cookie to remove
 */
export const removeAuthCookies = (cookieName = 'accountInformation') => {
  try {
    Cookies.remove(cookieName, { path: '/' });
    // Also remove accessToken for safety
    Cookies.remove('accessToken', { path: '/' });
    return true;
  } catch (error) {
    console.error('Error removing auth cookies:', error);
    return false;
  }
}; 