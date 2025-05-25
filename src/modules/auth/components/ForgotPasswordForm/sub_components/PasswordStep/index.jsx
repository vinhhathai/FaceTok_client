import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import styles from '../../ForgotPasswordForm.module.css';

const PasswordStep = ({ 
  formData, 
  handleChange, 
  showPassword, 
  showConfirmPassword, 
  handleTogglePasswordVisibility, 
  handleToggleConfirmPasswordVisibility,
  errors
}) => {
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
        Tạo một mật khẩu mới cho tài khoản của bạn
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="password"
        label="Mật khẩu mới"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        className={styles.formControl}
        error={!!errors?.password}
        helperText={errors?.password}
        placeholder="Nhập mật khẩu mới của bạn"
        size={isMobile ? "small" : "medium"}
        InputProps={{
          style: {
            fontSize: isMobile ? '0.875rem' : '1rem',
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                onClick={handleTogglePasswordVisibility} 
                edge="end"
                size={isMobile ? "small" : "medium"}
              >
                {showPassword ? <VisibilityOffIcon fontSize={isMobile ? "small" : "medium"} /> : <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: {
            fontSize: isMobile ? '0.875rem' : '1rem',
          },
          shrink: true
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="confirmPassword"
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange}
        className={styles.formControl}
        error={!!errors?.confirmPassword}
        helperText={errors?.confirmPassword}
        placeholder="Nhập lại mật khẩu mới của bạn"
        size={isMobile ? "small" : "medium"}
        InputProps={{
          style: {
            fontSize: isMobile ? '0.875rem' : '1rem',
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                onClick={handleToggleConfirmPasswordVisibility} 
                edge="end"
                size={isMobile ? "small" : "medium"}
              >
                {showConfirmPassword ? <VisibilityOffIcon fontSize={isMobile ? "small" : "medium"} /> : <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />}
              </IconButton>
            </InputAdornment>
          ),
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

export default PasswordStep; 