import React from 'react';
import { Box, Container, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import ForgotPasswordForm from '../../components/ForgotPasswordForm/ForgotPasswordForm';
import Logo from '../../../../shared/components/Logo/Logo';
import styles from './ForgotPasswordPage.module.css';
import { backgroundBoxStyles } from './ForgotPasswordPage.styles';

const ForgotPasswordPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box className={styles.forgotPasswordContainer}>
      <Container maxWidth="xl" disableGutters>
        <Grid container className={styles.gridContainer}>
          {/* Left Side - Background */}
          <Grid item md={6} className={styles.leftSide}>
            <Box className={styles.backgroundSection}>
              <Box sx={backgroundBoxStyles}>
                <Typography variant="h1" component="h1">
                  Đặt lại mật khẩu
                </Typography>
                <Typography variant="body1">
                  Nhập email của bạn để đặt lại mật khẩu qua các bước đơn giản
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Forgot Password Form */}
          <Grid item xs={12} md={6} className={styles.rightSide}>
            <ForgotPasswordForm />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage; 