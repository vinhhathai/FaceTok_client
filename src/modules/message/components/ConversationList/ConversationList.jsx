import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, List, CircularProgress } from '@mui/material';
import ConversationItem from '../ConversationItem/ConversationItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../../redux/slices/conversationSlice';

const ConversationList = ({ onSelectConversation, currentConversationId }) => {
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector(state => state.conversations);

  // Fetch conversations on component mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%', 
          p: 3 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%', 
          p: 3 
        }}
      >
        <Typography color="error">
          Failed to load conversations
        </Typography>
      </Box>
    );
  }

  if (conversations.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%', 
          p: 3 
        }}
      >
        <Typography color="text.secondary">
          No conversations yet
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding sx={{ overflow: 'auto' }}>
      {conversations.map((conversation) => (
        <ConversationItem 
          key={conversation._id}
          conversation={conversation}
          isActive={conversation._id === currentConversationId}
          onClick={() => onSelectConversation(conversation)}
        />
      ))}
    </List>
  );
};

ConversationList.propTypes = {
  onSelectConversation: PropTypes.func.isRequired,
  currentConversationId: PropTypes.string
};

export default ConversationList; 