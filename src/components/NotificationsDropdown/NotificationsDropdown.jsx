import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { NotificationContainer, MenuTitle, MenuFooter, ActionText } from './styles';
import { IconAvatar } from '../../components/Header/styles';

const NotificationsDropdown = ({ notificationIcon }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <NotificationContainer>
      <IconButton
        aria-label="notifications"
        aria-controls={open ? 'notifications-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
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
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'notifications-button',
        }}
        PaperProps={{
          elevation: 4,
          sx: { width: 320, maxHeight: 450 }
        }}
      >
        <MenuTitle>
          <Typography variant="subtitle1">Notifications</Typography>
          <ActionText variant="body2">
            Mark All as Read
          </ActionText>
        </MenuTitle>
        <Divider />
        {/* Notification items would be here */}
        <MenuFooter>
          <ActionText 
            variant="body2" 
            sx={{ display: 'block', width: '100%' }}
          >
            See All Notifications
          </ActionText>
        </MenuFooter>
      </Menu>
    </NotificationContainer>
  );
};

export default NotificationsDropdown; 