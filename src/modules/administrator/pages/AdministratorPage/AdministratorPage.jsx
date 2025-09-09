import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import MainLayout from '../../../../shared/components/MainLayout/MainLayout';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import AdministratorDashboard from '../../components/AdministratorDashboard';
import UserManagement from '../../components/UserManagement';

const AdministratorPage = () => {
  const currentUser = useSelector((state) => state.auth.user);

  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin;

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
    <AppBar position="static" sx={{ backgroundColor: 'primary.dark' }}>
      <Toolbar>
        <DashboardIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bảng điều khiển quản trị - FaceTok
        </Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Xin chào, {currentUser?.fullName}
        </Typography>
        <Button 
          color="inherit" 
          onClick={handleGoHome}
          sx={{ mr: 1 }}
        >
          Trang chủ
        </Button>
        <Button 
          color="inherit" 
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
        >
          Đăng xuất
        </Button>
      </Toolbar>
    </AppBar>
  );

  const adminContent = (
    <Routes>
      <Route path="/" element={<AdministratorDashboard />} />
      <Route path="/dashboard" element={<AdministratorDashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/posts" element={
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Quản lý bài viết</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Tính năng đang được phát triển...
          </Typography>
        </Box>
      } />
      <Route path="/reports" element={
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Báo cáo vi phạm</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Tính năng đang được phát triển...
          </Typography>
        </Box>
      } />
      <Route path="/analytics" element={
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Thống kê</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Tính năng đang được phát triển...
          </Typography>
        </Box>
      } />
      <Route path="/settings" element={
        <Box sx={{ p: 3 }}>
          <Typography variant="h4">Cài đặt hệ thống</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Tính năng đang được phát triển...
          </Typography>
        </Box>
      } />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );

  return (
    <MainLayout
      thumbnail={adminHeader}
      leftSidebar={<AdminSidebar />}
      content={adminContent}
      isMobile={false}
    />
  );
};

export default AdministratorPage;