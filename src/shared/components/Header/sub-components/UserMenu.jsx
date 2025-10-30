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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Button,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  AccountCircle,
  Settings,
  Logout,
  Person,
  Block,
  PersonRemove,
  Close
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@auth/redux/slices/authSlice';
import {
  userAvatarContainerStyle,
  userAvatarStyle,
  menuPaperProps
} from '../Header.styles';
import userApi from '@user/api/userApi';

const UserMenu = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unblocking, setUnblocking] = useState({});
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

  const handleBlockedUsersClick = async () => {
    handleMenuClose();
    setShowBlockedUsersModal(true);
    await fetchBlockedUsers();
  };

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getBlockedUsers();
      
      if (response.success && response.data) {
        setBlockedUsers(response.data.blockedUsers || []);
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      setUnblocking(prev => ({ ...prev, [userId]: true }));
      
      const response = await userApi.unblockUser(userId);
      
      if (response.success) {
        // Remove user from blocked list
        setBlockedUsers(prev => prev.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    } finally {
      setUnblocking(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleCloseModal = () => {
    setShowBlockedUsersModal(false);
    setBlockedUsers([]);
    setUnblocking({});
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
        
        <MenuItem onClick={handleBlockedUsersClick}>
          <ListItemIcon>
            <Block fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Danh sách chặn" />
        </MenuItem>
        
        <Divider />
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </MenuItem>
      </Menu>

      <Dialog 
        open={showBlockedUsersModal} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            py: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Block sx={{ mr: 1.5, color: 'error.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Danh sách chặn
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseModal}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : blockedUsers.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Block 
                sx={{ 
                  fontSize: 64, 
                  color: 'text.secondary', 
                  mb: 2,
                  opacity: 0.5
                }} 
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có người dùng nào bị chặn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Khi bạn chặn ai đó, họ sẽ xuất hiện trong danh sách này
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {blockedUsers.map((user, index) => (
                <ListItem 
                  key={user._id} 
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: index < blockedUsers.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={user.profilePicture || null} 
                      alt={user.fullName || "Người dùng"}
                      sx={{ width: 48, height: 48 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {user.fullName || "Người dùng"}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {user.email || ""}
                      </Typography>
                    }
                    sx={{ mr: 2 }}
                  />
                  {unblocking[user._id] ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      startIcon={<PersonRemove />}
                      onClick={() => handleUnblockUser(user._id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'success.main',
                          color: 'white'
                        }
                      }}
                    >
                      Bỏ chặn
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu; 