import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import Logo from '../../../../shared/components/Logo/Logo';
import styles from './RegisterPage.module.css';
import { backgroundBoxStyles, desktopLogoBoxStyles, subtitleTypographyStyles } from './RegisterPage.styles';

const RegisterPage = () => {
  return (
    <Box className={styles.registerContainer}>
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
                  Join FaceTok Today
                </Typography>
                <Typography variant="body1">
                  Create your account and start sharing your moments
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Register Form */}
          <Grid item xs={12} md={6} className={styles.rightSide}>
            <Paper elevation={3} className={styles.formPaper}>
              {/* Logo and Title (Desktop) */}
              <Box sx={desktopLogoBoxStyles}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12}>
                    <Logo size="large" />
                    <Typography variant="body2" color="text.secondary" sx={subtitleTypographyStyles}>
                      Create your account
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <RegisterForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisterPage; 