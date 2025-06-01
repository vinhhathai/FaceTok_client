import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const Loading = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// Auth pages
const LoginPage = lazy(() => import('../../modules/auth/pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../../modules/auth/pages/RegisterPage/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../../modules/auth/pages/ForgotPasswordPage/ForgotPasswordPage'));

// Public pages
const HomePage = lazy(() => import('../../modules/post/pages/HomePage/HomePage'));

// User pages
const ProfilePage = lazy(() => import('../../modules/user/pages/ProfilePage/ProfilePage'));

// Friend pages
const FriendPage = lazy(() => import('../../modules/friend/pages/FriendPage/FriendPage'));

const withSuspense = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const routes = [
  // Auth Routes
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage),
  },
  {
    path: '/forgot-password',
    element: withSuspense(ForgotPasswordPage),
  },
  
  // Public Routes
  {
    path: '/home',
    element: withSuspense(HomePage),
  },
  
  // User Routes
  {
    path: '/profile',
    element: withSuspense(ProfilePage),
  },
  {
    path: '/profile/:userId',
    element: withSuspense(ProfilePage),
  },
  
  // Friend Routes
  {
    path: '/friends',
    element: withSuspense(FriendPage),
  },
  
  // Default redirect
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  
  // Catch all other routes and redirect to login
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]; 