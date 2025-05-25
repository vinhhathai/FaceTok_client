/**
 * Cookie utility functions for authentication
 */

/**
 * Sets a cookie with the provided name, value, and options.
 * @param {string} name - The name of the cookie.
 * @param {string|object} value - The value to store in the cookie.
 * @param {object} options - Cookie options like expiration.
 */
export const setCookie = (name, value, options = {}) => {
  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    // Default options
    const defaultOptions = {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };
    
    // Combine default options with provided options
    const cookieOptions = { ...defaultOptions, ...options };
    
    // Set expiry if provided
    if (options.expires) {
      if (typeof options.expires === 'number') {
        // Convert days to date
        const date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        cookieOptions.expires = date.toUTCString();
      } else {
        cookieOptions.expires = options.expires;
      }
    }
    
    // Build cookie string
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(stringValue)}`;
    
    // Add options to cookie string
    Object.entries(cookieOptions).forEach(([key, value]) => {
      if (value === true) {
        cookieString += `; ${key}`;
      } else if (value) {
        cookieString += `; ${key}=${value}`;
      }
    });
    
    // Set the cookie
    document.cookie = cookieString;
    return true;
  } catch (error) {
    console.error('Error setting cookie:', error);
    return false;
  }
};

/**
 * Gets a cookie value by name.
 * @param {string} name - The name of the cookie to get.
 * @returns {string|object|null} The cookie value or null if not found.
 */
export const getCookie = (name) => {
  try {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${encodeURIComponent(name)}=`));
    
    if (!cookie) return null;
    
    const value = cookie.split('=')[1];
    const decodedValue = decodeURIComponent(value);
    
    // Try to parse as JSON, return as string if parsing fails
    try {
      return JSON.parse(decodedValue);
    } catch (e) {
      return decodedValue;
    }
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

/**
 * Removes a cookie by setting its expiration date to the past.
 * @param {string} name - The name of the cookie to remove.
 * @param {object} options - Cookie options like path.
 */
export const removeCookie = (name, options = {}) => {
  try {
    const defaultOptions = { path: '/' };
    const cookieOptions = { ...defaultOptions, ...options, expires: new Date(0) };
    
    setCookie(name, '', cookieOptions);
    return true;
  } catch (error) {
    console.error('Error removing cookie:', error);
    return false;
  }
}; 