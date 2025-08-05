import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  Box
} from '@mui/material';
import {
  AccountCircle,
  Settings,
  Logout,
  Person
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@auth/redux/slices/authSlice';
import {
  userAvatarContainerStyle,
  userAvatarStyle,
  menuPaperProps
} from '../Header.styles';

const UserMenu = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    if (user && user.id) {
      navigate('/profile', { state: { userId: user.id } });
    } else {
      navigate('/profile');
    }
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };
  
  // Function to get first letter of name safely
  const getInitial = () => {
    if (user && user.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    return 'ND'; // Default: Người Dùng
  };
  
  return (
    <>
      <Box
        sx={userAvatarContainerStyle}
        onClick={handleAvatarClick}
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar 
          src={user?.profilePicture || null}
          alt={user?.fullName || "Người dùng"} 
          sx={userAvatarStyle}
        >
          {getInitial()}
        </Avatar>
      </Box>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'avatar-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          ...menuPaperProps,
          elevation: 3,
          sx: {
            ...menuPaperProps.sx,
            minWidth: 250,
            overflow: 'visible',
            mt: 1.5
          }
        }}
      >
        {/* User info section */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={user?.profilePicture || null}
            alt={user?.fullName || "Người dùng"} 
            sx={{ width: 50, height: 50 }}
          >
            {getInitial()}
          </Avatar>
          <Box sx={{ ml: 1.5, overflow: 'hidden' }}>
            <Typography variant="subtitle1" noWrap fontWeight="bold">
              {user?.fullName || "Người dùng"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email || ""}
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Trang cá nhân" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu; 