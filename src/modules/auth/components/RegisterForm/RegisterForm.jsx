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
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import { register } from '@auth/redux';
import { createError, showSuccess, formatErrorMessage } from '@utils';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Tên người dùng là bắt buộc';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Tên người dùng không được vượt quá 30 ký tự';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True nếu không có lỗi
  };

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validate form
    if (!validateForm()) {
      return; // Dừng nếu form không hợp lệ
    }
    
    // 2. Set loading state
    setLoading(true);
    setGeneralError('');
    
    try {
      // 3. Call API
      
      
      const resultAction = await dispatch(register(formData));
      console.log('Register result:', resultAction);
      
      // 4. Handle result
      if (register.fulfilled.match(resultAction)) {
        // Success: Show message and redirect to verify email page
        showSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        
        // Redirect to verify email page with email in state
        navigate("/verify-email", { 
          state: { email: formData.email },
          replace: true 
        });
      } else if (register.rejected.match(resultAction)) {
        const errorMessage = formatErrorMessage(resultAction.payload);
        setGeneralError(errorMessage);
      }
    } catch (error) {
      // Unexpected error
      setGeneralError('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className={styles.formContainer}>
      <Typography variant="h5" component="h1" align="center" sx={{ marginBottom: 3, fontWeight: 600 }}>
        Đăng ký tài khoản
      </Typography>
      
      {/* General error alert */}
      {generalError && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {generalError}
        </Alert>
      )}
      
      {/* Username field */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Tên người dùng"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
        error={!!errors.username}
        helperText={errors.username}
        placeholder="Nhập tên người dùng"
      />
      
      {/* Email field */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Địa chỉ Email"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        placeholder="Nhập email của bạn"
      />
      
      {/* Password field */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Mật khẩu"
        type="password"
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        placeholder="Nhập mật khẩu"
      />
      
      {/* Confirm Password field */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        placeholder="Nhập lại mật khẩu"
      />
      
      {/* Register button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Đăng ký'}
      </Button>
      
      {/* Links */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Đã có tài khoản?{' '}
          <Link component={RouterLink} to="/login" variant="body2">
            Đăng nhập
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm; 