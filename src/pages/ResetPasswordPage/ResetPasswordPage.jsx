import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

// Material UI imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Components
import ResetPasswordForm from "../../sub_components/ResetPasswordForm/ResetPasswordForm";
import OTPForm from "../../sub_components/OTPForm/OTPForm";
import ChangePasswordForm from "../../sub_components/ChangePasswordForm/ChangePasswordForm";

// Styles
import {
  ResetPasswordContainer,
  BackgroundSection,
  FormPaper,
  LogoImg,
  MobileLogo,
  LogoMobileImg,
  StepperContainer,
  ActionsContainer
} from './ResetPasswordPage.styles';
import styles from './ResetPasswordPage.module.css';

// Định nghĩa các bước
const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

function ResetPasswordPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleShowOTPForm = () => setActiveStep(1);
  const handleShowChangePasswordForm = () => setActiveStep(2);

  return (
    <ResetPasswordContainer>
      <Container maxWidth="xl" disableGutters>
        {/* Mobile Logo */}
        <MobileLogo>
          <LogoMobileImg 
            src="/assets/images/FaceTokIcon.jpeg" 
            alt="FaceTok Logo" 
          />
          <Typography variant="h5" component="h1">
            FaceTok
          </Typography>
        </MobileLogo>

        <Grid container sx={{ minHeight: { md: '100vh' } }}>
          {/* Background Section */}
          <Grid 
            item 
            md={6} 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              height: { md: '100vh' }
            }}
          >
            <BackgroundSection>
              <Box sx={{ p: 4, maxWidth: '450px' }}>
                <Typography variant="h1" component="h1">
                  Reset Your Password
                </Typography>
                <Typography variant="body1">
                  Follow the steps to reset your password and secure your account
                </Typography>
              </Box>
            </BackgroundSection>
          </Grid>

          {/* Reset Password Form */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              py: { xs: 4, md: 0 }
            }}
          >
            <FormPaper elevation={3} className={styles.formContainer}>
              {/* Logo và Tiêu đề */}
              <Box sx={{ mb: 4 }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={2}>
                    <LogoImg 
                      src="/assets/images/FaceTokIcon.jpeg" 
                      alt="FaceTok Logo" 
                    />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', mb: 0 }}>
                      Reset Password 
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Stepper */}
              <StepperContainer className={styles.stepper}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </StepperContainer>
              
              {/* Form Content */}
              <Box className={styles.stepContent}>
                {activeStep === 0 && <ResetPasswordForm handleShowOTPForm={handleShowOTPForm} />}
                {activeStep === 1 && <OTPForm handleShowChangePasswordForm={handleShowChangePasswordForm} />}
                {activeStep === 2 && <ChangePasswordForm />}
              </Box>
              
              <ActionsContainer>
                <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
                  Back to login page?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/auth/login" 
                    className={styles.loginLink}
                  >
                    Login
                  </Link>
                </Typography>
              </ActionsContainer>
            </FormPaper>
          </Grid>
        </Grid>
      </Container>
    </ResetPasswordContainer>
  );
}

export default ResetPasswordPage;
