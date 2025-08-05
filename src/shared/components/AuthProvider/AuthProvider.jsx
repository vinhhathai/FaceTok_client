import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '@auth/redux/slices/authSlice';

/**
 * AuthProvider component that handles authentication state
 * It fetches the current user's data if a token exists
 */
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch user data if we have a token but no user
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

  // Simply render children - this component only handles authentication state
  return <>{children}</>;
};

export default AuthProvider; 