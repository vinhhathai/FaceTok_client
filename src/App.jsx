import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import './App.css';
import { ThemeProvider, CssBaseline, useTheme } from "@mui/material";
import socketService from "./services/socketService";

// Import CSS files


// Import pages
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import MessagePage from './pages/MessagePage/MessagePage';
import FriendsPage from './pages/FriendsPage/FriendsPage';

// Toast notifications
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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
  const [initializing, setInitializing] = useState(true);
  const { isAuthenticated, user } = useSelector(state => state.user || {});
  const theme = useTheme();

  useEffect(() => {
    // Initialize user data from token
    const initApp = async () => {
      try {
        await dispatch(setUserFromToken());
        
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
  }, [dispatch]);

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App; 