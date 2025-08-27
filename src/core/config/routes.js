import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Loading component
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

// Lazy load components
const LoginPage = lazy(() => import('@auth/pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('@auth/pages/RegisterPage/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@auth/pages/ForgotPasswordPage/ForgotPasswordPage'));
const HomePage = lazy(() => import('@post/pages/HomePage/HomePage'));
const ProfilePage = lazy(() => import('@user/pages/ProfilePage/ProfilePage'));
const ChatPage = lazy(() => import('@message/pages/ChatPage/ChatPage'));
const FriendPage = lazy(() => import('@friend/pages/FriendPage/FriendPage'));
const MessageIndexPage = lazy(() => import('@message/pages/MessageIndexPage/MessageIndexPage'));
const PostDetailPage = lazy(() => import('@post/pages/PostDetailPage/PostDetailPage'));

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
  {
    path: '/post/:postId',
    element: withSuspense(PostDetailPage),
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
  
  // Message Routes
  {
    path: '/messages',
    element: withSuspense(MessageIndexPage),
  },
  {
    path: '/messages/:conversationId',
    element: withSuspense(ChatPage),
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