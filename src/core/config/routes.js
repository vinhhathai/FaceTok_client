import { lazy, Suspense } from 'react';
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

const LoginPage = lazy(() => import('../../modules/auth/pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../../modules/auth/pages/RegisterPage/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../../modules/auth/pages/ForgotPasswordPage/ForgotPasswordPage'));

const withSuspense = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const routes = [
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
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
]; 