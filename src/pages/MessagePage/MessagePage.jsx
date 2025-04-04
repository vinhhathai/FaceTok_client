import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Grid,
  Box 
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ConversationSidebar from '../../components/ConversationSidebar/ConversationSidebar';
import MessageArea from '../../components/MessageArea/MessageArea';

// Import styles
import {
  PageContainer,
  ContentContainer
} from './styles';

// Redux actions
import { 
  fetchConversations, 
  fetchMessages,
  setActiveConversation, 
  clearMessages,
  resetUnreadCount,
  setTypingStatus
} from '../../redux/features/messageSlice';

// Socket.IO service
import socketService from '../../services/socketService';

function MessagePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector(state => state.user);
  const { 
    conversations, 
    messages, 
    activeConversation, 
    loading,
    onlineUsers,
    typingUsers
  } = useSelector(state => state.messages);
  
  // Get friends from the friends slice
  const { friends, friendshipStatus } = useSelector(state => state.friends);

  const [messageText, setMessageText] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Debug log when onlineUsers changes
  useEffect(() => {
    console.log('MessagePage - onlineUsers updated:', onlineUsers);
  }, [onlineUsers]);

  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.initSocket();
    
    // Clean up socket connection when component unmounts
    return () => {
      socketService.closeSocket();
    };
  }, []);

  // Load conversations when component mounts
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);
  
  // Xử lý tham số URL để khởi tạo cuộc trò chuyện
  useEffect(() => {
    if (conversations.length > 0 && initialLoad) {
      setInitialLoad(false);
      
      // Lấy userId từ URL query parameters
      const searchParams = new URLSearchParams(location.search);
      const targetUserId = searchParams.get('userId');
      
      if (targetUserId) {
        // Tạo conversation ID từ hai user IDs
        const userIds = [user._id, targetUserId].sort();
        const conversationId = `${userIds[0]}_${userIds[1]}`;
        
        // Tìm cuộc trò chuyện hiện có
        const existingConversation = conversations.find(c => c.id === conversationId);
        
        if (existingConversation) {
          // Nếu cuộc trò chuyện đã tồn tại, mở nó
          handleConversationClick(conversationId);
        }
      }
    }
  }, [conversations, location.search, initialLoad, user]);

  // Mark messages as read when conversation is active
  useEffect(() => {
    if (activeConversation) {
      // Reset unread count for this conversation
      dispatch(resetUnreadCount(activeConversation.id));
      
      // Mark unread messages as read
      messages.forEach(message => {
        if (!message.read && message.senderId !== user?._id) {
          socketService.markMessageAsRead(message.id);
        }
      });
    }
  }, [activeConversation, messages, dispatch, user]);

  const handleConversationClick = async (conversationId) => {
    // Find the selected conversation
    const selectedConversation = conversations.find(c => c.id === conversationId);
    
    // Set as active in Redux
    dispatch(setActiveConversation(selectedConversation));
    
    // Clear messages before loading new ones
    dispatch(clearMessages());
    
    // Fetch messages for this conversation
    dispatch(fetchMessages(conversationId));
  };

  const handleSendMessage = async () => {
    if (messageText.trim() && activeConversation) {
      const receiverId = activeConversation.user._id;
      
      // Send message via socket
      socketService.sendMessage(receiverId, messageText);
      
      // Clear the input
      setMessageText('');
      
      // Clear typing indicator
      handleStopTyping();
    }
  };

  const handleTyping = () => {
    if (activeConversation) {
      const receiverId = activeConversation.user._id;
      
      // Send typing status
      socketService.sendTypingStatus(receiverId, true);
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing indicator after 2 seconds
      const timeout = setTimeout(() => {
        handleStopTyping();
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleStopTyping = () => {
    if (activeConversation) {
      const receiverId = activeConversation.user._id;
      socketService.sendTypingStatus(receiverId, false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUserOnline = (userId) => {
    if (!onlineUsers || !Array.isArray(onlineUsers)) {
      return false;
    }
    const isOnline = onlineUsers.includes(userId);
    console.log(`MessagePage - Checking if user ${userId} is online:`, isOnline, 'onlineUsers:', onlineUsers);
    return isOnline;
  };

  const isUserTyping = (userId) => {
    return typingUsers[userId] === true;
  };

  // Check if a user is a friend
  const isFriend = (userId) => {
    return friends.some(friend => friend._id === userId) || 
      friendshipStatus[userId]?.status === 'friends';
  };

  // Filter conversations to only show friends
  const friendConversations = conversations.filter(
    conv => isFriend(conv.user._id)
  );

  return (
    <PageContainer>
      <Header />
      
      <ContentContainer>
        {loading && <LoadingSpinner text="Loading messages..." />}
        
        <Grid container sx={{ height: '100%', flexGrow: 1, overflow: 'hidden' }}>
          {/* Left sidebar - conversation list */}
          <Grid item xs={12} md={4} lg={3} sx={{ height: '100%', overflow: 'hidden' }}>
            <ConversationSidebar 
              conversations={friendConversations}
              loading={loading}
              activeConversation={activeConversation}
              onlineUsers={onlineUsers || []}
              typingUsers={typingUsers}
              handleConversationClick={handleConversationClick}
            />
          </Grid>
          
          {/* Message area */}
          <Grid item xs={12} md={8} lg={9} sx={{ height: '100%', overflow: 'hidden' }}>
            <MessageArea 
              activeConversation={activeConversation}
              messages={messages}
              messageText={messageText}
              setMessageText={setMessageText}
              handleSendMessage={handleSendMessage}
              handleTyping={handleTyping}
              handleStopTyping={handleStopTyping}
              currentUser={user}
              isUserOnline={isUserOnline}
              isUserTyping={isUserTyping}
              isFriend={isFriend}
              formatTime={formatTime}
            />
          </Grid>
        </Grid>
      </ContentContainer>
    </PageContainer>
  );
}

export default MessagePage; 