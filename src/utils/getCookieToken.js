import Cookies from 'js-cookie';

/**
 * Lấy access token từ cookie
 * @returns {string|null} Access token hoặc null nếu không tìm thấy
 */
function getCookieToken() {
  try {
    // Lấy thông tin tài khoản từ cookie
    const accountInfo = Cookies.get('accountInformation');
    
    if (accountInfo) {
      const parsedInfo = JSON.parse(accountInfo);
      return parsedInfo.accessToken || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting token from cookie:', error);
    return null;
  }
}

export default getCookieToken; 