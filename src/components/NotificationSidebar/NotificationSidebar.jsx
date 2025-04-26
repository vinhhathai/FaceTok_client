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
  // Thêm kiểm tra trạng thái xác thực
  const { isAuthenticated, user } = useSelector(state => state.user || {});
  

  
  // Fetch notifications when the sidebar opens
  useEffect(() => {
    if (open && isAuthenticated && user) {
      dispatch(fetchNotifications());
    }
  }, [open, dispatch, isAuthenticated, user]);
  
  // Xử lý click vào thông báo
  const handleNotificationClick = (notification) => {
    // Kiểm tra notification tồn tại
    if (!notification) {
      return;
    }
    
    // Kiểm tra id tồn tại trước khi đánh dấu đã đọc
    if (!notification.isRead && notification.id) {
      dispatch(markNotificationAsRead(notification.id));
    }
    
    // Điều hướng đến trang tương ứng với thông báo nếu có link
    if (notification.link) {
      navigate(notification.link);
      onClose();
    } else {
      // Fallback nếu không có link
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
        {/* Hiển thị thông báo đăng nhập nếu người dùng chưa xác thực */}
        {!isAuthenticated && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="body1">
              Vui lòng đăng nhập để xem thông báo
            </Typography>
          </Box>
        )}
        
        {isAuthenticated && loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        
        {isAuthenticated && !loading && notifications.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="body1">
              Bạn chưa có thông báo nào
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
              Các thông báo sẽ xuất hiện ở đây
            </Typography>
          </Box>
        )}
        
        {isAuthenticated && !loading && notifications.length > 0 && (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => {
              // Kiểm tra notification có dữ liệu hợp lệ không
              if (!notification || !notification.id) return null;
              
              // Đảm bảo user tồn tại với fullName và profilePicture
              const user = notification.user || {};
              const fullName = user.fullName || 'Người dùng';
              const profilePicture = user.profilePicture || '';
              
              // Đảm bảo notification có các trường cần thiết khác
              const isRead = Boolean(notification.isRead);
              const text = notification.text || 'Thông báo mới';
              const timestamp = notification.timestamp || new Date().toISOString();
              
              return (
                <StyledListItem 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification)}
                  unread={!isRead}
                >
                  <ListItemAvatar>
                    <Avatar 
                      alt={fullName} 
                      src={profilePicture} 
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="subtitle2" 
                          component="span"
                          fontWeight={isRead ? 'normal' : 'bold'}
                        >
                          {fullName}
                        </Typography>
                        {!isRead && (
                          <NotificationDot />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <NotificationText 
                          variant="body2"
                          isRead={isRead}
                        >
                          {text}
                        </NotificationText>
                        <NotificationTime variant="caption">
                          {formatTime(timestamp)}
                        </NotificationTime>
                      </Box>
                    }
                  />
                </StyledListItem>
              );
            })}
          </List>
        )}
      </SidebarContent>
    </Drawer>
  );
};

export default NotificationSidebar; 