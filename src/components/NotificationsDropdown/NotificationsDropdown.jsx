import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { NotificationContainer } from './styles';
import { IconAvatar } from '../../components/Header/styles';
import NotificationSidebar from '../NotificationSidebar/NotificationSidebar';

const NotificationsDropdown = ({ notificationIcon }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
        <Badge badgeContent={2} color="primary">
          <IconAvatar 
            src={notificationIcon} 
            variant="square" 
            alt="notification icon"
          />
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