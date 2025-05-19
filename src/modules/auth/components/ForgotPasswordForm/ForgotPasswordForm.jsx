import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link, CircularProgress } from '@mui/material';
import { forgotPassword } from '../../redux/actions';
import styles from './ForgotPasswordForm.module.css';

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      return;
    }
    
    setLoading(true);
    
    try {
      await dispatch(forgotPassword(formData.email));
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Đặt lại mật khẩu thất bại:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className={styles.formContainer}>
      <Typography variant="body1" className={styles.description}>
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu.
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
        className={styles.formControl}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={loading}
        className={styles.resetButton}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Gửi'
        )}
      </Button>
      
      <Box className={styles.loginContainer}>
        <Typography variant="body2">
          Bạn đã nhớ mật khẩu?{' '}
          <Link component={RouterLink} to="/login" className={styles.loginLink}>
            Đăng nhập
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm; 