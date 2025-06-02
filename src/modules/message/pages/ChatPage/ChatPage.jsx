import React, { useEffect, useState } from 'react';
import { Grid, Box, Paper, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ConversationList from '../../components/ConversationList/ConversationList';
import ChatBox from '../../components/ChatBox/ChatBox';
import MessageLayout from '../../../../shared/components/Layout/MessageLayout';
import useMessageSocket from '../../hooks/useMessageSocket';
import { setCurrentConversation, clearCurrentConversation } from '../../redux/slices/messageSlice';
import { fetchConversations } from '../../redux/slices/conversationSlice';
import { currentUserId } from '../../mock/mockData';

const ChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  
  const [showConversations, setShowConversations] = useState(!conversationId || !isMobile);
  const [showChat, setShowChat] = useState(!!conversationId || !isMobile);
  
  const { conversations, loading: conversationsLoading } = useSelector(state => state.conversations);
  const { currentConversation } = useSelector(state => state.messages);
  
  // Initialize WebSocket connection
  useMessageSocket();
  
  // Fetch conversations on mount
  useEffect(() => {
    if (conversations.length === 0) {
      dispatch(fetchConversations());
    }
  }, [dispatch, conversations.length]);
  
  // Set current conversation based on URL param
  useEffect(() => {
    if (conversationId && conversations.length > 0 && !conversationsLoading) {
      const conversation = conversations.find(conv => conv._id === conversationId);
      if (conversation) {
        dispatch(setCurrentConversation(conversation));
        
        // Store current user ID in localStorage for demo purposes
        localStorage.setItem('currentUserId', currentUserId);
        
        if (isMobile) {
          setShowConversations(false);
          setShowChat(true);
        }
      }
    } else if (!conversationId) {
      dispatch(clearCurrentConversation());
      
      if (isMobile) {
        setShowConversations(true);
        setShowChat(false);
      }
    }
  }, [conversationId, conversations, conversationsLoading, dispatch, isMobile]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    navigate(`/messages/${conversation._id}`);
    
    if (isMobile) {
      setShowConversations(false);
      setShowChat(true);
    }
  };
  
  // Handle back button on mobile
  const handleBackToConversations = () => {
    navigate('/messages');
    
    if (isMobile) {
      setShowConversations(true);
      setShowChat(false);
    }
  };
  
  return (
    <MessageLayout>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Grid container sx={{ flexGrow: 1, height: '100%' }}>
          {/* Conversations List */}
          {showConversations && (
            <Grid 
              item 
              xs={12} 
              md={4} 
              lg={3}
              sx={{ 
                height: '100%',
                borderRight: '1px solid',
                borderColor: 'divider',
                display: { xs: showChat ? 'none' : 'block', md: 'block' }
              }}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  borderRadius: 0,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ 
                  p: 2, 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  fontWeight: 'bold'
                }}>
                  Messages
                </Box>
                
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                  <ConversationList 
                    onSelectConversation={handleSelectConversation}
                    currentConversationId={currentConversation?._id}
                  />
                </Box>
              </Paper>
            </Grid>
          )}
          
          {/* Chat Area */}
          {showChat && (
            <Grid 
              item 
              xs={12} 
              md={8} 
              lg={9}
              sx={{ 
                height: '100%',
                display: { xs: showConversations ? 'none' : 'block', md: 'block' }
              }}
            >
              {isMobile && currentConversation && (
                <Box sx={{ 
                  p: 1, 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <IconButton onClick={handleBackToConversations} edge="start">
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
              )}
              
              <ChatBox conversation={currentConversation} />
            </Grid>
          )}
        </Grid>
      </Box>
    </MessageLayout>
  );
};

export default ChatPage; 