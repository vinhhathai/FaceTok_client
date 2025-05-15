import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import ForgotPasswordForm from '../../components/ForgotPasswordForm/ForgotPasswordForm';
import Logo from '../../../../shared/components/Logo/Logo';
import styles from './ForgotPasswordPage.module.css';
import { backgroundBoxStyles, desktopLogoBoxStyles, subtitleTypographyStyles } from './ForgotPasswordPage.styles';

const ForgotPasswordPage = () => {
  return (
    <Box className={styles.forgotPasswordContainer}>
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
                  Reset Your Password
                </Typography>
                <Typography variant="body1">
                  Enter your email to receive password reset instructions
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Forgot Password Form */}
          <Grid item xs={12} md={6} className={styles.rightSide}>
            <Paper elevation={3} className={styles.formPaper}>
              {/* Logo and Title (Desktop) */}
              <Box sx={desktopLogoBoxStyles}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12}>
                    <Logo size="large" />
                    <Typography variant="body2" color="text.secondary" sx={subtitleTypographyStyles}>
                      Reset your password
                    </Typography>
                  </Grid>
                </Grid>
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