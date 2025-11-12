import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, useMediaQuery, useTheme, CircularProgress, Snackbar, Alert, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import GroupSidebar from '../GroupSidebar/GroupSidebar';
import { fetchMessages } from '@message/redux/slices/messageSlice';
import useMessageSocket from '@message/hooks/useMessageSocket';
import { sendMessageToRoom } from '@message/api/messageAPI';
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
  const navigate = useNavigate();
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
  
  // State cho sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Memoize conversationId để tránh re-render không cần thiết
  const conversationId = useMemo(() => {
    return (conversation && conversation._id) || (currentConversation && currentConversation._id);
  }, [conversation?._id, currentConversation?._id]);
  
  // Lấy conversation mới nhất từ Redux để header cập nhật ngay khi tên nhóm đổi
  const storeConversation = useSelector(state => 
    state.conversations?.conversations?.find(c => c._id === conversationId)
  );
  const activeConversation = storeConversation || conversation || currentConversation;

  // Handler to navigate to user profile
  const handleAvatarClick = () => {
    if (!activeConversation?.isGroup && activeConversation?.participant?.id) {
      console.log('Navigating to profile:', activeConversation.participant.id);
      navigate(`/profile/${activeConversation.participant.id}`);
    } else {
      console.log('Cannot navigate - Group or no participant ID:', {
        isGroup: activeConversation?.isGroup,
        participantId: activeConversation?.participant?.id
      });
    }
  };
  // Lấy tin nhắn khi cuộc trò chuyện thay đổi
  useEffect(() => {
    if (conversationId) {
      setLoading(true);
      dispatch(fetchMessages(conversationId))
        .unwrap()
        .catch(error => {
          console.error('Failed to fetch messages:', error);
          // Toast sẽ được hiển thị qua socket error
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, conversationId]);
  
  // Xử lý gửi tin nhắn mới với Optimistic UI
  const handleSendMessage = useCallback(async (content, files = []) => {
    if ((!content.trim() && files.length === 0) || !activeConversation?._id || sending) {
      return;
    }

    setSending(true);
    setInputDisabled(true);

    try {
      // Tạo FormData nếu có files
      if (files.length > 0) {
        const formData = new FormData();
        formData.append('content', content.trim());
        files.forEach(file => {
          formData.append('media', file); // Backend expect 'media' field name
        });
        
        await sendMessageToRoom(activeConversation._id, formData, true);
      } else {
        // Gửi tin nhắn text thông thường
        await sendMessageToRoom(activeConversation._id, content.trim());
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
  }, [activeConversation, sending]);

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
            onClick={handleAvatarClick}
            sx={{
              backgroundColor: activeConversation.isGroup ? 'primary.main' : 'grey.300',
              color: activeConversation.isGroup ? 'white' : 'grey.700',
              cursor: !activeConversation.isGroup ? 'pointer' : 'default',
              transition: 'transform 0.2s',
              '&:hover': !activeConversation.isGroup ? {
                transform: 'scale(1.05)',
              } : {}
            }}
          >
            {activeConversation.isGroup ? <GroupIcon /> : <PersonIcon />}
          </UserAvatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold"
                noWrap
                sx={{ maxWidth: '100%' }}
              >
                {activeConversation.participant?.fullName || 'Unknown User'}
              </Typography>
              {activeConversation.isGroup && (
                <Chip
                  label="Nhóm"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ 
                    height: 20, 
                    fontSize: '0.7rem',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {activeConversation.isGroup 
                ? `${activeConversation.members?.length || 0} thành viên`
                : (connected ? 'Online' : 'Offline')
              }
            </Typography>
          </Box>
          
          {/* Info button cho group */}
          {activeConversation.isGroup && (
            <IconButton 
              onClick={() => setSidebarOpen(true)}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <InfoIcon />
            </IconButton>
          )}
        </UserInfoContainer>
      </ChatHeader>

      {/* Messages */}
      <MessageList 
        messages={messages} 
        currentUserId={myChatId}
        conversationId={activeConversation._id}
      />

      {/* Input hoặc thông báo nhóm đã giải tán */}
      <InputContainer>
        {activeConversation?.groupId?.isDissolved || activeConversation?.isGroupDissolved ? (
          <Typography variant="body2" color="text.secondary">
            Nhóm đã bị giải tán. Bạn không thể gửi tin nhắn.
          </Typography>
        ) : (
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={inputDisabled || !connected}
            sending={sending}
          />
        )}
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

      {/* Group Sidebar */}
      {activeConversation?.isGroup && (
        <GroupSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          conversation={activeConversation}
          currentUserId={myChatId}
        />
      )}
    </ChatBoxContainer>
  );
};

ChatBox.propTypes = {
  conversation: PropTypes.object,
  onBack: PropTypes.func,
  currentConversation: PropTypes.object
};

export default ChatBox; 