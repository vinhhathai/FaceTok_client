import React from 'react';
import { Box, Typography, TextField, useTheme, useMediaQuery } from '@mui/material';
import styles from '../../ForgotPasswordForm.module.css';

const OtpStep = ({ formData, handleChange, errors }) => {
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
        Nhập mã OTP đã được gửi đến email {formData.email}
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="otp"
        label="Mã OTP"
        name="otp"
        autoFocus
        value={formData.otp}
        onChange={handleChange}
        className={styles.formControl}
        error={!!errors?.otp}
        helperText={errors?.otp}
        placeholder="Nhập mã OTP của bạn"
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

export default OtpStep; 