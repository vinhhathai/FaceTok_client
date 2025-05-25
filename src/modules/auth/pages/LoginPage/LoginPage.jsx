import React from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import LoginForm from '../../components/LoginForm/LoginForm';
import Logo from '../../../../shared/components/Logo/Logo';
import styles from './LoginPage.module.css';
import { backgroundBoxStyles, desktopLogoBoxStyles, subtitleTypographyStyles } from './LoginPage.styles';

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box className={styles.loginContainer}>
      <Container maxWidth="xl" disableGutters>
        <Grid container className={styles.gridContainer}>
          {/* Left Side - Background */}
          <Grid item md={6} className={styles.leftSide}>
            <Box className={styles.backgroundSection}>
              <Box sx={backgroundBoxStyles}>
                <Typography variant="h1" component="h1">
                  Chào mừng đến với Chaotok
                </Typography>
                <Typography variant="body1">
                  Kết nối với bạn bè và chia sẻ khoảnh khắc của bạn
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6} className={styles.rightSide}>
            <Paper elevation={isMobile ? 0 : 3} className={styles.formPaper}>
              {/* Logo and Title (Desktop only) */}
              {!isMobile && (
                <Box sx={desktopLogoBoxStyles}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                      <Logo size="large" />
                      <Typography variant="body2" color="text.secondary" sx={subtitleTypographyStyles}>
                        Hãy khám phá những điều thú vị
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              <LoginForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage; 