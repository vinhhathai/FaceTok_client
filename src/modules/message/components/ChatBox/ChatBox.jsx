import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import { fetchMessages } from '@message/redux/slices/messageSlice';
import useMessageSocket from '@message/hooks/useMessageSocket';
import { toast } from 'react-toastify';
import {
  ChatBoxContainer,
  PlaceholderContainer,
  ChatHeader,
  UserInfoContainer,
  UserAvatar,
  LoadingContainer,
  InputContainer
} from './ChatBox.styles';

const ChatBox = ({ conversation, onBack, currentConversation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { messages } = useSelector(state => state.messages);
  const { emit, connected } = useMessageSocket(currentConversation);
  
  // Local states thay vì Redux loading states
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  
  // Lấy ID người dùng từ localStorage
  const myChatId = localStorage.getItem('currentUserId');
  
  // Debug: Log currentUserId
  console.log('ChatBox: currentUserId from localStorage:', myChatId);
  
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
          toast.error('Không thể tải tin nhắn');
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
      toast.error('Không thể gửi tin nhắn');
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
      {/* Header */}
      <ChatHeader>
        {isMobile && (
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <UserInfoContainer>
          <UserAvatar
            src={activeConversation.participant?.avatar || '/assets/images/avatar_default.webp'}
            alt={activeConversation.participant?.fullName || 'User'}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
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
    </ChatBoxContainer>
  );
};

ChatBox.propTypes = {
  conversation: PropTypes.object,
  onBack: PropTypes.func,
  currentConversation: PropTypes.object
};

export default ChatBox; 