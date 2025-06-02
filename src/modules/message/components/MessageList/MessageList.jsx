import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import MessageItem from '../MessageItem/MessageItem';

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Group messages by date
  const getMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Create an array of days with their messages
  const groupedMessages = messages.reduce((groups, message) => {
    const date = getMessageDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        overflowY: 'auto',
        flexGrow: 1,
        gap: 0.5
      }}
    >
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <Box key={date}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              my: 2
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                fontSize: '0.75rem',
                color: 'text.secondary'
              }}
            >
              {date}
            </Box>
          </Box>
          
          {dateMessages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))}
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  currentUserId: PropTypes.string.isRequired
};

export default MessageList; 