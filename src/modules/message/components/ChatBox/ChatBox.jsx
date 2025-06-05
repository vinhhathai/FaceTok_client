import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import { fetchMessages, sendMessage } from '../../redux/slices/messageSlice';
import { markConversationAsRead } from '../../redux/slices/conversationSlice';
import useMessageSocket from '../../hooks/useMessageSocket';
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

const ChatBox = ({ conversation, onBack }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { messages, loading, sending } = useSelector(state => state.messages);
  const { emit, connected } = useMessageSocket();
  const [inputDisabled, setInputDisabled] = useState(false);
  
  // Get user ID from localStorage
  const myChatId = localStorage.getItem('currentUserId');

  // Fetch messages when conversation changes
  useEffect(() => {
    if (conversation?._id) {
      dispatch(fetchMessages(conversation._id));
      dispatch(markConversationAsRead({ conversationId: conversation._id }));
    }
  }, [dispatch, conversation]);
  
  // Handle sending a new message
  const handleSendMessage = async (content) => {
    if (!content.trim() || !conversation) return;
    
    try {
      setInputDisabled(true);
      
      // Use socket to send message
      if (connected) {
        emit('send-message', {
          receiverId: conversation.participant._id,
          content
        });
      } else {
        // Fallback to HTTP if socket is not connected
        await dispatch(sendMessage({
          receiverId: conversation.participant._id, 
          roomId: conversation._id,
          content
        })).unwrap();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setInputDisabled(false);
    }
  };

  // If no active conversation, show placeholder
  if (!conversation) {
    return (
      <PlaceholderContainer>
        <Typography variant="h6" color="text.secondary">
          Hãy chọn một cuộc trò chuyện để bắt đầu
        </Typography>
      </PlaceholderContainer>
    );
  }

  return (
    <ChatBoxContainer elevation={0}>
      {/* Chat header */}
      <ChatHeader>
        <UserInfoContainer>
          <UserAvatar 
            src={conversation.participant?.avatar} 
            alt={conversation.participant?.fullName}
          />
          <Box>
            <Typography variant="subtitle1">
              {conversation.participant?.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {conversation.participant?.online ? 'Đang online' : 'Không hoạt động'}
            </Typography>
          </Box>
        </UserInfoContainer>

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
      </ChatHeader>
      
      {/* Message list */}
      {loading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : (
        <MessageList 
          messages={messages} 
          currentUserId={myChatId} 
        />
      )}
      
      {/* Chat input */}
      <InputContainer>
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={sending || inputDisabled || !connected}
          loading={sending}
        />
      </InputContainer>
    </ChatBoxContainer>
  );
};

ChatBox.propTypes = {
  conversation: PropTypes.object,
  onBack: PropTypes.func
};

export default ChatBox; 