import React, { useEffect, useState } from 'react';
import { Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import useMessageSocket from '@message/hooks/useMessageSocket';
import MessageLayout from '@message/components/Layout/MessageLayout';
import ConversationList from '@message/components/ConversationList/ConversationList';
import ChatBox from '@message/components/ChatBox/ChatBox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
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
import { fetchConversations } from '@message/redux/slices/conversationSlice';

const MessageIndexPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'chat'
  const { loading, conversations } = useSelector(state => state.conversations);
  
  // Initialize WebSocket connection
  useMessageSocket(selectedConversation);
  
  // Auto-select first conversation for desktop
  useEffect(() => {
    // Auto-select first conversation for desktop only
    if (!loading && conversations && conversations.length > 0 && !selectedConversation && !isMobile) {
      const firstConversation = conversations[0];
      console.log('Auto-selecting first conversation:', firstConversation);
      setTimeout(() => {
        setSelectedConversation(firstConversation);
      }, 500);
    }
  }, [loading, conversations, selectedConversation, isMobile]);

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
  }, [isMobile, selectedConversation]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    console.log('Selected conversation before dispatch:', conversation);
    
    // Kiểm tra cấu trúc participant
    if (conversation && conversation.participant) {
      console.log('Participant structure:', conversation.participant);
      
      // Kiểm tra ID
      const participantId = conversation.participant._id || conversation.participant.id;
      if (!participantId) {
        console.error('Missing participant ID - please check conversation structure');
      } else {
        console.log('Found participant ID:', participantId);
      }
    } else {
      console.error('Missing participant in conversation');
    }
    
    setSelectedConversation(conversation);
    
    // In mobile, switch to chat view when selecting a conversation
    if (isMobile) {
      setMobileView('chat');
    }
  };

  // Handle delete conversation
  const handleDeleteConversation = (conversation) => {
    // If the deleted conversation is currently selected, clear selection
    if (selectedConversation && selectedConversation._id === conversation._id) {
      setSelectedConversation(null);
      
      // On mobile, go back to list view
      if (isMobile) {
        setMobileView('list');
      }
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
                  Tin nhắn
                </ConversationsHeader>
                
                <ConversationsListContainer>
                  <ConversationList 
                    onSelectConversation={handleSelectConversation}
                    currentConversationId={selectedConversation?._id}
                    onDelete={handleDeleteConversation}
                  />
                </ConversationsListContainer>
              </ConversationsPaper>
            </ConversationsGridItem>
          )}
          
          {/* Chat Area */}
          {(!isMobile || mobileView === 'chat') && (
            <ChatAreaGridItem item xs={12} md={8} lg={9}>
              {selectedConversation ? (
                <ChatBox 
                  conversation={selectedConversation}
                  currentConversation={selectedConversation}
                  onBack={handleBackToList}
                  sx={{ flex: 1 }}
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