import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  TextField, 
  IconButton, 
  CircularProgress 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';

const ChatInput = ({ onSendMessage, disabled = false, loading = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}
    >
      <IconButton 
        disabled={disabled}
        size="medium"
        color="primary"
      >
        <EmojiEmotionsOutlinedIcon />
      </IconButton>
      
      <IconButton 
        disabled={disabled}
        size="medium"
        color="primary"
      >
        <AttachFileOutlinedIcon />
      </IconButton>
      
      <TextField
        fullWidth
        placeholder="Type a message"
        variant="outlined"
        size="small"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        InputProps={{
          sx: { 
            borderRadius: 4,
            backgroundColor: 'background.paper'
          }
        }}
      />
      
      <IconButton 
        type="submit"
        color="primary"
        disabled={disabled || !message.trim()}
        sx={{ ml: 1 }}
      >
        {loading ? <CircularProgress size={24} /> : <SendIcon />}
      </IconButton>
    </Box>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

export default ChatInput; 