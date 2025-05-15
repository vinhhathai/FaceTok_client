import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link, CircularProgress } from '@mui/material';
import { register } from '../../redux/actions';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    setLoading(true);
    
    try {
      await dispatch(register(formData));
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);
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
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
        className={styles.formControl}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        className={styles.formControl}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        className={styles.formControl}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={formData.confirmPassword}
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
        className={styles.registerButton}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Register'
        )}
      </Button>
      
      <Box className={styles.loginContainer}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" className={styles.loginLink}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm; 