import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import {
  MessageContainer,
  SenderAvatar,
  MessageContentWrapper,
  MessageBubble,
  MessageInfoContainer,
  TimeText,
  ReadStatusContainer
} from './MessageItem.styles';

// Hàm helper để trích xuất senderId từ message
const extractSenderId = (message) => {
  if (!message) return null;
  
  // Handle different formats of senderId
  if (typeof message.senderId === 'string') {
    return message.senderId;
  } else if (typeof message.senderId === 'object' && message.senderId !== null) {
    return message.senderId._id || message.senderId.id || JSON.stringify(message.senderId);
  } else if (message.sender) {
    if (typeof message.sender === 'string') {
      return message.sender;
    }
    return message.sender._id || message.sender.id || JSON.stringify(message.sender);
  }
  
  return null;
};

const MessageItem = ({ message, isOwn }) => {
  // Format the time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get sender information from the message
  const getSender = () => {
    if (message.sender) return message.sender;
    return { fullName: 'User', avatar: null };
  };
  
  const sender = getSender();

  // Sử dụng logic chính xác hơn để xác định tin nhắn là của mình
  const shouldBeOwn = message.isFromCurrentUser === true || isOwn;

  return (
    <MessageContainer isOwn={shouldBeOwn}>
      {!shouldBeOwn && (
        <SenderAvatar
          src={sender.avatar}
          alt={sender.fullName || 'User'}
        />
      )}

      <MessageContentWrapper>
        <MessageBubble
          elevation={0}
          isOwn={shouldBeOwn}
        >
          <Typography variant="body1">{message.content}</Typography>
        </MessageBubble>

        <MessageInfoContainer isOwn={shouldBeOwn}>
          <TimeText
            variant="caption"
          >
            {formatTime(message.createdAt)}
          </TimeText>

          {shouldBeOwn && (
            <ReadStatusContainer>
              {message.isRead ? (
                <DoneAllIcon color="primary" sx={{ fontSize: '0.8rem' }} />
              ) : (
                <DoneIcon sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
              )}
            </ReadStatusContainer>
          )}
        </MessageInfoContainer>
      </MessageContentWrapper>
    </MessageContainer>
  );
};

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  isOwn: PropTypes.bool.isRequired
};

export default MessageItem; 