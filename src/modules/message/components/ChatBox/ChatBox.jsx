import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import { fetchMessages, forceUpdateMessages } from '../../redux/slices/messageSlice';
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
  const { messages, loading, sending, currentConversation } = useSelector(state => state.messages);
  const { emit, connected } = useMessageSocket();
  const [inputDisabled, setInputDisabled] = useState(false);
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  const messageAddedRef = useRef(false);
  
  // Lấy ID người dùng từ localStorage
  const myChatId = localStorage.getItem('currentUserId');
  
  // Sử dụng conversation từ props và currentConversation từ Redux
  const activeConversation = conversation || currentConversation;

  // Force update ít hơn, chỉ khi cần thiết
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (messageAddedRef.current) {
        setForceUpdateCounter(prev => prev + 1);
        messageAddedRef.current = false;
      }
    }, 500); // Tăng thời gian lên để giảm số lần update
    
    return () => clearInterval(updateInterval);
  }, []);
  
  // Lắng nghe sự kiện MESSAGE_ADDED_TO_REDUX để cập nhật UI 
  useEffect(() => {
    const handleMessageAddedToRedux = () => {
      messageAddedRef.current = true;
    };
    
    window.addEventListener('MESSAGE_ADDED_TO_REDUX', handleMessageAddedToRedux);
    
    return () => {
      window.removeEventListener('MESSAGE_ADDED_TO_REDUX', handleMessageAddedToRedux);
    };
  }, []);

  // Lắng nghe sự kiện MESSAGE_SENT_SUCCESS để tự động cập nhật
  useEffect(() => {
    const handleMessageSentSuccess = () => {
      messageAddedRef.current = true;
    };
    
    window.addEventListener('MESSAGE_SENT_SUCCESS', handleMessageSentSuccess);
    
    return () => {
      window.removeEventListener('MESSAGE_SENT_SUCCESS', handleMessageSentSuccess);
    };
  }, []);

  // Lấy tin nhắn khi cuộc trò chuyện thay đổi
  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(fetchMessages(activeConversation._id));
      dispatch(markConversationAsRead({ conversationId: activeConversation._id }));
    }
  }, [dispatch, activeConversation]);
  
  // Xử lý gửi tin nhắn mới
  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim() || !activeConversation) return;
    
    try {
      setInputDisabled(true);
      
      // Xác định receiverId
      let receiverId = null;
      
      // Lấy receiverId từ participant trong conversation đã chuẩn hóa
      if (activeConversation.participant && activeConversation.participant._id) {
        receiverId = activeConversation.participant._id;
      }
      // Fallback nếu cấu trúc khác
      else if (activeConversation.members && Array.isArray(activeConversation.members)) {
        // Lọc members khác với currentUserId
        const otherMembers = activeConversation.members.filter(member => {
          const memberId = member._id || member.id;
          return memberId !== myChatId;
        });
        
        if (otherMembers.length > 0) {
          receiverId = otherMembers[0]._id || otherMembers[0].id;
        }
      }
      
      // Kiểm tra xem đã có receiverId chưa
      if (!receiverId) {
        toast.error('Lỗi: Không thể xác định người nhận');
        return;
      }
      
      // Sử dụng socket để gửi tin nhắn
      if (connected) {
        const emitData = {
          receiverId: receiverId,
          content
        };
        
        const sent = emit('send-message', emitData);
        
        if (sent) {
          // Đánh dấu cần cập nhật UI
          messageAddedRef.current = true;
        } else {
          toast.error('Không thể gửi tin nhắn. Lỗi kết nối đến server.');
        }
      } else {
        toast.error('Không thể gửi tin nhắn. Đang mất kết nối đến server.');
      }
    } catch (error) {
      toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setInputDisabled(false);
    }
  }, [activeConversation, connected, emit, myChatId]);

  // Nếu không có cuộc trò chuyện đang kích hoạt, hiển thị placeholder
  if (!activeConversation) {
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
        {/* Back button only on mobile */}
        {isMobile && onBack && (
          <IconButton 
            color="primary" 
            onClick={onBack} 
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        <UserInfoContainer>
          <UserAvatar 
            src={activeConversation.participant?.avatar} 
            alt={activeConversation.participant?.fullName}
          />
          <Box>
            <Typography variant="subtitle1">
              {activeConversation.participant?.fullName || "Unknown User"}
            </Typography>
          </Box>
        </UserInfoContainer>
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
          key={`message-list-${forceUpdateCounter}`} 
        />
      )}
      
      {/* Chat input */}
      <InputContainer>
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={inputDisabled || !connected}
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