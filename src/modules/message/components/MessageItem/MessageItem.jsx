import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
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
  useTheme,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import ScheduleIcon from "@mui/icons-material/Schedule";
import UndoIcon from "@mui/icons-material/Undo";
import BlockIcon from "@mui/icons-material/Block";
import { useSocket } from "@contexts/SocketContext";
import { apiClient } from "@httpClient";
import { useDispatch } from "react-redux";
import { updateMessageAsRevoked } from "@message/redux/slices/messageSlice";
import { toast } from "react-toastify";
import {
  MessageContainer,
  SenderAvatar,
  MessageContentWrapper,
  MessageBubble,
  MessageInfoContainer,
  TimeText,
  ReadStatusContainer,
  RecallButtonContainer,
} from "./MessageItem.styles";
import "./MessageItem.css";

// Hàm helper để trích xuất senderId từ message
const extractSenderId = (message) => {
  if (!message) return null;

  // Handle different formats of senderId
  if (typeof message.senderId === "string") {
    return message.senderId;
  } else if (
    typeof message.senderId === "object" &&
    message.senderId !== null
  ) {
    return (
      message.senderId._id ||
      message.senderId.id ||
      JSON.stringify(message.senderId)
    );
  } else if (message.sender) {
    if (typeof message.sender === "string") {
      return message.sender;
    }
    return (
      message.sender._id || message.sender.id || JSON.stringify(message.sender)
    );
  }

  return null;
};

const MessageItem = ({ message, isOwn }) => {
  const [showRecallButton, setShowRecallButton] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isRecalling, setIsRecalling] = useState(false);
  const { socket, connected } = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  // Get sender ID for navigation - prefer publicId (UUID) over _id (ObjectId)
  const getSenderId = () => {
    if (message.senderId && typeof message.senderId === 'object') {
      return message.senderId.publicId || message.senderId.id || message.senderId._id;
    }
    if (message.sender && typeof message.sender === 'object') {
      return message.sender.publicId || message.sender.id || message.sender._id;
    }
    return null;
  };

  const handleAvatarClick = () => {
    const senderId = getSenderId();
    if (senderId && !isOwn) {
      navigate(`/profile/${senderId}`);
    }
  };

  // Format the time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get sender information from the message
  const getSender = () => {
    // Ưu tiên senderId (từ API populate) trước sender (từ socket)
    if (message.senderId && typeof message.senderId === 'object') {
      return {
        fullName: message.senderId.fullName || "User",
        avatar: message.senderId.profilePicture || message.senderId.avatar || null
      };
    }
    
    if (message.sender) {
      return {
        fullName: message.sender.fullName || "User",
        avatar: message.sender.profilePicture || message.sender.avatar || null
      };
    }
    return { fullName: "User", avatar: null };
  };

  const sender = getSender();

  // Sử dụng logic chính xác hơn để xác định tin nhắn là của mình
  // Ưu tiên sử dụng flag isFromCurrentUser từ socket/backend nếu có
  let shouldBeOwn = false;
  
  if (typeof message.isFromCurrentUser === 'boolean') {
    // Ưu tiên flag từ backend/socket
    shouldBeOwn = message.isFromCurrentUser;
  } else {
    // Fallback: sử dụng prop isOwn được truyền từ parent
    shouldBeOwn = isOwn === true;
  }

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
    setIsRecalling(true);
    try {
      await apiClient.post("/message/revoke", { messageId: message._id });
      // Đợi server broadcast socket 'message_revoked' rồi mới cập nhật store (để đồng bộ đa thiết bị)
      const timeoutId = setTimeout(() => {
        // Fallback: nếu vì lý do nào đó không nhận được socket, vẫn cập nhật UI
        dispatch(updateMessageAsRevoked({ messageId: message._id }));
        toast.success("Đã thu hồi tin nhắn");
        setShowConfirmDialog(false);
        setIsRecalling(false);
      }, 3500);

      // Ưu tiên bắt socket event để clear timeout và cập nhật tức thì
      if (socket) {
        const onceHandler = (data) => {
          if (data?.messageId === message._id) {
            clearTimeout(timeoutId);
            dispatch(updateMessageAsRevoked({ messageId: message._id }));
            toast.success("Đã thu hồi tin nhắn");
            setShowConfirmDialog(false);
            setIsRecalling(false);
            socket.off("message_revoked", onceHandler);
          }
        };
        socket.on("message_revoked", onceHandler);
      }
    } catch (error) {
      console.error("Error recalling message:", error);
      toast.error(error?.response?.data?.error?.message || "Không thể thu hồi tin nhắn");
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
            alt={sender.fullName || "User"}
            onClick={handleAvatarClick}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
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
              color: shouldBeOwn ? "white" : theme.palette.text.primary,
            }}
          >
            <Box className="message-revoked-content">
              <BlockIcon
                className="message-revoked-icon"
                sx={{
                  color: shouldBeOwn
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(0, 0, 0, 0.5)",
                }}
              />
              <Typography className="message-revoked-text">
                Tin nhắn đã được thu hồi
              </Typography>
            </Box>
          </MessageBubble>

          <MessageInfoContainer isOwn={shouldBeOwn}>
            <TimeText variant="caption" className="message-revoked-timestamp">
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
            alt={sender.fullName || "User"}
            onClick={handleAvatarClick}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
        )}

        <MessageContentWrapper>
          <MessageBubble
            elevation={0}
            isOwn={shouldBeOwn}
            className={`message-bubble ${isOptimistic ? "optimistic" : ""}`}
            sx={{
              position: "relative",
            }}
          >
            {/* Media content */}
            {message.media && message.media.length > 0 && (
              <Box sx={{ mb: message.content ? 1 : 0 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: message.media.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                    gap: 0.5,
                    maxWidth: message.media.length === 1 ? '400px' : '300px',
                  }}
                >
                  {message.media.map((media, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                      }}
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt="Attached media"
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            cursor: 'pointer',
                          }}
                          onClick={() => window.open(media.url, '_blank')}
                        />
                      ) : media.type === 'video' ? (
                        <video
                          src={media.url}
                          controls
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                          }}
                          poster={media.thumbnail}
                        />
                      ) : null}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Text content */}
            {message.content && (
              <Typography variant="body1">{message.content}</Typography>
            )}

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
            <TimeText variant="caption">
              {formatTime(message.createdAt)}
            </TimeText>

            {shouldBeOwn && (
              <ReadStatusContainer>
                {isOptimistic ? (
                  <ScheduleIcon
                    sx={{ fontSize: "0.8rem", color: "text.secondary" }}
                  />
                ) : message.isRead ? (
                  <DoneAllIcon color="primary" sx={{ fontSize: "0.8rem" }} />
                ) : (
                  <DoneIcon
                    sx={{ fontSize: "0.8rem", color: "text.secondary" }}
                  />
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
        <DialogTitle id="recall-dialog-title" className="recall-dialog-title">
          Xác nhận thu hồi tin nhắn
        </DialogTitle>
        <DialogContent className="recall-dialog-content">
          <Typography variant="body2" color="text.secondary">
            Bạn có chắc chắn muốn thu hồi tin nhắn này? Hành động này không thể
            hoàn tác.
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
            {isRecalling ? "Đang thu hồi..." : "Thu hồi"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  isOwn: PropTypes.bool.isRequired,
};

export default MessageItem;
