import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import './App.css';

// Import CSS files
import './assets/css/bootstrap/bootstrap.min.css';
import './assets/css/boxicons.min.css'
import './assets/css/style.css'
import './assets/css/components.css'
import './assets/css/media.css'
import './assets/css/chat.css'
import './assets/css/video.css'
import './assets/css/auth.css'
import './assets/css/forms.css'
import './assets/css/profile.css'
import './assets/js/load.js'

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

// Socket service
import socketService from './services/socketService';

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

  // Initialize socket and fetch friends data when user is authenticated
  useEffect(() => {
    if (!initializing && isAuthenticated && user) {
      // Initialize socket connection
      socketService.initSocket();
      
      // Fetch friends data
      dispatch(fetchFriends());
      dispatch(fetchFriendRequests());
      
      // Cleanup socket on app unmount
      return () => {
        socketService.closeSocket();
      };
    }
  }, [initializing, isAuthenticated, user, dispatch]);

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