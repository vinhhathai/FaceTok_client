import React, { useRef, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Avatar, 
  Badge, 
  TextField, 
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FriendButton from '../FriendButton/FriendButton';

import {
  MessageArea as MessageAreaContainer,
  ConversationHeader2,
  MessagesContainer,
  MessageBubble,
  MessageInputContainer,
  EmptyStateContainer
} from './styles';

const MessageArea = ({
  activeConversation,
  messages,
  messageText,
  setMessageText,
  handleSendMessage,
  handleTyping,
  handleStopTyping,
  currentUser,
  isUserOnline,
  isUserTyping,
  isFriend,
  formatTime
}) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle message sending with Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && activeConversation?.user && isFriend(activeConversation.user._id)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Kiểm tra trạng thái online
  const getOnlineStatus = (userId) => {
    if (!userId) return false;
    const online = isUserOnline(userId);
    console.log('User online status:', userId, online); // Debug log
    return online;
  };

  // Kiểm tra có phải là bạn bè hay không, với xử lý null/undefined
  const checkIsFriend = (userId) => {
    if (!userId) return false;
    return isFriend(userId);
  }

  return (
    <MessageAreaContainer>
      {activeConversation && activeConversation.user ? (
        <>
          {/* Conversation header */}
          <ConversationHeader2>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: getOnlineStatus(activeConversation.user._id) ? '#44b700' : '#bdbdbd',
                    color: getOnlineStatus(activeConversation.user._id) ? '#44b700' : '#bdbdbd',
                    boxShadow: `0 0 0 2px white`,
                    width: 12,
                    height: 12,
                    borderRadius: '50%'
                  },
                }}
              >
                <Avatar 
                  src={activeConversation.user.profilePicture} 
                  alt={activeConversation.user.fullName} 
                  sx={{ mr: 1.5, width: 40, height: 40 }}
                />
              </Badge>
              <Box>
                <Typography variant="h6">
                  {activeConversation.user.fullName}
                </Typography>
                {isUserTyping(activeConversation.user._id) && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FiberManualRecordIcon sx={{ fontSize: 8, mr: 0.5 }} />
                    Typing...
                  </Typography>
                )}
              </Box>
            </Box>
            
            {/* Friend button for non-friends */}
            {!checkIsFriend(activeConversation.user._id) && (
              <FriendButton 
                userId={activeConversation.user._id}
                size="small"
                variant="contained"
              />
            )}
          </ConversationHeader2>
          
          {/* Messages */}
          <MessagesContainer ref={messagesContainerRef}>
            {messages.map((message) => (
              <Box 
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.senderId === currentUser?._id ? 'flex-end' : 'flex-start',
                  mb: 2,
                  width: '100%'
                }}
              >
                <MessageBubble isSender={message.senderId === currentUser?._id}>
                  <Typography variant="body1">{message.text}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(message.timestamp)}
                    </Typography>
                    {message.senderId === currentUser?._id && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ ml: 0.5 }}
                      >
                        {message.read ? '✓✓' : '✓'}
                      </Typography>
                    )}
                  </Box>
                </MessageBubble>
              </Box>
            ))}
            
            {/* Placeholder to scroll to */}
            <div ref={messagesEndRef} style={{ height: '1px', marginBottom: '8px' }} />
            
            {/* Friendship notice for non-friends */}
            {!checkIsFriend(activeConversation.user._id) && (
              <Box sx={{ textAlign: 'center', my: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                <Typography color="text.secondary" gutterBottom>
                  To continue messaging, become friends with {activeConversation.user.fullName}
                </Typography>
                <FriendButton 
                  userId={activeConversation.user._id}
                  size="medium"
                  variant="contained"
                />
              </Box>
            )}
          </MessagesContainer>
          
          {/* Message input - disabled for non-friends */}
          <MessageInputContainer>
            <TextField
              fullWidth
              placeholder={checkIsFriend(activeConversation.user._id) 
                ? "Type a message..." 
                : "Add as friend to send messages"}
              variant="outlined"
              size="small"
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              onBlur={handleStopTyping}
              disabled={!checkIsFriend(activeConversation.user._id)}
            />
            <IconButton 
              color="primary" 
              sx={{ ml: 1 }} 
              onClick={handleSendMessage}
              disabled={!messageText.trim() || !checkIsFriend(activeConversation.user._id)}
            >
              <SendIcon />
            </IconButton>
          </MessageInputContainer>
        </>
      ) : (
        <EmptyStateContainer>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có tin nhắn nào
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Chọn một cuộc trò chuyện hoặc bắt đầu một cuộc trò chuyện mới
          </Typography>
        </EmptyStateContainer>
      )}
    </MessageAreaContainer>
  );
};

export default MessageArea; 