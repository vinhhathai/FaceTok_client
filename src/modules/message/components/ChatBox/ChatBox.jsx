import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, useMediaQuery, useTheme, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import { fetchMessages } from '@message/redux/slices/messageSlice';
import useMessageSocket from '@message/hooks/useMessageSocket';
import {
  ChatBoxContainer,
  PlaceholderContainer,
  ChatHeader,
  UserInfoContainer,
  UserAvatar,
  LoadingContainer,
  InputContainer,
  FloatingBackButton
} from './ChatBox.styles';

const ChatBox = ({ conversation, onBack, currentConversation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { messages } = useSelector(state => state.messages);
  const { emit, connected, toastInfo, handleCloseToast } = useMessageSocket(currentConversation);
  
  // Local states thay vì Redux loading states
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  
  // Lấy ID người dùng từ localStorage
  const myChatId = localStorage.getItem('currentUserId');
  
  // Debug: Log currentUserId và isMobile
  console.log('ChatBox: currentUserId from localStorage:', myChatId);
  console.log('ChatBox: isMobile:', isMobile);
  console.log('ChatBox: isSmallScreen:', isSmallScreen);
  console.log('ChatBox: onBack function:', onBack);
  
  // Sử dụng conversation từ props và currentConversation từ props
  const activeConversation = conversation || currentConversation;

  // Lấy tin nhắn khi cuộc trò chuyện thay đổi
  useEffect(() => {
    if (activeConversation?._id) {
      setLoading(true);
      dispatch(fetchMessages(activeConversation._id))
        .unwrap()
        .catch(error => {
          console.error('Failed to fetch messages:', error);
          // Toast sẽ được hiển thị qua socket error
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, activeConversation]);
  
  // Xử lý gửi tin nhắn mới với Optimistic UI
  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim() || !activeConversation?._id || sending) {
      return;
    }

    setSending(true);
    setInputDisabled(true);

    try {
      // Gửi tin nhắn qua socket
      const success = emit('send-message', {
        roomId: activeConversation._id,
        content: content.trim()
      });

      if (!success) {
        throw new Error('Không thể gửi tin nhắn');
      }

      // Reset input
      setInputDisabled(false);
    } catch (error) {
      console.error('Error sending message:', error);
      // Toast sẽ được hiển thị qua socket error
      setInputDisabled(false);
    } finally {
      setSending(false);
    }
  }, [activeConversation, emit, sending]);

  // Xử lý khi không có cuộc trò chuyện
  if (!activeConversation) {
    return (
      <PlaceholderContainer>
        <Typography variant="h6" color="text.secondary">
          Chọn một cuộc trò chuyện để bắt đầu
        </Typography>
      </PlaceholderContainer>
    );
  }

  // Xử lý khi đang tải tin nhắn
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Đang tải tin nhắn...
        </Typography>
      </LoadingContainer>
    );
  }

  return (
    <ChatBoxContainer>
      {/* Floating back button cho màn hình nhỏ */}
      {isSmallScreen && onBack && (
        <FloatingBackButton>
          <IconButton 
            onClick={onBack}
            sx={{
              backgroundColor: 'background.paper',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: 'background.paper',
                boxShadow: 6
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </FloatingBackButton>
      )}

      {/* Header */}
      <ChatHeader>
        <UserInfoContainer>
          {/* Inline back button cho màn hình vừa (không phải nhỏ) */}
          {isMobile && !isSmallScreen && onBack && (
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <UserAvatar
            src={activeConversation.participant?.avatar || '/assets/images/avatar_default.webp'}
            alt={activeConversation.participant?.fullName || 'User'}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold"
              noWrap
              sx={{ maxWidth: '100%' }}
            >
              {activeConversation.participant?.fullName || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {connected ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </UserInfoContainer>
      </ChatHeader>

      {/* Messages */}
      <MessageList 
        messages={messages} 
        currentUserId={myChatId}
        conversationId={activeConversation._id}
      />

      {/* Input */}
      <InputContainer>
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={inputDisabled || !connected}
          sending={sending}
        />
      </InputContainer>

      {/* Toast */}
      <Snackbar 
        open={toastInfo.open} 
        autoHideDuration={6000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toastInfo.severity} 
          sx={{ width: '100%' }}
        >
          {toastInfo.message}
        </Alert>
      </Snackbar>
    </ChatBoxContainer>
  );
};

ChatBox.propTypes = {
  conversation: PropTypes.object,
  onBack: PropTypes.func,
  currentConversation: PropTypes.object
};

export default ChatBox; 