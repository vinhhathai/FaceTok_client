import React, { useEffect, useState } from 'react';
import { Typography, IconButton, useMediaQuery, useTheme, Box, Fab, Tooltip } from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import useMessageSocket from '@message/hooks/useMessageSocket';
import MessageLayout from '@message/components/Layout/MessageLayout';
import ConversationList from '@message/components/ConversationList/ConversationList';
import ChatBox from '@message/components/ChatBox/ChatBox';
import CreateGroupModal from '@message/components/CreateGroupModal/CreateGroupModal';
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
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const { loading, conversations } = useSelector(state => state.conversations);
  
  // Initialize WebSocket connection
  useMessageSocket(selectedConversation);
  
  // Auto-select first conversation for desktop
  useEffect(() => {
    // Auto-select first conversation for desktop only
    if (!loading && conversations && conversations.length > 0 && !selectedConversation && !isMobile) {
      const firstConversation = conversations[0];

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

  // Handle create group
  const handleCreateGroup = (newGroup) => {
    // Add new group to conversations list
    // This will be handled by Redux when backend is ready
    toast.success(`Đã tạo nhóm "${newGroup.name}" thành công!`);
    
    // Refresh conversation list to include the new group
    dispatch(fetchConversations());
    
    // Select the new group
    setSelectedConversation(newGroup);
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

                {/* Create Group Button - Fixed at bottom right */}
                <Box sx={{ position: 'relative', height: 80 }}>
                  <Tooltip title="Tạo nhóm chat mới" placement="top">
                    <Fab
                      color="primary"
                      size="medium"
                      onClick={() => setShowCreateGroupModal(true)}
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                          transform: 'scale(1.05)',
                          background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                        },
                        // Ensure button is visible on all screen sizes
                        '@media (max-width: 600px)': {
                          bottom: 12,
                          right: 12,
                          width: 48,
                          height: 48,
                          '& .MuiSvgIcon-root': {
                            fontSize: 20
                          }
                        },
                        '@media (min-width: 601px) and (max-width: 960px)': {
                          bottom: 14,
                          right: 14,
                          width: 52,
                          height: 52,
                          '& .MuiSvgIcon-root': {
                            fontSize: 22
                          }
                        }
                      }}
                    >
                      <GroupIcon />
                    </Fab>
                  </Tooltip>
                </Box>
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

          {/* Mobile Create Group Button - Only show when in chat view on mobile */}
          {isMobile && mobileView === 'chat' && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1000,
                display: { xs: 'block', sm: 'block', md: 'none' }
              }}
            >
              <Tooltip title="Tạo nhóm chat mới" placement="top">
                <Fab
                  color="primary"
                  size="medium"
                  onClick={() => setShowCreateGroupModal(true)}
                  sx={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                      transform: 'scale(1.05)',
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                    },
                    width: 48,
                    height: 48,
                    '& .MuiSvgIcon-root': {
                      fontSize: 20
                    }
                  }}
                >
                  <GroupIcon />
                </Fab>
              </Tooltip>
            </Box>
          )}
        </MessageGridContainer>
      </PageContainer>

      {/* Create Group Modal */}
      <CreateGroupModal
        open={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onGroupCreated={handleCreateGroup}
      />
    </MessageLayout>
  );
};

export default MessageIndexPage; 