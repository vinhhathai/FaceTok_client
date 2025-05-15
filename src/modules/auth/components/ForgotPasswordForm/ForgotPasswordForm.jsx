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
      console.error('Password reset failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className={styles.formContainer}>
      <Typography variant="body1" className={styles.description}>
        Enter your email address and we'll send you instructions to reset your password.
      </Typography>
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
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
          'Send Reset Instructions'
        )}
      </Button>
      
      <Box className={styles.loginContainer}>
        <Typography variant="body2">
          Remember your password?{' '}
          <Link component={RouterLink} to="/login" className={styles.loginLink}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm; 