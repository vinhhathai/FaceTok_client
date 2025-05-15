import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import LoginForm from '../../components/LoginForm/LoginForm';
import Logo from '../../../../shared/components/Logo/Logo';
import styles from './LoginPage.module.css';
import { backgroundBoxStyles, desktopLogoBoxStyles, subtitleTypographyStyles } from './LoginPage.styles';

const LoginPage = () => {
  return (
    <Box className={styles.loginContainer}>
      <Container maxWidth="xl" disableGutters>
        {/* Mobile Logo */}
        <Box className={styles.mobileLogo}>
          <Logo size="medium" />
        </Box>

        <Grid container className={styles.gridContainer}>
          {/* Left Side - Background */}
          <Grid item md={6} className={styles.leftSide}>
            <Box className={styles.backgroundSection}>
              <Box sx={backgroundBoxStyles}>
                <Typography variant="h1" component="h1">
                  Welcome to FaceTok
                </Typography>
                <Typography variant="body1">
                  Connect with friends and share your moments
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6} className={styles.rightSide}>
            <Paper elevation={3} className={styles.formPaper}>
              {/* Logo and Title (Desktop) */}
              <Box sx={desktopLogoBoxStyles}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12}>
                    <Logo size="large" />
                    <Typography variant="body2" color="text.secondary" sx={subtitleTypographyStyles}>
                      Let's discover interesting things
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <LoginForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage; 