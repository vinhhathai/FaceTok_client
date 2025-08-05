import React from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import RegisterForm from '@auth/components/RegisterForm/RegisterForm';
import Logo from '@components/Logo/Logo';
import styles from './RegisterPage.module.css';
import { backgroundBoxStyles, desktopLogoBoxStyles, subtitleTypographyStyles } from './RegisterPage.styles';

const RegisterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box className={styles.registerContainer}>
      <Container maxWidth="xl" disableGutters>
        <Grid container className={styles.gridContainer}>
          {/* Left Side - Background */}
          <Grid item md={6} className={styles.leftSide}>
            <Box className={styles.backgroundSection}>
              <Box sx={backgroundBoxStyles}>
                <Typography variant="h1" component="h1">
                  Tham gia Chaotok ngay hôm nay
                </Typography>
                <Typography variant="body1">
                  Tạo tài khoản và bắt đầu chia sẻ khoảnh khắc của bạn
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Register Form */}
          <Grid item xs={12} md={6} className={styles.rightSide}>
            <Paper elevation={isMobile ? 0 : 3} className={styles.formPaper}>
              {/* Logo and Title (Always visible) */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Logo size="medium" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Tạo tài khoản của bạn
                      </Typography>
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