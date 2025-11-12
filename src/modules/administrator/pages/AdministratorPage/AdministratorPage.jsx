import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../auth/redux/slices/authSlice';
import { useVerifyAdminQuery } from '../../api/administratorAPI';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import AdministratorDashboard from '../../components/AdministratorDashboard';
import UserManagement from '../../components/UserManagement';
import AnnouncementManagement from '../../components/AnnouncementManagement';
import ReportManagement from '../../components/ReportManagement';

const AdministratorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  
  // Use API to verify admin access
  // Don't skip - let the API call happen and handle 401 via redirect
  const { data: verifyData, isLoading, isError, error } = useVerifyAdminQuery();

  // Redirect if verification failed (401 means not authenticated or not admin)
  useEffect(() => {
    if (isError) {
      console.error('Admin verification failed:', error);
      navigate('/login', { replace: true });
    }
  }, [isError, error, navigate]);

  // Update Redux if verify succeeded
  useEffect(() => {
    if (verifyData?.success && verifyData?.data) {
      dispatch(setUser({
        _id: verifyData.data.userId,
        role: verifyData.data.role,
        isAdmin: verifyData.data.isAdmin,
      }));
    }
  }, [verifyData, dispatch]);

  // Check if user is admin
  const isAdmin = 
    verifyData?.data?.isAdmin === true ||
    currentUser?.role === 'admin' || 
    currentUser?.role === 'staff';

  // Show loading while checking auth
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: '#4ECDC4' }} />
        <Typography variant="body1" color="text.secondary">
          Đang kiểm tra quyền truy cập...
        </Typography>
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            Truy cập bị từ chối
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bạn không có quyền truy cập vào trang quản trị.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Role hiện tại: {currentUser?.role || 'Không xác định'}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.href = '/'}
          >
            Quay về trang chủ
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleLogout = () => {
    // Implement logout logic
    window.location.href = '/login';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const adminHeader = (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(90deg, #4ECDC4 0%, #3AB0A8 100%)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <DashboardIcon sx={{ mr: 2, fontSize: 30 }} />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Chaotok Admin
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Admin
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {currentUser?.fullName}
            </Typography>
          </Box>
          <Button 
            color="inherit" 
            onClick={handleGoHome}
            sx={{ 
              mr: 1,
              borderRadius: 2,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Trang chủ
          </Button>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
            sx={{
              borderRadius: 2,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      {adminHeader}

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <AdminSidebar />
        </Box>

        {/* Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            bgcolor: '#f5f5f5',
          }}
        >
          <Routes>
            <Route path="/" element={<AdministratorDashboard />} />
            <Route path="/dashboard" element={<AdministratorDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/announcements" element={<AnnouncementManagement />} />
            <Route path="/reports" element={<ReportManagement />} />
            <Route path="*" element={<Navigate to="/administrator/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdministratorPage;