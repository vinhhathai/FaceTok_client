import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Stack,
  Divider,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useGetStatisticsQuery } from '../../api';

const AdministratorDashboard = () => {
  const { data: stats, isLoading } = useGetStatisticsQuery();
  const currentUser = useSelector((state) => state.auth.user);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Banner */}
      <Card
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Avatar
              src={currentUser?.profilePicture}
              sx={{
                width: 80,
                height: 80,
                border: '4px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {currentUser?.fullName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Chào mừng trở lại, {currentUser?.fullName || 'Admin'}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Hệ thống đang hoạt động tốt. Bạn có {stats?.totalUsers || 0} người dùng đang quản lý.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
                <Chip
                  icon={<SecurityIcon />}
                  label={`Role: ${currentUser?.role || 'Admin'}`}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Chip
                  icon={<ScheduleIcon />}
                  label={new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* System Performance Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Avatar sx={{ bgcolor: '#4ECDC4' }}>
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="600">
                  Tăng trưởng
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                +{stats?.newUsersThisMonth || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Người dùng mới tháng này
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(((stats?.newUsersThisMonth || 0) / (stats?.totalUsers || 1)) * 100, 100)}
                sx={{ mt: 2, height: 8, borderRadius: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Avatar sx={{ bgcolor: '#43e97b' }}>
                  <SpeedIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="600">
                  Tỷ lệ hoạt động
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
                {stats?.totalUsers > 0 ? ((stats?.activeUsers / stats?.totalUsers) * 100).toFixed(1) : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {stats?.activeUsers || 0} / {stats?.totalUsers || 0} người dùng đang hoạt động
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats?.totalUsers > 0 ? (stats?.activeUsers / stats?.totalUsers) * 100 : 0}
                color="success"
                sx={{ mt: 2, height: 8, borderRadius: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Avatar sx={{ bgcolor: '#2196f3' }}>
                  <SecurityIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="600">
                  Quản trị viên
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight="bold" color="info.main" gutterBottom>
                {(stats?.usersByRole?.admin || 0) + (stats?.usersByRole?.staff || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Admin: {stats?.usersByRole?.admin || 0} | Staff: {stats?.usersByRole?.staff || 0}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats?.totalUsers > 0 ? (((stats?.usersByRole?.admin || 0) + (stats?.usersByRole?.staff || 0)) / stats?.totalUsers) * 100 : 0}
                color="info"
                sx={{ mt: 2, height: 8, borderRadius: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Trạng thái hệ thống
        </Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Tổng số người dùng:
            </Typography>
            <Typography variant="body1" fontWeight="600" color="primary.main">
              {stats?.totalUsers || 0}
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Tỷ lệ người dùng hoạt động:
            </Typography>
            <Typography variant="body1" fontWeight="600" color="success.main">
              {stats?.totalUsers > 0 ? ((stats?.activeUsers / stats?.totalUsers) * 100).toFixed(1) : 0}%
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Tỷ lệ người dùng không hoạt động:
            </Typography>
            <Typography variant="body1" fontWeight="600" color="error.main">
              {stats?.totalUsers > 0 ? ((stats?.inactiveUsers / stats?.totalUsers) * 100).toFixed(1) : 0}%
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Người dùng mới tháng này:
            </Typography>
            <Typography variant="body1" fontWeight="600" color="info.main">
              {stats?.newUsersThisMonth || 0}
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Phân bố vai trò:
            </Typography>
            <Typography variant="body1" fontWeight="600">
              Admin: {stats?.usersByRole?.admin || 0} | Staff: {stats?.usersByRole?.staff || 0} | Member: {stats?.usersByRole?.member || 0}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AdministratorDashboard;
