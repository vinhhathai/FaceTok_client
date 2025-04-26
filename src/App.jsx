import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import './App.css';
import { ThemeProvider, CssBaseline, useTheme } from "@mui/material";
import socketService from "./services/socketService";
import Cookies from 'js-cookie';

// Import CSS files


// Import pages
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import MessagePage from './pages/MessagePage/MessagePage';
import FriendsPage from './pages/FriendsPage/FriendsPage';

// Toast notifications - used with the standardized toast utils in src/utils/toast.js
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setUserFromToken } from './redux/features/userSlice';
import { fetchFriends, fetchFriendRequests } from './redux/features/friendSlice';

// Loading component
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

// HOC for protecting routes
import withAuth from './utils/withAuth.js';

// Wrap components with auth protection
const ProtectedHomePage = withAuth(HomePage);
const ProtectedProfilePage = withAuth(ProfilePage);
const ProtectedMessagePage = withAuth(MessagePage);
const ProtectedFriendsPage = withAuth(FriendsPage);

// Component to redirect to login with return URL
const RedirectToLogin = () => {
  const location = useLocation();
  return (
    <Navigate 
      to="/auth/login" 
      state={{ from: location.pathname }}
      replace 
    />
  );
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [initializing, setInitializing] = useState(true);
  const { isAuthenticated, user } = useSelector(state => state.user || {});
  const theme = useTheme();

  useEffect(() => {
    // Initialize user data from token
    const initApp = async () => {
      try {
        console.log("App initializing, current path:", location.pathname);
        
        // Check if we have tokens
        const accessToken = Cookies.get('accessToken');
        const accountInfo = Cookies.get('accountInformation');
        
        console.log("Tokens at startup:", {
          hasAccessToken: !!accessToken, 
          hasAccountInfo: !!accountInfo
        });
        
        // Load user data if tokens exist
        if (accessToken || accountInfo) {
          await dispatch(setUserFromToken());
          console.log("User data loaded from tokens");
        }
        
        // Wait a bit to ensure user is properly initialized
        setTimeout(() => {
          setInitializing(false);
        }, 300);
      } catch (error) {
        console.error("Error initializing app:", error);
        setInitializing(false);
      }
    };

    initApp();
  }, [dispatch, location.pathname]);

  // Handle redirection after authentication
  useEffect(() => {
    if (!initializing && isAuthenticated && user?._id) {
      console.log("App: User is authenticated, current path:", location.pathname);
      
      // If on login page but already authenticated, redirect to home
      if (location.pathname.includes('/auth/login')) {
        console.log("Already authenticated but on login page, redirecting to home");
        navigate('/', { replace: true });
      }
    }
  }, [initializing, isAuthenticated, user, location.pathname, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Initializing socket connection from App component");
      const token = socketService.getTokenFromCookie();
      if (token) {
        socketService.initializeSocket(token);
      } else {
        console.error("No token available for socket connection");
      }
      
      // Fetch friends data
      dispatch(fetchFriends());
      dispatch(fetchFriendRequests());
    } else {
      console.log("User not authenticated, socket not initialized");
      socketService.closeSocket();
    }

    return () => {
      socketService.closeSocket();
    };
  }, [isAuthenticated, user, dispatch]);

  // Show loading spinner during initialization
  if (initializing) {
    return <LoadingSpinner text="Đang tải ứng dụng..." fullScreen />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth/sign-up" element={<SignUpPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedHomePage />} />
        <Route path="/search/see-more" element={<ProtectedHomePage />} />
        <Route path="/profile/:id" element={<ProtectedProfilePage />} />
        <Route path="/messages" element={<ProtectedMessagePage />} />
        <Route path="/friends" element={<ProtectedFriendsPage />} />
        
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<RedirectToLogin />} />
      </Routes>
      {/* 
        Toast Container for displaying notifications
        Configuration here should match the default settings in utils/toast.js
      */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App; 