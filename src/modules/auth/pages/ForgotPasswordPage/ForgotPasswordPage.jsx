import React from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import ForgotPasswordForm from '@auth/components/ForgotPasswordForm/ForgotPasswordForm';
import Logo from '@components/Logo/Logo';
import styles from './ForgotPasswordPage.module.css';
import { backgroundBoxStyles, desktopLogoBoxStyles, subtitleTypographyStyles } from './ForgotPasswordPage.styles';

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
            <Paper elevation={isMobile ? 0 : 3} className={styles.formPaper}>
              {/* Logo and Title (Always visible) */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Logo size="medium" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Đặt lại mật khẩu của bạn
                </Typography>
              </Box>
              
            <ForgotPasswordForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage; 