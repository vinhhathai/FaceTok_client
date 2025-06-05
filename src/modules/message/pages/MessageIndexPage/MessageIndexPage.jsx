import React, { useEffect, useState } from 'react';
import { Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnreadCount } from '../../redux/slices/conversationSlice';
import useMessageSocket from '../../hooks/useMessageSocket';
import MessageLayout from '../../../../shared/components/Layout/MessageLayout';
import ConversationList from '../../components/ConversationList/ConversationList';
import ChatBox from '../../components/ChatBox/ChatBox';
import { conversations } from '../../mock/mockData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  PageContainer,
  MessageGridContainer,
  ConversationsGridItem,
  ConversationsPaper,
  ConversationsHeader,
  ConversationsListContainer,
  ChatAreaGridItem,
  MobileBackBox,
  WelcomeContainer
} from './MessageIndexPage.styles';

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
      <PageContainer>
        <MessageGridContainer container>
          {/* Conversations List */}
          {showConversationsList && (
            <ConversationsGridItem item xs={12} md={4} lg={3}>
              <ConversationsPaper elevation={0}>
                <ConversationsHeader>
                  Messages
                </ConversationsHeader>
                
                <ConversationsListContainer>
                  <ConversationList 
                    onSelectConversation={handleSelectConversation}
                    currentConversationId={selectedConversation?._id}
                  />
                </ConversationsListContainer>
              </ConversationsPaper>
            </ConversationsGridItem>
          )}
          
          {/* Chat Area */}
          {(!isMobile || mobileView === 'chat') && (
            <ChatAreaGridItem item xs={12} md={8} lg={9}>
              {/* Back button always visible on mobile when in chat view */}
              {isMobile && mobileView === 'chat' && (
                <MobileBackBox>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {selectedConversation?.participant?.fullName || 'Conversation'}
                  </Typography>
                  <IconButton onClick={handleBackToList} color="primary">
                    <ArrowBackIcon />
                  </IconButton>
                </MobileBackBox>
              )}
              
              {selectedConversation ? (
                <ChatBox 
                  conversation={selectedConversation} 
                  onBack={handleBackToList}
                />
              ) : (
                <WelcomeContainer>
                  <Typography variant="h5" gutterBottom>
                    Welcome to Messages
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Select a conversation from the list or start a new one to begin chatting
                  </Typography>
                </WelcomeContainer>
              )}
            </ChatAreaGridItem>
          )}
        </MessageGridContainer>
      </PageContainer>
    </MessageLayout>
  );
};

export default MessageIndexPage; 