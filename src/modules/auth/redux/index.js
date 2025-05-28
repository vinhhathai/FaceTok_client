import authReducer, {
  login,
  logout, 
  clearError,
  register,
  forgotPassword,
  verifyOTP,
  resetPassword
} from './slices/authSlice';

const resetPasswordState = () => ({ type: 'auth/resetPasswordState' });

// Export all actions
export {
  login,
  logout, 
  clearError,
  register,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resetPasswordState
};

// Export reducer mặc định
export default authReducer; 