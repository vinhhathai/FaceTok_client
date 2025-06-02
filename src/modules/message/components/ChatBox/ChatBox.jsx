import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Avatar, CircularProgress, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import { fetchMessages, sendMessage } from '../../redux/slices/messageSlice';
import { markConversationAsRead } from '../../redux/slices/conversationSlice';
import { currentUserId } from '../../mock/mockData';

const ChatBox = ({ conversation, onBack }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { messages, loading, sending } = useSelector(state => state.messages);
  
  // Get user ID from mock data for demo purposes
  const myChatId = currentUserId;

  // Fetch messages when conversation changes
  useEffect(() => {
    if (conversation?._id) {
      dispatch(fetchMessages(conversation._id));
      dispatch(markConversationAsRead({ conversationId: conversation._id }));
      
      // Simulate a response after 2-5 seconds (only for interactive demo purposes)
      if (window.mockResponse) {
        const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
        window.mockResponse(conversation._id, randomDelay);
      }
    }
  }, [dispatch, conversation]);
  
  // Handle sending a new message
  const handleSendMessage = (content) => {
    if (!content.trim() || !conversation) return;
    
    dispatch(sendMessage({
      receiverId: conversation.participant._id, 
      conversationId: conversation._id,
      content
    }));
    
    // Simulate a response after 2-5 seconds (only for interactive demo purposes)
    if (window.mockResponse) {
      const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
      window.mockResponse(conversation._id, randomDelay);
    }
  };

  // If no active conversation, show placeholder
  if (!conversation) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        p: 3
      }}>
        <Typography variant="h6" color="text.secondary">
          Select a conversation to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        borderRadius: 0
      }}
    >
      {/* Chat header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={conversation.participant?.avatar} 
            alt={conversation.participant?.fullName}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1">
              {conversation.participant?.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {conversation.participant?.online ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Box>

        {/* Back button only on mobile */}
        {isMobile && onBack && (
          <IconButton 
            color="primary" 
            onClick={onBack} 
            sx={{ ml: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
      </Box>
      
      {/* Message list */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MessageList 
          messages={messages} 
          currentUserId={myChatId} 
        />
      )}
      
      {/* Chat input */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={sending}
          loading={sending}
        />
      </Box>
    </Paper>
  );
};

ChatBox.propTypes = {
  conversation: PropTypes.object,
  onBack: PropTypes.func
};

export default ChatBox; 