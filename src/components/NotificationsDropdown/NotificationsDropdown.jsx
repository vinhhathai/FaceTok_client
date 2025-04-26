import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { NotificationContainer } from './styles';
import NotificationSidebar from '../NotificationSidebar/NotificationSidebar';
import { getUnreadCount } from '../../redux/features/notificationSlice';

const NotificationsDropdown = ({ notificationIcon }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  
  // Get unread count from Redux and check authentication
  const { unreadCount, notifications } = useSelector(state => state.notifications);
  const { isAuthenticated, user } = useSelector(state => state.user || {});
  

  
  // Fetch unread count initially and on interval - ONLY if authenticated
  useEffect(() => {
    // Chỉ fetch notifications khi người dùng đã đăng nhập
    if (isAuthenticated && user) {
      dispatch(getUnreadCount());
      
      // Poll for new notifications every minute
      const intervalId = setInterval(() => {
        // Kiểm tra lại trạng thái xác thực hiện tại trước khi gọi API
        if (isAuthenticated && user) {
          dispatch(getUnreadCount());
        }
      }, 60000);
      
      return () => clearInterval(intervalId);
    }
  }, [dispatch, isAuthenticated, user]);
  
  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };
  
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <NotificationContainer>
      <IconButton
        aria-label="notifications"
        onClick={handleOpenSidebar}
        color="inherit"
      >
        <Badge badgeContent={isAuthenticated ? unreadCount : 0} color="error">
          {notificationIcon}
        </Badge>
      </IconButton>
      
      {/* NotificationSidebar thay thế cho Menu */}
      <NotificationSidebar 
        open={sidebarOpen} 
        onClose={handleCloseSidebar}
      />
    </NotificationContainer>
  );
};

export default NotificationsDropdown; 