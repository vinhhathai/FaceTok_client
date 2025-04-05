import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatTime } from '../../utils/dateFormatter';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../../redux/features/notificationSlice';

// Material UI components
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';

// Styled components
import {
  SidebarHeader,
  SidebarTitle,
  SidebarContent,
  SidebarFooter,
  StyledListItem,
  NotificationTime,
  NotificationText,
  NotificationDot,
} from './styles';

const NotificationSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get data from Redux
  const { notifications, loading, error } = useSelector(state => state.notifications);
  
  console.log('NotificationSidebar rendering with:', { 
    notificationsCount: notifications?.length, 
    notifications,
    loading
  });
  
  // Fetch notifications when the sidebar opens
  useEffect(() => {
    if (open) {
      console.log("NotificationSidebar opening, current notifications:", notifications);
      dispatch(fetchNotifications());
    }
  }, [open, dispatch]);
  
  // Xử lý click vào thông báo
  const handleNotificationClick = (notification) => {
    // Đánh dấu thông báo là đã đọc
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id));
    }
    
    // Điều hướng đến trang tương ứng với thông báo
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };
  
  // Xử lý đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 350 },
          boxSizing: 'border-box',
        },
      }}
    >
      <SidebarHeader>
        <SidebarTitle variant="h6">Thông báo</SidebarTitle>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            aria-label="đánh dấu đã đọc tất cả" 
            size="small"
            color="primary"
            onClick={handleMarkAllAsRead}
          >
            <DoneAllIcon />
          </IconButton>
          <IconButton 
            aria-label="đóng" 
            onClick={onClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </SidebarHeader>
      
      <Divider />
      
      <SidebarContent>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        
        {!loading && notifications.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="body1">
              Bạn chưa có thông báo nào
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
              Các thông báo sẽ xuất hiện ở đây
            </Typography>
          </Box>
        )}
        
        <List sx={{ p: 0 }}>
          {notifications.map((notification) => (
            <StyledListItem 
              key={notification.id} 
              onClick={() => handleNotificationClick(notification)}
              unread={!notification.isRead}
            >
              <ListItemAvatar>
                <Avatar 
                  alt={notification.user.fullName} 
                  src={notification.user.profilePicture} 
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography 
                      variant="subtitle2" 
                      component="span"
                      fontWeight={notification.isRead ? 'normal' : 'bold'}
                    >
                      {notification.user.fullName}
                    </Typography>
                    {!notification.isRead && (
                      <NotificationDot />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <NotificationText 
                      variant="body2"
                      isRead={notification.isRead}
                    >
                      {notification.text}
                    </NotificationText>
                    <NotificationTime variant="caption">
                      {formatTime(notification.timestamp)}
                    </NotificationTime>
                  </Box>
                }
              />
            </StyledListItem>
          ))}
        </List>
      </SidebarContent>
      
      {/* Removed the footer with "Xem tất cả thông báo" button */}
    </Drawer>
  );
};

export default NotificationSidebar; 