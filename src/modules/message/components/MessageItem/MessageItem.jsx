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

  return (
    <MessageContainer isOwn={isOwn}>
      {!isOwn && (
        <SenderAvatar
          src={sender.avatar}
          alt={sender.fullName || 'User'}
        />
      )}

      <MessageContentWrapper>
        <MessageBubble
          elevation={0}
          isOwn={isOwn}
        >
          <Typography variant="body1">{message.content}</Typography>
        </MessageBubble>

        <MessageInfoContainer isOwn={isOwn}>
          <TimeText
            variant="caption"
          >
            {formatTime(message.createdAt)}
          </TimeText>

          {isOwn && (
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