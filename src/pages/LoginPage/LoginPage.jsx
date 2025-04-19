import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserFromToken } from "../../redux/features/userSlice";
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
import { 
  LoginContainer, 
  BackgroundSection, 
  FormPaper, 
  LogoImg, 
  MobileLogo, 
  LogoMobileImg 
} from './LoginPage.styles';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get the page to redirect after login from state (if available)
  const from = location.state?.from || "/";
  
  // Debug the redirect path
  useEffect(() => {
    console.log("LoginPage - Redirect path:", from);
  }, [from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }
    
    setLoading(true);
    
    try {
      // Gọi API đăng nhập
      const loginResult = await loginApi(email, password);
      console.log("Login result:", loginResult);

      if (!loginResult || !loginResult.accessToken) {
        throw new Error("Thông tin đăng nhập không hợp lệ");
      }

      // Lưu thông tin vào cookie
      await saveDataToCookie(loginResult, "accountInformation", 1500);
      
      // Lưu accessToken riêng
      await saveDataToCookie(loginResult.accessToken, "accessToken", 1500);
      
      // Dispatch action để load dữ liệu người dùng từ token
      dispatch(setUserFromToken());

      // Hiển thị thông báo thành công
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Cải thiện logic chuyển hướng: navigate ngay lập tức thay vì setTimeout
      console.log("Attempting to navigate to:", from || "/");
      
      try {
        navigate(from || "/", { replace: true });
        console.log("Navigation successful");
      } catch (navError) {
        console.error("Navigation error:", navError);
        // Nếu có lỗi, thử navigate đến trang chủ
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      
      // Hiển thị thông báo lỗi
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
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
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    mt: 2, 
                    mb: 3,
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 'bold' 
                  }}
                  className={styles.loginButton}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Login'
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