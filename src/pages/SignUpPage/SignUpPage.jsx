// Code đã được chỉnh sửa để thêm dấu sao (*) vào các placeholder và thêm chú thích dưới biểu mẫu
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Material UI imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

// API và utils
import signUpApi from "../../api/signUpApi";

// Styles
import {
  SignUpContainer,
  BackgroundSection,
  FormPaper,
  LogoImg,
  MobileLogo,
  LogoMobileImg,
  ActionsContainer,
  PrivacyText
} from './SignUpPage.styles';
import styles from './SignUpPage.module.css';

function SignUpPage() {
  const [fullName, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Kiểm tra các trường đã được điền đầy đủ
    if (!fullName || !password || !confirmPassword || !email) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    // Kiểm tra mật khẩu và mật khẩu xác nhận
    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Định dạng email không hợp lệ!");
      return;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    
    setLoading(true);
  
    try {
      // Gọi API đăng ký
      const signUpResult = await signUpApi(fullName, password, confirmPassword, email);
      console.log("Sign up result:", signUpResult);
      
      if (!signUpResult || !signUpResult.status) {
        throw new Error(signUpResult?.error?.message || "Đăng ký thất bại");
      }
      
      // Hiển thị thông báo thành công
      toast.success(signUpResult.message || "Đăng ký thành công!");
      
      // Chuyển hướng đến trang đăng nhập
        setTimeout(() => {
        navigate('/login');
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Sign up failed:", error);
      
      // Hiển thị thông báo lỗi
      if (error.error) {
        toast.error(error.error.message || "Đăng ký thất bại!");
      } else {
        toast.error("Đăng ký thất bại. Vui lòng thử lại sau!");
      }
      
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
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
              height: { md: '100vh' },
              order: { md: 1 } // Thay đổi thứ tự hiển thị trên màn hình lớn
            }}
          >
            <BackgroundSection>
              <Box sx={{ p: 4, maxWidth: '450px' }}>
                <Typography variant="h1" component="h1">
                  Join FaceTok Today
                </Typography>
                <Typography variant="body1">
                  Connect with friends, share moments, and discover new experiences
                </Typography>
              </Box>
            </BackgroundSection>
          </Grid>

          {/* SignUp Form */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              py: { xs: 4, md: 0 },
              order: { md: 0 } // Thay đổi thứ tự hiển thị trên màn hình lớn
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
                      FaceTok
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enjoy with us!
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Form Đăng ký */}
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullname(e.target.value)}
                  className={styles.formControl}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.formControl}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.formControl}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.formControl}
                  sx={{ mb: 2 }}
                />
                
                <PrivacyText className={styles.privacyText}>
                  By clicking the Sign Up button below you agreed to our privacy policy and 
                  terms of use of our website.
                </PrivacyText>
                
                <ActionsContainer className={styles.actionsContainer}>
                  <Box>
                    <Typography variant="body2">
                      Already a member?{' '}
                      <Link 
                        component={RouterLink} 
                        to="/auth/login" 
                        className={styles.loginLink}
                      >
                        Login
                      </Link>
                    </Typography>
                  </Box>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.2,
                      px: 3,
                      fontWeight: 'bold',
                      borderRadius: 1
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                        Signing Up...
                      </Box>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </ActionsContainer>
              </Box>
            </FormPaper>
          </Grid>
        </Grid>
      </Container>
    </SignUpContainer>
  );
}

export default SignUpPage;
