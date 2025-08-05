import React, { useEffect, useState } from 'react';
import { CircularProgress, IconButton, useMediaQuery, useTheme, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from '@utils/cookieUtils';

import ConversationList from '@message/components/ConversationList/ConversationList';
import ChatBox from '@message/components/ChatBox/ChatBox';
import MessageLayout from '@message/components/Layout/MessageLayout';
import useMessageSocket from '@message/hooks/useMessageSocket';
import { fetchConversations } from '@message/redux/slices/conversationSlice';
import { getOrCreateRoom } from '@message/api/messageAPI';
import { toast } from 'react-toastify';
import {
  ChatPageContainer,
  LoadingOverlay,
  ChatGridContainer,
  ConversationsGridItem,
  ConversationsPaper,
  ConversationsHeader,
  ConversationsListContainer,
  ChatAreaGridItem,
  MobileBackButtonBox
} from './ChatPage.styles';

const TOKEN_COOKIE_NAME = 'auth_token';

const ChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useLocation().state || {};
  
  const [showConversations, setShowConversations] = useState(!conversationId || !isMobile);
  const [showChat, setShowChat] = useState(!!conversationId || !isMobile);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [processingRoomCreation, setProcessingRoomCreation] = useState(false);
  
  const [currentConversation, setCurrentConversation] = useState(null);
  
  // Lấy conversations từ Redux
  const { conversations, loading: conversationsLoading } = useSelector(state => state.conversations);
  
  // Kiểm tra xem ID có phải là ObjectId MongoDB hợp lệ không (24 ký tự hex)
  const isValidMongoId = (id) => {
    return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
  };
  
  // Initialize WebSocket connection
  const { connected } = useMessageSocket(currentConversation);
  
  // Get current user ID from token in cookie
  useEffect(() => {
    const token = getCookie(TOKEN_COOKIE_NAME);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Trong AuthLoginService, token được tạo với trường userId
        const userId = decoded.userId;
        if (userId) {
          localStorage.setItem('currentUserId', userId);
          console.log('Set currentUserId to:', userId);
        } else {
          console.error('Could not find userId in token. Token fields:', 
            Object.keys(decoded));
          console.log('Token payload:', JSON.stringify(decoded, null, 2).substring(0, 200));
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.warn('No auth token found in cookies');
    }
  }, []);
  
  // Fetch conversations on mount
  useEffect(() => {
    if (conversations.length === 0) {
      dispatch(fetchConversations());
    }
  }, [dispatch, conversations.length]);
  
  // Listen for new messages to refresh conversation list
  useEffect(() => {
    const handleNewMessage = () => {
      // Refresh conversation list when new message is received
      dispatch(fetchConversations());
    };
    
    // Listen for message received event
    window.addEventListener('facetok_message_received', handleNewMessage);
    window.addEventListener('MESSAGE_SENT_SUCCESS', handleNewMessage);
    
    return () => {
      window.removeEventListener('facetok_message_received', handleNewMessage);
      window.removeEventListener('MESSAGE_SENT_SUCCESS', handleNewMessage);
    };
  }, [dispatch]);
  
  // Kiểm tra xem conversationId là userId hoặc roomId
  useEffect(() => {
    const checkOrCreateRoom = async () => {
      if (!conversationId) {
        // Nếu không có conversationId, xóa cuộc trò chuyện hiện tại
        setCurrentConversation(null);
        
        if (isMobile) {
          setShowConversations(true);
          setShowChat(false);
        }
        return;
      }
      
      if (conversationsLoading || !conversations.length) return;
      
      // Kiểm tra xem conversationId có khớp với bất kỳ phòng nào không
      const existingRoom = conversations.find(conv => conv._id === conversationId);
      
      if (existingRoom) {
        // Nếu tìm thấy phòng hiện có, hiển thị nó
        setCurrentConversation(existingRoom);
        
        if (isMobile) {
          setShowConversations(false);
          setShowChat(true);
        }
        return;
      }
      
      // Trước khi gửi, kiểm tra xem ID có hợp lệ không
      if (!isValidMongoId(conversationId)) {
        toast.error('ID người dùng không hợp lệ');
        navigate('/messages', {  replace: true });
        return;
      }
      
      // Ngăn ngừa nhiều cuộc gọi API đồng thời
      if (processingRoomCreation) {
        return;
      }
      
      // Đánh dấu đang xử lý
      setProcessingRoomCreation(true);
      
      // Thử tạo hoặc tìm phòng chat với người dùng này
      try {
        setLoadingRoom(true);
        
        const response = await getOrCreateRoom(conversationId);
        
        if (response && response.success && response.data && response.data.room) {
          // Nếu tạo phòng thành công, chuyển về /messages và truyền roomId qua state
          navigate('/messages', { replace: true, state: { roomId: response.data.room._id } });

          // Tìm phòng trong danh sách hoặc tải lại danh sách phòng
          setCurrentConversation(response.data.room);
          
          if (isMobile) {
            setShowConversations(false);
            setShowChat(true);
          }
        } else {
          // Không thể tạo phòng, chuyển về danh sách trò chuyện
          navigate('/messages', { replace: true });
          
          const errorMessage = response?.error?.message || 'Không thể tạo phòng chat với người dùng này.';
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error('Error creating room:', error);
        
        // Hiển thị thông báo lỗi chi tiết hơn nếu có
        let errorMessage = 'Không thể tạo phòng chat, vui lòng thử lại sau.';
        if (error.response?.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
        
        toast.error(errorMessage);
        navigate('/messages', { replace: true });
      } finally {
        setLoadingRoom(false);
        // Đặt lại trạng thái xử lý
        setProcessingRoomCreation(false);
      }
    };
    
    checkOrCreateRoom();
  }, [conversationId, currentConversation, isMobile, navigate, processingRoomCreation, conversations, conversationsLoading]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    // Ẩn roomId khỏi URL, truyền qua state
    navigate('/messages', { state: { roomId: conversation._id } });

    if (isMobile) {
      setShowConversations(false);
      setShowChat(true);
    }
  };
  
  // Handle back button on mobile
  const handleBackToConversations = () => {
    navigate('/messages');
    
    if (isMobile) {
      setShowConversations(true);
      setShowChat(false);
    }
  };
  
  return (
    <MessageLayout>
      <ChatPageContainer>
        {/* Hiển thị cảnh báo nếu không có kết nối socket */}
        {!connected && (
          <Alert 
            severity="warning" 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              zIndex: 10,
              borderRadius: 0
            }}
          >
            Đang kết nối đến máy chủ tin nhắn... Một số tính năng có thể không hoạt động.
          </Alert>
        )}
      
        {loadingRoom && (
          <LoadingOverlay>
            <CircularProgress />
          </LoadingOverlay>
        )}
        
        <ChatGridContainer container>
          {/* Conversations List */}
          {showConversations && (
            <ConversationsGridItem 
              item 
              xs={12} 
              md={4} 
              lg={3}
              showChat={showChat}
            >
              <ConversationsPaper elevation={0}>
                <ConversationsHeader>
                  Tin nhắn
                </ConversationsHeader>
                
                <ConversationsListContainer>
                  <ConversationList 
                    onSelectConversation={handleSelectConversation}
                    currentConversationId={currentConversation?._id}
                  />
                </ConversationsListContainer>
              </ConversationsPaper>
            </ConversationsGridItem>
          )}
          
          {/* Chat Area */}
          {showChat && (
            <ChatAreaGridItem 
              item 
              xs={12} 
              md={8} 
              lg={9}
              showConversations={showConversations}
            >
              {isMobile && currentConversation && (
                <MobileBackButtonBox>
                  <IconButton onClick={handleBackToConversations} edge="start">
                    <ArrowBackIcon />
                  </IconButton>
                </MobileBackButtonBox>
              )}
              
              <ChatBox 
                conversation={currentConversation}
                onBack={handleBackToConversations}
                currentConversation={currentConversation}
              />
            </ChatAreaGridItem>
          )}
        </ChatGridContainer>
      </ChatPageContainer>
    </MessageLayout>
  );
};

export default ChatPage; 