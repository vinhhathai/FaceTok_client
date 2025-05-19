import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link, CircularProgress } from '@mui/material';
import { login } from '../../redux/actions';
import styles from './LoginForm.module.css';
import {
  passwordLabelBoxStyles,
  signupContainerBoxStyles,
  formControlStyles,
  passwordFieldStyles,
  loginButtonStyles,
} from './LoginForm.styles';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      // showError("Vui lòng nhập email và mật khẩu");
      return;
    }
    
    setLoading(true);
    
    try {
      await dispatch(login(formData));
      navigate(from || "/", { replace: true });
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      // showError(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className={styles.formContainer}>
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
        sx={formControlStyles}
        className={styles.formControl}
      />
      
      <Box sx={passwordLabelBoxStyles}>
        <Typography variant="body2" component="label" htmlFor="password">
          Mật khẩu
        </Typography>
        <Link 
          component={RouterLink} 
          to="/forgot-password" 
          variant="body2" 
          className={styles.forgotPassword}
        >
          Quên mật khẩu?
        </Link>
      </Box>
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Mật khẩu"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        sx={passwordFieldStyles}
        className={styles.formControl}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={loading}
        sx={loginButtonStyles}
        className={styles.loginButton}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Đăng nhập'
        )}
      </Button>
      
      <Box sx={signupContainerBoxStyles}>
        <Typography variant="body2">
          Chưa có tài khoản?{' '}
          <Link component={RouterLink} to="/register" className={styles.signupLink}>
            Đăng ký ngay
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm; 