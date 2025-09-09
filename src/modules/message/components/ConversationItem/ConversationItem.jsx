import React from 'react';
import PropTypes from 'prop-types';
import { 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography, 
  Badge,
  IconButton,
  Tooltip,
  Box,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import {
  StyledConversationItem,
  ConversationHeader,
  ConversationInfo,
  MessagePreview,
  DeleteButtonContainer
} from './ConversationItem.styles';

const ConversationItem = ({ conversation, isActive, onClick, onDelete }) => {
  
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

  // Handle delete button click
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Ngăn không cho trigger onClick của conversation item
    if (onDelete) {
      onDelete(conversation);
    }
  };

  return (
    <StyledConversationItem
      button
      onClick={onClick}
      alignItems="flex-start"
      isActive={isActive}
      isGroup={conversation.isGroup}
    >
      <ListItemAvatar>
        <Badge
          color="success"
          variant="dot"
          overlap="circular"
          invisible={!conversation.participant?.online || conversation.isGroup}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Avatar 
            src={conversation.participant?.avatar} 
            alt={conversation.participant?.fullName || 'Người dùng'}
            sx={{
              backgroundColor: conversation.isGroup ? 'primary.main' : 'grey.300',
              color: conversation.isGroup ? 'white' : 'grey.700'
            }}
          >
            {conversation.isGroup ? <GroupIcon /> : <PersonIcon />}
          </Avatar>
        </Badge>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <ConversationHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {conversation.participant?.fullName || 'Người dùng không xác định'}
              </Typography>
              {conversation.isGroup && (
                <Chip
                  label="Nhóm"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ 
                    height: 20, 
                    fontSize: '0.7rem',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              )}
            </Box>
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
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {conversation.unreadCount > 0 && (
                <Badge
                  badgeContent={conversation.unreadCount}
                  color="primary"
                />
              )}
              
              <DeleteButtonContainer className="delete-button-container">
                <Tooltip title="Xóa cuộc trò chuyện" placement="top">
                  <IconButton
                    size="small"
                    onClick={handleDeleteClick}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'error.main',
                        color: 'error.contrastText'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </DeleteButtonContainer>
            </Box>
          </ConversationInfo>
        }
      />
    </StyledConversationItem>
  );
};

ConversationItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default ConversationItem; 