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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/administrator/dashboard',
    },
    {
      title: 'Quản lý người dùng',
      icon: <PeopleIcon />,
      path: '/administrator/users',
    },
    {
      title: 'Quản lý thông báo',
      icon: <NotificationsIcon />,
      path: '/administrator/announcements',
    },
    {
      title: 'Quản lý báo cáo',
      icon: <FlagIcon />,
      path: '/administrator/reports',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        background: 'linear-gradient(180deg, #4ECDC4 0%, #3AB0A8 100%)',
        color: 'white',
        overflow: 'auto',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
          Admin Panel
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
          Quản trị hệ thống
        </Typography>
        <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/administrator/dashboard' && location.pathname === '/administrator/') ||
                           (item.path === '/administrator/dashboard' && location.pathname === '/administrator');
            
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
                    color: 'white',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'white',
                      minWidth: 45,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 'bold' : 'medium',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default AdminSidebar;