import React from 'react';
import PropTypes from 'prop-types';
import { 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography, 
  Badge
} from '@mui/material';
import {
  StyledConversationItem,
  ConversationHeader,
  ConversationInfo,
  MessagePreview
} from './ConversationItem.styles';

const ConversationItem = ({ conversation, isActive, onClick }) => {
  // Format time for display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show date
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show date with year
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get truncated message preview
  const getMessagePreview = (message) => {
    if (!message || !message.content) return 'Chưa có tin nhắn';
    return message.content.length > 30 
      ? `${message.content.substring(0, 30)}...` 
      : message.content;
  };

  return (
    <StyledConversationItem
      button
      onClick={onClick}
      alignItems="flex-start"
      isActive={isActive}
    >
      <ListItemAvatar>
        <Badge
          color="success"
          variant="dot"
          overlap="circular"
          invisible={!conversation.participant?.online}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Avatar 
            src={conversation.participant?.avatar} 
            alt={conversation.participant?.fullName || 'Người dùng'}
          />
        </Badge>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <ConversationHeader>
            <Typography variant="subtitle2" noWrap>
              {conversation.participant?.fullName || 'Người dùng không xác định'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(conversation.updatedAt)}
            </Typography>
          </ConversationHeader>
        }
        secondary={
          <ConversationInfo>
            <MessagePreview 
              variant="body2" 
              hasUnread={conversation.unreadCount > 0}
              noWrap
            >
              {getMessagePreview(conversation.lastMessage)}
            </MessagePreview>
            
            {conversation.unreadCount > 0 && (
              <Badge
                badgeContent={conversation.unreadCount}
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </ConversationInfo>
        }
      />
    </StyledConversationItem>
  );
};

ConversationItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default ConversationItem; 