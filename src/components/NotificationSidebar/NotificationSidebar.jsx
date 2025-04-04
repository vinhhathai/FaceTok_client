import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../../utils/dateFormatter';

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

// Sample notifications data (replace with actual data from Redux later)
const sampleNotifications = [
  {
    id: '1',
    user: {
      _id: '101',
      fullName: 'Cá chà bặc',
      profilePicture: '',
    },
    text: 'đã gửi cho bạn lời mời kết bạn',
    timestamp: '2025-04-04T10:45:00.855Z',
    isRead: false,
    type: 'friend_request',
    link: '/friends'
  },
  {
    id: '2',
    user: {
      _id: '102',
      fullName: 'Hà Thái Vĩnh',
      profilePicture: '',
    },
    text: 'đã bình luận về bài viết của bạn',
    timestamp: '2025-04-04T10:31:29.994Z',
    isRead: false,
    type: 'comment',
    link: '/post/123'
  },
];

const NotificationSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  
  // Giả lập trạng thái loading
  const [loading, setLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState([]);
  
  // Giả lập việc tải thông báo
  useEffect(() => {
    if (open) {
      // Giả lập API call
      const timer = setTimeout(() => {
        setNotifications(sampleNotifications);
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [open]);
  
  // Xử lý click vào thông báo
  const handleNotificationClick = (notification) => {
    // Điều hướng đến trang tương ứng với thông báo
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };
  
  // Xử lý đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = () => {
    // Cập nhật trạng thái đã đọc cho tất cả thông báo
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, isRead: true }))
    );
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
      
      <Divider />
      
      <SidebarFooter>
        <Button 
          variant="text" 
          fullWidth
          onClick={() => {
            navigate('/notifications');
            onClose();
          }}
        >
          Xem tất cả thông báo
        </Button>
      </SidebarFooter>
    </Drawer>
  );
};

export default NotificationSidebar; 