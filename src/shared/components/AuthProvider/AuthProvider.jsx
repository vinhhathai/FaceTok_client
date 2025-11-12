import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '@auth/redux/slices/authSlice';
import { getCookie } from '@utils/cookieUtils';

const TOKEN_COOKIE_NAME = process.env.REACT_APP_AUTH_TOKEN_NAME || 'auth_token';

/**
 * AuthProvider component that handles authentication state
 * It fetches the current user's data if a token exists in cookies
 */
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if token exists in cookie
    const token = getCookie(TOKEN_COOKIE_NAME);
    
    // Only fetch user data if we have a token but no user in state
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [user, dispatch]);

  // Simply render children - this component only handles authentication state
  return <>{children}</>;
};

export default AuthProvider; 