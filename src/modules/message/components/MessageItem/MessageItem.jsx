import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import { users } from '../../mock/mockData';

const MessageItem = ({ message, isOwn }) => {
  // Format the time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Lấy thông tin sender từ mock data khi cần
  const getSender = () => {
    if (message.sender) return message.sender;
    return users.find(u => u._id === message.senderId) || {};
  };
  
  const sender = getSender();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        mb: 1.5,
        alignItems: 'flex-end'
      }}
    >
      {!isOwn && (
        <Avatar
          src={sender.avatar}
          alt={sender.fullName || 'User'}
          sx={{ width: 36, height: 36, mr: 1 }}
        />
      )}

      <Box sx={{ maxWidth: '75%' }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            backgroundColor: isOwn ? 'primary.main' : 'background.paper',
            color: isOwn ? 'white' : 'text.primary',
            borderRadius: 2,
            ...(isOwn
              ? { borderBottomRightRadius: 0 }
              : { borderBottomLeftRadius: 0 }),
            boxShadow: 1
          }}
        >
          <Typography variant="body1">{message.content}</Typography>
        </Paper>

        <Box
          sx={{
            display: 'flex',
            mt: 0.5,
            justifyContent: isOwn ? 'flex-end' : 'flex-start',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.65rem' }}
          >
            {formatTime(message.createdAt)}
          </Typography>

          {isOwn && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
              {message.isRead ? (
                <DoneAllIcon color="primary" sx={{ fontSize: '0.8rem' }} />
              ) : (
                <DoneIcon sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  isOwn: PropTypes.bool.isRequired
};

export default MessageItem; 