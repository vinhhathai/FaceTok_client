import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Report as ReportIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
    },
    {
      title: 'Quản lý người dùng',
      icon: <PeopleIcon />,
      path: '/admin/users',
    },
    {
      title: 'Quản lý bài viết',
      icon: <ArticleIcon />,
      path: '/admin/posts',
    },
    {
      title: 'Báo cáo vi phạm',
      icon: <ReportIcon />,
      path: '/admin/reports',
    },
    {
      title: 'Thống kê',
      icon: <AnalyticsIcon />,
      path: '/admin/analytics',
    },
    {
      title: 'Cài đặt hệ thống',
      icon: <SettingsIcon />,
      path: '/admin/settings',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Paper sx={{ height: '100%', borderRadius: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Menu Quản Trị
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/admin/dashboard' && location.pathname === '/admin/');
            
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 1,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'white' : 'primary.main',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
};

export default AdminSidebar;