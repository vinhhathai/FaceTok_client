import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnreadCount } from '../../redux/slices/conversationSlice';
import useMessageSocket from '../../hooks/useMessageSocket';
import MessageLayout from '../../../../shared/components/Layout/MessageLayout';
import ConversationList from '../../components/ConversationList/ConversationList';
import ChatBox from '../../components/ChatBox/ChatBox';
import { conversations } from '../../mock/mockData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MessageIndexPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'chat'
  const { loading } = useSelector(state => state.conversations);
  
  // Initialize WebSocket connection
  useMessageSocket();
  
  // Fetch unread count on mount
  useEffect(() => {
    dispatch(fetchUnreadCount());
    
    // Auto-select first conversation for desktop only
    if (!loading && conversations.length > 0 && !selectedConversation && !isMobile) {
      setTimeout(() => {
        setSelectedConversation(conversations[0]);
      }, 500);
    }
  }, [dispatch, loading, selectedConversation, isMobile]);

  // Reset view when screen size changes
  useEffect(() => {
    if (!isMobile) {
      // Desktop view doesn't use mobileView state
    } else if (selectedConversation) {
      // If we have a selected conversation on mobile, show chat view
      setMobileView('chat');
    } else {
      // Otherwise show list view
      setMobileView('list');
    }
  }, [isMobile]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // In mobile, switch to chat view when selecting a conversation
    if (isMobile) {
      setMobileView('chat');
    }
  };
  
  // Handle back button on mobile
  const handleBackToList = () => {
    if (isMobile) {
      setMobileView('list');
    }
  };
  
  // Show conversation list in these cases:
  // 1. On desktop (always)
  // 2. On mobile when in 'list' view
  const showConversationsList = !isMobile || (isMobile && mobileView === 'list');
  
  // Show chat in these cases:
  // 1. On desktop when a conversation is selected
  // 2. On mobile when in 'chat' view and a conversation is selected
  const showChatBox = !isMobile ? !!selectedConversation : (mobileView === 'chat' && !!selectedConversation);
  
  return (
    <MessageLayout>
      <Box sx={{ height: '100%' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Conversations List */}
          {showConversationsList && (
            <Grid 
              item 
              xs={12} 
              md={4} 
              lg={3}
              sx={{ 
                height: '100%',
                borderRight: '1px solid',
                borderColor: 'divider',
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
                    currentConversationId={selectedConversation?._id}
                  />
                </Box>
              </Paper>
            </Grid>
          )}
          
          {/* Chat Area */}
          {(!isMobile || mobileView === 'chat') && (
            <Grid 
              item 
              xs={12} 
              md={8} 
              lg={9}
              sx={{ 
                height: '100%',
              }}
            >
              {/* Back button always visible on mobile when in chat view */}
              {isMobile && mobileView === 'chat' && (
                <Box sx={{ 
                  p: 1, 
                  borderBottom: '1px solid', 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: theme.palette.background.paper,
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {selectedConversation?.participant?.fullName || 'Conversation'}
                  </Typography>
                  <IconButton onClick={handleBackToList} color="primary">
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
              )}
              
              {selectedConversation ? (
                <ChatBox 
                  conversation={selectedConversation} 
                  onBack={handleBackToList}
                />
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                    p: 3
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Welcome to Messages
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Select a conversation from the list or start a new one to begin chatting
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </MessageLayout>
  );
};

export default MessageIndexPage; 