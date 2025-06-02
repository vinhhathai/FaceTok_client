import React from 'react';
import PropTypes from 'prop-types';
import { 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography, 
  Badge, 
  Box 
} from '@mui/material';

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
    if (!message || !message.content) return 'No messages yet';
    return message.content.length > 30 
      ? `${message.content.substring(0, 30)}...` 
      : message.content;
  };

  return (
    <ListItem
      button
      onClick={onClick}
      alignItems="flex-start"
      sx={{
        py: 1.5,
        px: 2,
        backgroundColor: isActive ? 'action.selected' : 'inherit',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          backgroundColor: isActive ? 'action.selected' : 'action.hover',
        },
      }}
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
            alt={conversation.participant?.fullName || 'User'}
          />
        </Badge>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" noWrap>
              {conversation.participant?.fullName || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(conversation.updatedAt)}
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography 
              variant="body2" 
              color={conversation.unreadCount > 0 ? 'text.primary' : 'text.secondary'} 
              sx={{ 
                maxWidth: '80%',
                fontWeight: conversation.unreadCount > 0 ? 500 : 400
              }}
              noWrap
            >
              {getMessagePreview(conversation.lastMessage)}
            </Typography>
            
            {conversation.unreadCount > 0 && (
              <Badge
                badgeContent={conversation.unreadCount}
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
        }
      />
    </ListItem>
  );
};

ConversationItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default ConversationItem; 