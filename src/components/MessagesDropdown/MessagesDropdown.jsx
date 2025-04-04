import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { useSelector } from 'react-redux';
import { MessageContainer } from './styles';
import { IconAvatar } from '../../components/Header/styles';
import MessageSidebar from '../MessageSidebar/MessageSidebar';

const MessagesDropdown = ({ messageIcon, avatarMessage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Lấy số lượng tin nhắn chưa đọc từ Redux store
  const conversations = useSelector(state => state.messages.conversations || []);
  const unreadCount = conversations.reduce((total, conv) => total + (conv.unread || 0), 0);
  
  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };
  
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <MessageContainer>
      <IconButton
        aria-label="messages"
        onClick={handleOpenSidebar}
        color="inherit"
      >
        <Badge badgeContent={unreadCount} color="primary">
          <IconAvatar 
            src={messageIcon} 
            variant="square" 
            alt="message icon"
          />
        </Badge>
      </IconButton>
      
      {/* MessageSidebar thay thế cho Menu */}
      <MessageSidebar 
        open={sidebarOpen} 
        onClose={handleCloseSidebar}
      />
    </MessageContainer>
  );
};

export default MessagesDropdown; 