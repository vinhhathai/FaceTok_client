import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Link, 
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import { forgotPassword, verifyOTP, resetPassword } from '../../redux';
import { handleError, showSuccess } from '../../../../shared/utils';

// Form steps
const steps = ['Yêu cầu đặt lại', 'Xác nhận mã OTP', 'Đặt mật khẩu mới'];

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State cho multi-step form
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userId, setUserId] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Cập nhật form data
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Xóa lỗi chung nếu có
    if (generalError) {
      setGeneralError('');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Form validation based on current step
  const validateStep = () => {
    const newErrors = {};
    
    switch (activeStep) {
      case 0: // Email step
        if (!formData.email) {
          newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email không hợp lệ';
        }
        break;
        
      case 1: // OTP step
        if (!formData.otp) {
          newErrors.otp = 'Mã OTP là bắt buộc';
        } else if (formData.otp.length !== 6) {
          newErrors.otp = 'Mã OTP phải có 6 ký tự';
        }
        break;
        
      case 2: // Reset password step
        if (!formData.password) {
          newErrors.password = 'Mật khẩu mới là bắt buộc';
        } else if (formData.password.length < 6) {
          newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True nếu không có lỗi
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validate form theo step
    if (!validateStep()) {
      return;
    }
    
    // 2. Set loading state
    setLoading(true);
    setGeneralError('');
    
    try {
      switch (activeStep) {
        case 0: // Email step - Send OTP
          await handleSendOTP();
          break;
          
        case 1: // OTP step - Verify OTP
          await handleVerifyOTP();
          break;
          
        case 2: // Reset password step
          await handleResetPassword();
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setGeneralError('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gửi OTP
  const handleSendOTP = async () => {
    const resultAction = await dispatch(forgotPassword({ email: formData.email }));
    
    if (forgotPassword.fulfilled.match(resultAction)) {
      // Success
      showSuccess('Mã OTP đã được gửi đến email của bạn!');
      
      // Lưu userId cho bước tiếp theo nếu có
      if (resultAction.payload?.userId) {
        setUserId(resultAction.payload.userId);
      }
      
      // Chuyển sang bước tiếp theo
      setActiveStep(1);
    } else if (forgotPassword.rejected.match(resultAction)) {
      // Error
      const fieldErrors = handleError(resultAction.payload);
      
      if (Object.keys(fieldErrors).length === 0 && resultAction.payload?.error?.message) {
        setGeneralError(resultAction.payload.error.message);
      } else {
        setErrors(fieldErrors);
      }
    }
  };

  // Xử lý xác nhận OTP
  const handleVerifyOTP = async () => {
    const resultAction = await dispatch(verifyOTP({ 
      userId,
      otp: formData.otp 
    }));
    
    if (verifyOTP.fulfilled.match(resultAction)) {
      // Success
      showSuccess('Mã OTP đã được xác nhận!');
      
      // Chuyển sang bước tiếp theo
      setActiveStep(2);
    } else if (verifyOTP.rejected.match(resultAction)) {
      // Error
      const fieldErrors = handleError(resultAction.payload);
      
      if (Object.keys(fieldErrors).length === 0 && resultAction.payload?.error?.message) {
        setGeneralError(resultAction.payload.error.message);
      } else {
        setErrors(fieldErrors);
      }
    }
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async () => {
    const resultAction = await dispatch(resetPassword({
      userId,
      password: formData.password
    }));
    
    if (resetPassword.fulfilled.match(resultAction)) {
      // Success
      showSuccess('Mật khẩu đã được đặt lại thành công!');
      
      // Chuyển hướng đến trang đăng nhập
      navigate("/login", { replace: true });
    } else if (resetPassword.rejected.match(resultAction)) {
      // Error
      const fieldErrors = handleError(resultAction.payload);
      
      if (Object.keys(fieldErrors).length === 0 && resultAction.payload?.error?.message) {
        setGeneralError(resultAction.payload.error.message);
      } else {
        setErrors(fieldErrors);
      }
    }
  };

  // Nội dung form theo step
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Email step
        return (
          <>
            <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              Nhập email của bạn để nhận mã xác thực
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Địa chỉ Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="Nhập email của bạn"
            />
          </>
        );
        
      case 1: // OTP step
        return (
          <>
            <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              Nhập mã OTP đã được gửi đến email của bạn
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="Mã OTP"
              name="otp"
              autoComplete="off"
              autoFocus
              value={formData.otp}
              onChange={handleChange}
              error={!!errors.otp}
              helperText={errors.otp}
              placeholder="Nhập mã OTP (6 ký tự)"
              inputProps={{ maxLength: 6 }}
            />
          </>
        );
        
      case 2: // Reset password step
        return (
          <>
            <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              Tạo mật khẩu mới cho tài khoản của bạn
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu mới"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="Nhập mật khẩu mới"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              placeholder="Nhập lại mật khẩu mới"
            />
          </>
        );
        
      default:
        return "Bước không xác định";
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" align="center" sx={{ mb: 3, fontWeight: 600 }}>
        Quên mật khẩu
      </Typography>
      
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* General error alert */}
      {generalError && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {generalError}
        </Alert>
      )}
      
      {/* Step content */}
      <Box sx={{ mt: 2, mb: 2 }}>
        {getStepContent(activeStep)}
      </Box>
      
      {/* Submit button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          activeStep === steps.length - 1 ? 'Hoàn tất' : 'Tiếp tục'
        )}
      </Button>
      
      {/* Links */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Nhớ mật khẩu?{' '}
          <Link component={RouterLink} to="/login" variant="body2">
            Đăng nhập
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;