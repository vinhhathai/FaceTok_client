import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
      const checkAuth = () => {
        const accountInfo = Cookies.get('accountInformation');
        
        if (!accountInfo) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        try {
          const parsedInfo = JSON.parse(accountInfo);
          
          // Improved token validation check
          if (parsedInfo && parsedInfo.accessToken && parsedInfo.accessToken.trim() !== '') {
            // Check if token has expired (if it contains expiration info)
            const currentTime = Math.floor(Date.now() / 1000);
            let tokenExpired = false;
            
            if (parsedInfo.expiresAt && parsedInfo.expiresAt < currentTime) {
              tokenExpired = true;
            }
            
            if (!tokenExpired) {
              setIsAuthenticated(true);
              
              // Check if user is admin if adminOnly option is true
              if (options.adminOnly) {
                // Assuming user role is stored in cookie or can be extracted from token
                setIsAdmin(parsedInfo.role === 'admin');
              }
            } else {
              setIsAuthenticated(false);
              // Clear expired token
              Cookies.remove('accountInformation');
            }
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error parsing account info:', error);
          setIsAuthenticated(false);
        }
        
        setLoading(false);
      };

      checkAuth();
    }, []);

    if (loading) {
      return <LoadingSpinner text="Đang xác thực..." fullScreen />;
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