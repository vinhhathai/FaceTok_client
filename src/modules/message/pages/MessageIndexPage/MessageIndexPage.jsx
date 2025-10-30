import React, { useEffect, useState } from 'react';
import { Typography, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useMessageSocket from '@message/hooks/useMessageSocket';
import MessageLayout from '@message/components/Layout/MessageLayout';
import ConversationList from '@message/components/ConversationList/ConversationList';
import ChatBox from '@message/components/ChatBox/ChatBox';
import CreateGroupModal from '@message/components/CreateGroupModal/CreateGroupModal';
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
import { FabContainer, CreateGroupFab, MobileFabWrapper } from './MessageIndexPage.styles';
import { fetchConversations, markGroupDissolved, markConversationAsRead } from '@message/redux/slices/conversationSlice';
import { getRoomById } from '@message/api/messageAPI';

const MessageIndexPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'chat'
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const { loading, conversations } = useSelector(state => state.conversations);
  
  // Get friendId from navigation state
  const friendId = location.state?.friendId;
  const friendInfo = location.state?.friendInfo;
  
  // Initialize WebSocket connection
  useMessageSocket(selectedConversation);
  
  // Handle friendId from navigation state - auto-select conversation with friend
  useEffect(() => {
    if (friendId && !loading && conversations && conversations.length > 0) {
      // Find existing conversation with this friend
      const existingConversation = conversations.find(conv => {
        // Check if this is a direct message conversation with the friend
        return conv.participants && conv.participants.some(participant => 
          participant._id === friendId || participant.id === friendId
        ) && !conv.groupId; // Ensure it's not a group conversation
      });
      
      if (existingConversation) {
        // Select the existing conversation
        handleSelectConversation(existingConversation);
      } else {
        // TODO: Create new conversation with friend
        // This would require an API call to create a new conversation
        console.log('Need to create new conversation with friend:', friendId, friendInfo);
      }
    }
  }, [friendId, loading, conversations]);

  // Auto-select first conversation for desktop
  useEffect(() => {
    // Auto-select first conversation for desktop only
    if (!loading && conversations && conversations.length > 0 && !selectedConversation && !isMobile && !friendId) {
      const firstConversation = conversations[0];

      setTimeout(() => {
        setSelectedConversation(firstConversation);
      }, 500);
    }
  }, [loading, conversations, selectedConversation, isMobile, friendId]);

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
    // Mark conversation as read khi click
    if (conversation.unreadCount > 0) {
      dispatch(markConversationAsRead({ conversationId: conversation._id }));
    }
    
    // Hiển thị ngay để UI phản hồi nhanh
    setSelectedConversation(conversation);

    // In mobile, switch to chat view when selecting a conversation
    if (isMobile) {
      setMobileView('chat');
    }

    // Tải chi tiết room để kiểm tra dissolved và cập nhật trạng thái input
    if (conversation?._id) {
      getRoomById(conversation._id)
        .then((res) => {
          const room = res?.data?.room || res?.data?.data || res?.data || null;
          const group = room?.groupId || room?.group || null;
          const isDissolved = !!(group && (group.isDissolved || group?.is_dissolved));
          if (isDissolved) {
            // Cập nhật Redux để ChatBox nhận đúng activeConversation từ store
            dispatch(markGroupDissolved({ roomId: conversation._id }));
            setSelectedConversation((prev) => {
              if (!prev || prev._id !== conversation._id) return prev;
              const prevGroup = prev.groupId;
              let nextGroup = prevGroup;
              if (prevGroup && typeof prevGroup === 'object') {
                nextGroup = { ...prevGroup, isDissolved: true };
              } else {
                const id = (typeof prevGroup === 'string' && prevGroup) || group?._id || group || conversation.groupId;
                nextGroup = id ? { _id: id, isDissolved: true } : { isDissolved: true };
              }
              return { ...prev, groupId: nextGroup, isGroupDissolved: true };
            });
          }
        })
        .catch(() => {
          // ignore; không chặn luồng UI
        });
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

  // Khi rời nhóm, nếu conversation hiện tại bị xóa, quay về danh sách
  useEffect(() => {
    const handleGroupLeft = (e) => {
      const roomId = e?.detail?.roomId;
      if (roomId && selectedConversation?._id === roomId) {
        setSelectedConversation(null);
        if (isMobile) setMobileView('list');
      }
    };
    window.addEventListener('GROUP_LEFT', handleGroupLeft);
    return () => window.removeEventListener('GROUP_LEFT', handleGroupLeft);
  }, [isMobile, selectedConversation]);

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
                <FabContainer>
                  <Tooltip title="Tạo nhóm chat mới" placement="top">
                    <CreateGroupFab
                      color="primary"
                      size="medium"
                      onClick={() => setShowCreateGroupModal(true)}
                      sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000 }}
                    >
                      <GroupIcon />
                    </CreateGroupFab>
                  </Tooltip>
                </FabContainer>
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
            <MobileFabWrapper>
              <Tooltip title="Tạo nhóm chat mới" placement="top">
                <CreateGroupFab
                  color="primary"
                  size="medium"
                  onClick={() => setShowCreateGroupModal(true)}
                >
                  <GroupIcon />
                </CreateGroupFab>
              </Tooltip>
            </MobileFabWrapper>
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