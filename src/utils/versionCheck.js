// src/utils/versionCheck.js
// Kiểm tra và buộc reload khi có phiên bản mới

const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';
const VERSION_KEY = 'chaotok_app_version';

export const checkAppVersion = () => {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  
  if (storedVersion && storedVersion !== APP_VERSION) {
    console.log(`🔄 New version detected: ${storedVersion} -> ${APP_VERSION}`);
    
    // Clear cache và reload
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    
    // Clear Service Worker cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Force reload
    window.location.reload(true);
    return false;
  }
  
  if (!storedVersion) {
    localStorage.setItem(VERSION_KEY, APP_VERSION);
  }
  
  return true;
};

// Gọi hàm này trong App.jsx
export default checkAppVersion;
