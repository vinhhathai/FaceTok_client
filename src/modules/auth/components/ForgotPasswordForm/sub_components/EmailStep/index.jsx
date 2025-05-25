import React from 'react';
import { Box, Typography, TextField, useTheme, useMediaQuery } from '@mui/material';
import styles from '../../ForgotPasswordForm.module.css';

const EmailStep = ({ formData, handleChange, errors }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box>
      <Typography 
        variant={isMobile ? "body2" : "body1"} 
        className={styles.description}
        sx={{
          fontSize: isMobile ? '0.875rem' : '1rem',
          textAlign: 'center',
          padding: isMobile ? '0 0.5rem' : 0
        }}
      >
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
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
        placeholder="Nhập địa chỉ email của bạn"
        error={!!errors?.email}
        helperText={errors?.email}
        size={isMobile ? "small" : "medium"}
        InputProps={{
          style: {
            fontSize: isMobile ? '0.875rem' : '1rem',
          }
        }}
        InputLabelProps={{
          style: {
            fontSize: isMobile ? '0.875rem' : '1rem',
          },
          shrink: true
        }}
      />
    </Box>
  );
};

export default EmailStep; 