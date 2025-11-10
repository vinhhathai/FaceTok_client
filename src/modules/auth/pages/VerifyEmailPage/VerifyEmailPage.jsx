import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Paper,
} from '@mui/material';

import Logo from '@shared/components/Logo/Logo';
import { verifyEmail, resendVerificationOTP } from '@auth/api/authAPI';
import { showSuccess, formatErrorMessage } from '@utils';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [emailEditable, setEmailEditable] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
      setEmailEditable(false);
    } else {
      // Nếu không có email từ state, cho phép user nhập email
      setEmailEditable(true);
    }
  }, [location]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP gồm 6 chữ số');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail({ email, otp });
      setSuccess('Email đã được xác thực thành công!');
      showSuccess('Email verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    if (!email) {
      setError('Vui lòng nhập email trước');
      return;
    }

    setError('');
    setSuccess('');
    setResending(true);
    try {
      await resendVerificationOTP({ email });
      setSuccess('Mã xác thực mới đã được gửi đến email của bạn!');
      setCountdown(60);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 450,
          width: '100%',
          padding: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Logo size="large" />
        </Box>

        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Xác thực Email
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          {email 
            ? `Chúng tôi đã gửi mã xác thực 6 chữ số đến`
            : 'Nhập email và mã OTP để xác thực tài khoản'}
          {email && (
            <>
              <br />
              <strong>{email}</strong>
            </>
          )}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {emailEditable && (
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email đã đăng ký"
              sx={{ mb: 2 }}
              disabled={loading}
            />
          )}
          
          <TextField
            fullWidth
            label="Mã OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder="Nhập 6 chữ số"
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: 'center',
                fontSize: '24px',
                letterSpacing: '8px',
              },
            }}
            sx={{ mb: 3 }}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || otp.length !== 6 || !email}
            sx={{ mb: 2, height: 48 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Xác thực'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Không nhận được mã?{' '}
              <Link
                component="button"
                type="button"
                onClick={handleResend}
                disabled={resending || countdown > 0}
                sx={{
                  cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                  opacity: countdown > 0 ? 0.5 : 1,
                }}
              >
                {resending
                  ? 'Đang gửi...'
                  : countdown > 0
                  ? `Gửi lại (${countdown}s)`
                  : 'Gửi lại'}
              </Link>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/register')}
              >
                Quay lại đăng ký
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;
