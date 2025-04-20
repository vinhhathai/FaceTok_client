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
  
  // Get unread count from Redux
  const { unreadCount, notifications } = useSelector(state => state.notifications);
  
  console.log('NotificationsDropdown rendering:', { unreadCount, notificationsCount: notifications?.length });
  
  // Fetch unread count initially and on interval
  useEffect(() => {
    console.log('NotificationsDropdown: Fetching unread count');
    dispatch(getUnreadCount());
    
    // Poll for new notifications every minute
    const intervalId = setInterval(() => {
      console.log('NotificationsDropdown: Polling for updates');
      dispatch(getUnreadCount());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [dispatch]);
  
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
        <Badge badgeContent={unreadCount} color="error">
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