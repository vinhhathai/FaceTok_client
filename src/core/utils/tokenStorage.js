/**
 * User State Storage Utility
 * 
 * Manage user info and UI state in localStorage
 * NOTE: Tokens are stored in httpOnly cookies (server-side) for security
 */

export const UserStorage = {
  /**
   * Store user info (non-sensitive data only)
   */
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  /**
   * Get user info
   */
  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Update user info
   */
  updateUser: (updates) => {
    const currentUser = UserStorage.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      UserStorage.setUser(updatedUser);
      return updatedUser;
    }
    return null;
  },

  /**
   * Clear user data
   */
  clearUser: () => {
    localStorage.removeItem('user');
  },

  /**
   * Store UI preferences
   */
  setPreference: (key, value) => {
    try {
      const preferences = UserStorage.getPreferences();
      preferences[key] = value;
      localStorage.setItem('preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error setting preference:', error);
    }
  },

  /**
   * Get all preferences
   */
  getPreferences: () => {
    try {
      const prefs = localStorage.getItem('preferences');
      return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {};
    }
  },

  /**
   * Get specific preference
   */
  getPreference: (key, defaultValue = null) => {
    const preferences = UserStorage.getPreferences();
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
  },

  /**
   * Clear all data
   */
  clearAll: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('preferences');
  }
};

export default UserStorage;
