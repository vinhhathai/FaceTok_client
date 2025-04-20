import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
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
    const [authChecked, setAuthChecked] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get authentication state from Redux
    const { isAuthenticated, user } = useSelector(state => state.user || {});
    
    console.log("withAuth - Current route:", location.pathname);
    console.log("withAuth - Auth state:", { isAuthenticated, user: user?._id ? "User present" : "No user" });

    useEffect(() => {
      const checkAuth = async () => {
        try {
          console.log("Checking authentication...");
          
          // First check if Redux already has the user authenticated
          if (isAuthenticated && user && user._id) {
            console.log("Already authenticated in Redux, proceeding");
            setLoading(false);
            setAuthChecked(true);
            return;
          }
          
          // Check for accessToken directly
          const accessToken = Cookies.get('accessToken');
          console.log("Direct accessToken check:", accessToken ? "Found" : "Not found");
          
          // Check for accountInformation 
          const accountInfo = Cookies.get('accountInformation');
          console.log("accountInformation check:", accountInfo ? "Found" : "Not found");
          
          if (!accessToken && !accountInfo) {
            console.log("No authentication tokens found");
            setLoading(false);
            setAuthChecked(true);
            return;
          }

          // If we have tokens but not authenticated in Redux, load data
          console.log("Found auth tokens, dispatching setUserFromToken");
          await dispatch(setUserFromToken());
          
          // Check if authentication succeeded after token loading
          const storeState = await dispatch((_, getState) => {
            return getState().user?.isAuthenticated || false;
          });
          
          console.log("Authentication state after token loading:", storeState);
          
          // Wait a bit for React to update
          setTimeout(() => {
            setLoading(false);
            setAuthChecked(true);
          }, 100);
          
        } catch (error) {
          console.error('Authentication check error:', error);
          setLoading(false);
          setAuthChecked(true);
        }
      };

      if (!authChecked) {
        checkAuth();
      }
    }, [dispatch, isAuthenticated, user, authChecked]);

    // After auth is checked and component is mounted, verify if we should be on this page
    useEffect(() => {
      if (!loading && authChecked) {
        // Get the latest auth state after all checks
        const currentAuthState = user && user._id && isAuthenticated;
        console.log("Final auth check result:", currentAuthState);
        
        if (!currentAuthState && location.pathname !== '/auth/login') {
          console.log("Not authenticated, navigating to login");
          navigate('/auth/login', { state: { from: location.pathname }, replace: true });
        }
      }
    }, [loading, authChecked, isAuthenticated, user, location.pathname, navigate]);

    if (loading) {
      return (
        <LoadingSpinner 
          text="Đang tải trang..." 
          fullScreen 
        />
      );
    }

    // After all checks, if we're still here and not authenticated, show login
    if (!isAuthenticated && !user?._id) {
      // This is a fallback, the useEffect should handle redirection
      console.log("Fallback redirect to login");
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

    console.log("Authentication successful, rendering protected component");
    return <Component {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth; 