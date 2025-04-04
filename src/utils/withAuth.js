import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { setUserFromToken } from '../redux/features/userSlice';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

/**
 * HOC bảo vệ các route yêu cầu xác thực
 * @param {React.Component} Component - Component cần được bảo vệ
 * @param {Object} options - Các tùy chọn
 * @param {boolean} options.adminOnly - Nếu true, chỉ admin mới được phép truy cập
 * @returns {React.Component} - Wrapped component với xác thực
 */
const withAuth = (Component, options = {}) => {
  const WithAuthComponent = (props) => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    
    // Get authentication state from Redux
    const { isAuthenticated, id } = useSelector(state => state.user);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // First check if Redux already has the user authenticated
          if (isAuthenticated && id) {
            setLoading(false);
            return;
          }
          
          const accountInfo = Cookies.get('accountInformation');
          
          if (!accountInfo) {
            setLoading(false);
            return;
          }

          // If we have account info in cookie but not in Redux, load it
          try {
            const parsedInfo = JSON.parse(accountInfo);
            
            // Check if token exists and is valid
            if (parsedInfo && parsedInfo.accessToken && parsedInfo.accessToken.trim() !== '') {
              // Check if token has expired (if it contains expiration info)
              const currentTime = Math.floor(Date.now() / 1000);
              let tokenExpired = false;
              
              if (parsedInfo.expiresAt && parsedInfo.expiresAt < currentTime) {
                tokenExpired = true;
              }
              
              if (!tokenExpired) {
                // Load user data into Redux from token
                dispatch(setUserFromToken());
                
                // Give a small delay to ensure Redux state updates
                setTimeout(() => {
                  setLoading(false);
                }, 500);
                
                return;
              } else {
                // Clear expired token
                Cookies.remove('accountInformation');
                setLoading(false);
              }
            } else {
              setLoading(false);
            }
          } catch (error) {
            console.error('Error parsing account info:', error);
            setLoading(false);
          }
        } catch (error) {
          console.error('Authentication check error:', error);
          setLoading(false);
        }
      };

      checkAuth();
    }, [dispatch, isAuthenticated, id]);

    if (loading) {
      return (
        <LoadingSpinner 
          text="Đang tải trang..." 
          fullScreen 
        />
      );
    }

    if (!isAuthenticated) {
      // Redirect to login with return URL
      return (
        <Navigate 
          to="/auth/login" 
          state={{ from: location.pathname }} 
          replace 
        />
      );
    }

    if (options.adminOnly && !isAdmin) {
      // Redirect to homepage if not admin
      return <Navigate to="/" replace />;
    }

    return <Component {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth; 