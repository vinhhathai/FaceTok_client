import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Box,
  useTheme
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import ScheduleIcon from '@mui/icons-material/Schedule';
import UndoIcon from '@mui/icons-material/Undo';
import BlockIcon from '@mui/icons-material/Block';
import { useSocket } from '@contexts/SocketContext';
import { useDispatch } from 'react-redux';
import { updateMessageAsRevoked } from '@message/redux/slices/messageSlice';
import { toast } from 'react-toastify';
import {
  MessageContainer,
  SenderAvatar,
  MessageContentWrapper,
  MessageBubble,
  MessageInfoContainer,
  TimeText,
  ReadStatusContainer,
  RecallButtonContainer
} from './MessageItem.styles';
import './MessageItem.css';

// Hàm helper để trích xuất senderId từ message
const extractSenderId = (message) => {
  if (!message) return null;
  
  // Handle different formats of senderId
  if (typeof message.senderId === 'string') {
    return message.senderId;
  } else if (typeof message.senderId === 'object' && message.senderId !== null) {
    return message.senderId._id || message.senderId.id || JSON.stringify(message.senderId);
  } else if (message.sender) {
    if (typeof message.sender === 'string') {
      return message.sender;
    }
    return message.sender._id || message.sender.id || JSON.stringify(message.sender);
  }
  
  return null;
};

const MessageItem = ({ message, isOwn }) => {
  const [showRecallButton, setShowRecallButton] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isRecalling, setIsRecalling] = useState(false);
  const { socket, connected } = useSocket();
  const dispatch = useDispatch();
  const theme = useTheme();

  // Format the time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get sender information from the message
  const getSender = () => {
    if (message.sender) return message.sender;
    return { fullName: 'User', avatar: null };
  };
  
  const sender = getSender();

  // Sử dụng logic chính xác hơn để xác định tin nhắn là của mình
  const shouldBeOwn = message.isFromCurrentUser === true || isOwn;
  
  // Kiểm tra xem tin nhắn có phải là optimistic không
  const isOptimistic = message.isOptimistic === true;

  // Kiểm tra xem tin nhắn đã được thu hồi chưa
  const isRevoked = message.isRevoked === true;

  // Handle recall message
  const handleRecallMessage = () => {
    setShowConfirmDialog(true);
  };

  // Handle confirm recall
  const handleConfirmRecall = async () => {
    if (!connected || !socket) {
      toast.error('Không thể kết nối đến server');
      setShowConfirmDialog(false);
      return;
    }

    setIsRecalling(true);
    
    try {
      // Emit revoke_message event
      socket.emit('revoke_message', {
        messageId: message._id,
        senderId: message.senderId
      });

      // Listen for response
      socket.once('message_revoked', (data) => {
        // Update Redux store to mark message as revoked
        dispatch(updateMessageAsRevoked({ messageId: message._id }));
        toast.success('Đã thu hồi tin nhắn thành công');
        setShowConfirmDialog(false);
        setIsRecalling(false);
      });

      // Listen for error
      socket.once('message_error', (data) => {
        toast.error(data.message || 'Không thể thu hồi tin nhắn');
        setShowConfirmDialog(false);
        setIsRecalling(false);
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        if (isRecalling) {
          toast.error('Không thể thu hồi tin nhắn - timeout');
          setShowConfirmDialog(false);
          setIsRecalling(false);
        }
      }, 5000);

    } catch (error) {
      console.error('Error recalling message:', error);
      toast.error('Không thể thu hồi tin nhắn');
      setShowConfirmDialog(false);
      setIsRecalling(false);
    }
  };

  // Handle cancel recall
  const handleCancelRecall = () => {
    setShowConfirmDialog(false);
  };

  // Nếu tin nhắn đã được thu hồi, hiển thị UI khác
  if (isRevoked) {
    return (
      <MessageContainer isOwn={shouldBeOwn}>
        {!shouldBeOwn && (
          <SenderAvatar
            src={sender.avatar}
            alt={sender.fullName || 'User'}
          />
        )}

        <MessageContentWrapper>
          <MessageBubble
            elevation={0}
            isOwn={shouldBeOwn}
            className="message-revoked"
            sx={{
              backgroundColor: shouldBeOwn 
                ? theme.palette.primary.main
                : theme.palette.background.paper,
              color: shouldBeOwn 
                ? 'white'
                : theme.palette.text.primary,
            }}
          >
            <Box className="message-revoked-content">
              <BlockIcon 
                className="message-revoked-icon"
                sx={{
                  color: shouldBeOwn 
                    ? 'rgba(255, 255, 255, 0.7)' 
                    : 'rgba(0, 0, 0, 0.5)'
                }} 
              />
              <Typography className="message-revoked-text">
                Tin nhắn đã được thu hồi
              </Typography>
            </Box>
          </MessageBubble>

          <MessageInfoContainer isOwn={shouldBeOwn}>
            <TimeText
              variant="caption"
              className="message-revoked-timestamp"
            >
              {formatTime(message.createdAt)}
            </TimeText>
          </MessageInfoContainer>
        </MessageContentWrapper>
      </MessageContainer>
    );
  }

  return (
    <>
      <MessageContainer 
        isOwn={shouldBeOwn}
        onMouseEnter={() => shouldBeOwn && setShowRecallButton(true)}
        onMouseLeave={() => shouldBeOwn && setShowRecallButton(false)}
      >
        {!shouldBeOwn && (
          <SenderAvatar
            src={sender.avatar}
            alt={sender.fullName || 'User'}
          />
        )}

        <MessageContentWrapper>
          <MessageBubble
            elevation={0}
            isOwn={shouldBeOwn}
            className={`message-bubble ${isOptimistic ? 'optimistic' : ''}`}
            sx={{
              position: 'relative'
            }}
          >
            <Typography variant="body1">{message.content}</Typography>
            
            {/* Recall button - only show for own messages */}
            {shouldBeOwn && showRecallButton && (
              <RecallButtonContainer>
                <Tooltip title="Thu hồi tin nhắn" placement="top">
                  <IconButton
                    size="small"
                    onClick={handleRecallMessage}
                    disabled={isRecalling}
                    className="recall-button"
                  >
                    <UndoIcon className="recall-button-icon" />
                  </IconButton>
                </Tooltip>
              </RecallButtonContainer>
            )}
          </MessageBubble>

          <MessageInfoContainer isOwn={shouldBeOwn}>
            <TimeText
              variant="caption"
            >
              {formatTime(message.createdAt)}
            </TimeText>

            {shouldBeOwn && (
              <ReadStatusContainer>
                {isOptimistic ? (
                  <ScheduleIcon sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                ) : message.isRead ? (
                  <DoneAllIcon color="primary" sx={{ fontSize: '0.8rem' }} />
                ) : (
                  <DoneIcon sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                )}
              </ReadStatusContainer>
            )}
          </MessageInfoContainer>
        </MessageContentWrapper>
      </MessageContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelRecall}
        aria-labelledby="recall-dialog-title"
        aria-describedby="recall-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle 
          id="recall-dialog-title"
          className="recall-dialog-title"
        >
          Xác nhận thu hồi tin nhắn
        </DialogTitle>
        <DialogContent className="recall-dialog-content">
          <Typography variant="body2" color="text.secondary">
            Bạn có chắc chắn muốn thu hồi tin nhắn này? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions className="recall-dialog-actions">
          <Button 
            onClick={handleCancelRecall} 
            color="primary"
            disabled={isRecalling}
            className="recall-cancel-button"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmRecall} 
            color="error" 
            variant="contained"
            disabled={isRecalling}
            autoFocus
            className="recall-confirm-button"
          >
            {isRecalling ? 'Đang thu hồi...' : 'Thu hồi'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  isOwn: PropTypes.bool.isRequired
};

export default MessageItem; 