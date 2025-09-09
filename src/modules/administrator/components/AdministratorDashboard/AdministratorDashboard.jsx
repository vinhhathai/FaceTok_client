import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Article as ArticleIcon,
  Report as ReportIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useGetStatisticsQuery } from '../../api';

const AdministratorDashboard = () => {
  const { data: statistics, isLoading } = useGetStatisticsQuery();

  const menuItems = [
    {
      title: 'Quản lý người dùng',
      icon: <PeopleIcon />,
      description: 'Xem và quản lý tài khoản người dùng',
      path: '/admin/users',
    },
    {
      title: 'Quản lý bài viết',
      icon: <ArticleIcon />,
      description: 'Kiểm duyệt và quản lý bài viết',
      path: '/admin/posts',
    },
    {
      title: 'Báo cáo vi phạm',
      icon: <ReportIcon />,
      description: 'Xử lý các báo cáo từ người dùng',
      path: '/admin/reports',
    },
    {
      title: 'Thống kê',
      icon: <AnalyticsIcon />,
      description: 'Xem báo cáo và thống kê hệ thống',
      path: '/admin/analytics',
    },
    {
      title: 'Cài đặt hệ thống',
      icon: <SettingsIcon />,
      description: 'Cấu hình và cài đặt hệ thống',
      path: '/admin/settings',
    },
  ];

  const StatCard = ({ title, value, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom variant="h6">
          {title}
        </Typography>
        <Typography variant="h4" color={color}>
          {isLoading ? '...' : value || 0}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bảng điều khiển quản trị
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Tổng người dùng" 
            value={statistics?.totalUsers} 
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Bài viết" 
            value={statistics?.totalPosts} 
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Báo cáo chờ xử lý" 
            value={statistics?.pendingReports} 
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Người dùng hoạt động" 
            value={statistics?.activeUsers} 
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Menu Items */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Chức năng quản trị
        </Typography>
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.path}>
              <ListItem
                button
                onClick={() => window.location.href = item.path}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                />
                <Button variant="outlined" size="small">
                  Truy cập
                </Button>
              </ListItem>
              {index < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AdministratorDashboard;