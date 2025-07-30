import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import { fetchMessages, addReceivedMessage } from '../../redux/slices/messageSlice';
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
  
  // Lấy ID người dùng từ localStorage
  const myChatId = localStorage.getItem('currentUserId');
  
  // Sử dụng conversation từ props và currentConversation từ Redux
  const activeConversation = conversation || currentConversation;

  // Lấy tin nhắn khi cuộc trò chuyện thay đổi
  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(fetchMessages(activeConversation._id));
    }
  }, [dispatch, activeConversation]);
  
  // Xử lý gửi tin nhắn mới với Optimistic UI
  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim() || !activeConversation) return;
    
    try {
      setInputDisabled(true);
      
      // Kiểm tra roomId có tồn tại không
      if (!activeConversation._id) {
        toast.error('Lỗi: Không thể xác định phòng chat');
        return;
      }
      
      // Tạo tin nhắn tạm thời để hiển thị ngay lập tức (Optimistic UI)
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        _id: tempId,
        content,
        senderId: myChatId,
        roomId: activeConversation._id,
        createdAt: new Date().toISOString(),
        isFromCurrentUser: true,
        isOptimistic: true // Đánh dấu là tin nhắn optimistic
      };
      
      // Thêm tin nhắn tạm thời vào Redux store
      dispatch(addReceivedMessage(optimisticMessage));
      
      // Sử dụng socket để gửi tin nhắn
      if (connected) {
        const emitData = {
          roomId: activeConversation._id,
          content
        };
        
        const sent = emit('send-message', emitData);
        
        if (!sent) {
          toast.error('Không thể gửi tin nhắn. Lỗi kết nối đến server.');
        }
      } else {
        toast.error('Không thể gửi tin nhắn. Đang mất kết nối đến server.');
      }
    } catch (error) {
      console.error('Không thể gửi tin nhắn. Vui lòng thử lại.', error);
      toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setInputDisabled(false);
    }
  }, [activeConversation, connected, emit, dispatch, myChatId]);

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
      {/* Chat header - Hiển thị chỉ khi không ở chế độ mobile */}
      {!isMobile && (
        <ChatHeader>
          <UserInfoContainer>
            <UserAvatar 
              src={activeConversation.participant?.profilePicture} 
              alt={activeConversation.participant?.fullName}
            />
            <Box>
              <Typography variant="subtitle1">
                {activeConversation.participant?.fullName || "Unknown User"}
              </Typography>
            </Box>
          </UserInfoContainer>
        </ChatHeader>
      )}
      
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