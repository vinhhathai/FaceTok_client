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
// import './assets/js/video.js'
import './assets/js/load.js'

import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Pages
import SignUpPage from './pages/SignUpPage/SignUpPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage.jsx';

// Protected Pages
import HomePage from './pages/HomePage/HomePage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';

// HOC for protecting routes
import withAuth from './utils/withAuth';

// Wrap components with auth protection
const ProtectedHomePage = withAuth(HomePage);
const ProtectedProfilePage = withAuth(ProfilePage);

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
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/auth/sign-up" element={<SignUpPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedHomePage />} />
            <Route path="/search/see-more" element={<ProtectedHomePage />} />
            <Route path="/profile/:id" element={<ProtectedProfilePage />} />
            
            {/* Redirect any unknown routes to login */}
            <Route path="*" element={<RedirectToLogin />} />
          </Routes>
        </BrowserRouter>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;