import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  TextField, 
  IconButton, 
  CircularProgress,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { ChatInputForm } from './ChatInput.styles';

const ChatInput = ({ onSendMessage, disabled = false, loading = false }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Focus back on input after sending
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 0);
      }
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSubmit(e);
    }
  };

  return (
    <ChatInputForm component="form" onSubmit={handleSubmit}>
      <Tooltip title="Tính năng đang phát triển">
        <span>
          <IconButton 
            disabled={true}
            size="medium"
            color="primary"
          >
            <EmojiEmotionsOutlinedIcon />
          </IconButton>
        </span>
      </Tooltip>
      
      <Tooltip title="Tính năng đang phát triển">
        <span>
          <IconButton 
            disabled={true}
            size="medium"
            color="primary"
          >
            <AttachFileOutlinedIcon />
          </IconButton>
        </span>
      </Tooltip>
      
      <TextField
        fullWidth
        placeholder={disabled ? "Đang kết nối..." : "Nhập tin nhắn..."}
        variant="outlined"
        size="small"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        inputRef={inputRef}
        InputProps={{
          sx: { 
            borderRadius: 4,
            backgroundColor: 'background.paper'
          }
        }}
      />
      
      <Tooltip title={disabled ? "Đang kết nối..." : "Gửi tin nhắn"}>
        <span>
          <IconButton 
            type="submit"
            color="primary"
            disabled={disabled || !message.trim()}
            sx={{ ml: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </span>
      </Tooltip>
    </ChatInputForm>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

export default ChatInput; 