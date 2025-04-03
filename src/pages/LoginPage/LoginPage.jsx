import React, { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
// Material UI imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import loginApi from "../../api/loginApi";
import saveDataToCookie from "../../utils/saveDataToCookie";
import styles from './LoginPage.module.css';

// Styled components
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f7f9fc',
}));

const BackgroundSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1a237e, #283593, #3949ab, #3f51b5)',
  backgroundSize: '400% 400%',
  animation: 'gradient 15s ease infinite',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  '& h1': {
    fontSize: '2.5rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  '& p': {
    fontSize: '1.25rem',
  }
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  maxWidth: '450px',
  width: '100%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('md')]: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  }
}));

const LogoImg = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: '80px',
  height: 'auto',
  borderRadius: theme.spacing(1),
}));

const MobileLogo = styled(Box)(({ theme }) => ({
  display: 'none',
  backgroundColor: '#fff',
  padding: theme.spacing(2),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

const LogoMobileImg = styled('img')(({ theme }) => ({
  height: '60px',
  width: 'auto',
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page to redirect after login from state (if available)
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call login API with email and password
      const loginResult = await loginApi(email, password);

      // Save information to cookie
      await saveDataToCookie(loginResult, "accountInformation", 1500);
      
      // Also save accessToken to a separate cookie
      if (loginResult.accessToken) {
        await saveDataToCookie(loginResult.accessToken, "accessToken", 1500);
      }

      // Show success toast message
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Short delay to allow the toast to be visible before navigating
      setTimeout(() => {
        // Navigate user to the original page they were trying to access or to home page
        navigate(from, { replace: true });
      }, 1000);
      
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your login information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
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
          {/* Left Side - Background */}
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
                  Welcome to FaceTok
                </Typography>
                <Typography variant="body1">
                  Connect with friends and share your moments
                </Typography>
              </Box>
            </BackgroundSection>
          </Grid>

          {/* Right Side - Login Form */}
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
              {/* Logo and Title (Desktop) */}
              <Box 
                sx={{ 
                  display: { xs: 'none', md: 'block' },
                  mb: 4
                }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={3}>
                    <LogoImg 
                      src="/assets/images/FaceTokIcon.jpeg" 
                      alt="FaceTok Logo" 
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', mb: 0 }}>
                      LOGIN
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Let's discover interesting things
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                  className={styles.formControl}
                />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Typography variant="body2" component="label" htmlFor="password">
                    Password
                  </Typography>
                  <Link 
                    component={RouterLink} 
                    to="/auth/reset-password" 
                    variant="body2" 
                    className={styles.forgotPassword}
                  >
                    Forgot password?
                  </Link>
                </Box>
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 3 }}
                  className={styles.formControl}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  className={styles.btn}
                  sx={{ 
                    py: 1.5,
                    mb: 2,
                    fontWeight: 'bold',
                    borderRadius: 2
                  }}
                >
                  {loading ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={20} color="inherit" />
                      <span>Logging in...</span>
                    </Stack>
                  ) : (
                    "Login"
                  )}
                </Button>
                
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2">
                    Not yet a member?{' '}
                    <Link 
                      component={RouterLink} 
                      to="/auth/sign-up" 
                      className={styles.signupLink}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </FormPaper>
          </Grid>
        </Grid>
      </Container>
    </LoginContainer>
  );
}

export default LoginPage;