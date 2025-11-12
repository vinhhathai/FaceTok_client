import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  TextField, 
  IconButton, 
  CircularProgress,
  Tooltip,
  Box,
  Chip,
  Stack,
  ClickAwayListener
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import CloseIcon from '@mui/icons-material/Close';
import { ChatInputForm } from './ChatInput.styles';
import EmojiPicker from '../EmojiPicker';

const ChatInput = ({ onSendMessage, disabled = false, loading = false }) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    // Limit to 5 files
    const filesToAdd = validFiles.slice(0, 5 - selectedFiles.length);
    
    // Validate file size (50MB each)
    const validatedFiles = filesToAdd.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn (max 50MB)`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validatedFiles].slice(0, 5));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji) => {
    // Insert emoji at cursor position or at the end
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newMessage = message.substring(0, start) + emoji + message.substring(end);
      setMessage(newMessage);
      
      // Set cursor position after emoji
      setTimeout(() => {
        input.focus();
        const newPosition = start + emoji.length;
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    } else {
      setMessage(message + emoji);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if ((message.trim() || selectedFiles.length > 0) && !disabled) {
      onSendMessage(message, selectedFiles);
      setMessage('');
      setSelectedFiles([]);
      setShowEmojiPicker(false);
      
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
    <Box sx={{ width: '100%' }}>
      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <Box sx={{ 
          p: 1, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedFiles.map((file, index) => (
              <Chip
                key={index}
                icon={file.type.startsWith('image/') ? <ImageIcon /> : <VideoFileIcon />}
                label={file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                onDelete={() => handleRemoveFile(index)}
                deleteIcon={<CloseIcon />}
                size="small"
                sx={{ mb: 0.5 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <ChatInputForm component="form" onSubmit={handleSubmit}>
        <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
          <Box sx={{ position: 'relative' }}>
            <Tooltip title="Chọn emoji/sticker">
              <span>
                <IconButton 
                  disabled={disabled}
                  size="medium"
                  color={showEmojiPicker ? "primary" : "default"}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <EmojiEmotionsOutlinedIcon />
                </IconButton>
              </span>
            </Tooltip>
            
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </Box>
        </ClickAwayListener>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,video/*"
          multiple
          style={{ display: 'none' }}
        />
        
        <Tooltip title="Đính kèm ảnh/video">
          <span>
            <IconButton 
              disabled={disabled || selectedFiles.length >= 5}
              size="medium"
              color="primary"
              onClick={() => fileInputRef.current?.click()}
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
              disabled={disabled || (!message.trim() && selectedFiles.length === 0)}
              sx={{ ml: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </ChatInputForm>
    </Box>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

export default ChatInput; 