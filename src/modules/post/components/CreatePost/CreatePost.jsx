import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import postAPI from '../../api/postAPI';
import { toast } from 'react-toastify';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  TextField,
  IconButton,
  Button,
  Typography,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import {
  PhotoCamera,
  Videocam,
  EmojiEmotions,
  Public,
  Close,
  Add,
  Remove
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const CreatePostContainer = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[3],
    transition: 'box-shadow 0.3s ease-in-out'
  }
}));

const MediaPreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2)
}));

const MediaPreviewItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 80,
  height: 80,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  border: `2px solid ${theme.palette.divider}`,
  '&:hover': {
    borderColor: theme.palette.primary.main
  }
}));

const RemoveMediaButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  width: 24,
  height: 24,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }
}));

const EmojiGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  gap: theme.spacing(1),
  maxHeight: 200,
  overflowY: 'auto',
  padding: theme.spacing(1)
}));

const EmojiButton = styled(IconButton)(({ theme }) => ({
  fontSize: '1.5rem',
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const CreatePost = () => {
  const [postText, setPostText] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [privacy, setPrivacy] = useState('public');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const mediaInputRef = useRef(null);

  // Get current user from Redux store
  const currentUser = useSelector((state) => state.auth.user) || {
    fullName: 'Loading...',
    profilePicture: '/assets/images/avatar_default.jpg'
  };

  // Emoji list
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
    '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥'
  ];

  const privacyOptions = [
    { value: 'public', label: 'Công khai', icon: '🌍', description: 'Mọi người có thể xem' },
    { value: 'friends', label: 'Bạn bè', icon: '👥', description: 'Chỉ bạn bè có thể xem' },
    { value: 'private', label: 'Riêng tư', icon: '🔒', description: 'Chỉ bạn có thể xem' }
  ];

  const handleTextChange = (event) => {
    setPostText(event.target.value);
  };

  const handleAddEmoji = (emoji) => {
    setPostText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newMediaFiles = files.map(file => {
      // Tự động xác định loại file
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      return {
        id: Date.now() + Math.random(),
        file,
        type,
        url: URL.createObjectURL(file),
        name: file.name
      };
    });

    // Kiểm tra giới hạn media (tối đa 4 ảnh + 1 video)
    const currentImages = mediaFiles.filter(m => m.type === 'image').length;
    const currentVideos = mediaFiles.filter(m => m.type === 'video').length;
    const newImages = newMediaFiles.filter(m => m.type === 'image').length;
    const newVideos = newMediaFiles.filter(m => m.type === 'video').length;

    if (currentImages + newImages > 4) {
      toast.error('Chỉ có thể upload tối đa 4 ảnh');
      return;
    }

    if (currentVideos + newVideos > 1) {
      toast.error('Chỉ có thể upload tối đa 1 video');
      return;
    }

    setMediaFiles(prev => [...prev, ...newMediaFiles]);
  };

  const handleRemoveMedia = (id) => {
    setMediaFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!postText.trim() && mediaFiles.length === 0) {
      toast.warning('Vui lòng nhập nội dung hoặc chọn media');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const postData = {
        content: postText.trim(),
        privacy,
        mediaFiles
      };

      const result = await postAPI.createPost(postData, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        // Reset form
        setPostText('');
        setMediaFiles([]);
        setPrivacy('public');
        setUploadProgress(0);
        
        // Cleanup URLs
        mediaFiles.forEach(media => {
          URL.revokeObjectURL(media.url);
        });

        toast.success('Đã tạo bài viết thành công!', {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        });
        
        // TODO: Refresh timeline or add to post list
        console.log('New post created:', result.data);
      } else {
        throw new Error(result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      if (error.code === 'NETWORK_ERROR') {
        toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối.');
      } else if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Dữ liệu không hợp lệ');
      } else {
        toast.error(error.message || 'Không thể tạo bài viết. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const canSubmit = postText.trim().length > 0 || mediaFiles.length > 0;

  return (
    <CreatePostContainer>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={currentUser.profilePicture} 
            alt={currentUser.fullName}
            sx={{ width: 48, height: 48, mr: 2 }}
          >
            {currentUser.fullName.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentUser.fullName}
            </Typography>
                         <Button
               startIcon={
                 <Typography variant="body2" sx={{ fontSize: '1rem', filter: 'contrast(1.2)' }}>
                   {privacyOptions.find(p => p.value === privacy)?.icon}
                 </Typography>
               }
               endIcon={<KeyboardArrowDown sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />}
               onClick={() => setShowPrivacyDialog(true)}
               size="small"
               sx={{ 
                 textTransform: 'none', 
                 color: 'text.secondary',
                 p: 0.5,
                 px: 1,
                 minWidth: 'auto',
                 fontSize: '0.75rem',
                 height: '28px',
                 border: '1px solid',
                 borderColor: 'divider',
                 borderRadius: 1.5,
                 '&:hover': {
                   backgroundColor: 'action.hover',
                   borderColor: 'primary.main'
                 }
               }}
             >
               {privacyOptions.find(p => p.value === privacy)?.label}
             </Button>
          </Box>
        </Box>

        {/* Text Input */}
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Chia sẻ cảm nghĩ của bạn..."
          value={postText}
          onChange={handleTextChange}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '1rem',
              '&:hover fieldset': {
                borderColor: 'primary.main'
              }
            }
          }}
        />

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <MediaPreviewContainer>
            {mediaFiles.map((media) => (
              <MediaPreviewItem key={media.id}>
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={media.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <video
                    src={media.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                <RemoveMediaButton
                  size="small"
                  onClick={() => handleRemoveMedia(media.id)}
                >
                  <Close sx={{ fontSize: 16 }} />
                </RemoveMediaButton>
              </MediaPreviewItem>
            ))}
          </MediaPreviewContainer>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Media Upload (Ảnh + Video) */}
            <input
              ref={mediaInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <Button
              variant="outlined"
              startIcon={<PhotoCamera />}
              onClick={() => mediaInputRef.current?.click()}
              disabled={
                mediaFiles.filter(m => m.type === 'image').length >= 4 ||
                mediaFiles.filter(m => m.type === 'video').length >= 1
              }
              sx={{ textTransform: 'none' }}
            >
              Ảnh & Video
            </Button>

            {/* Emoji Picker */}
            <Button
              variant="outlined"
              startIcon={<EmojiEmotions />}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              sx={{ textTransform: 'none' }}
            >
              Emoji
            </Button>

            
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ 
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
          </Button>
        </Box>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Chọn emoji</Typography>
              <IconButton size="small" onClick={() => setShowEmojiPicker(false)}>
                <Close />
              </IconButton>
            </Box>
            <EmojiGrid>
              {emojis.map((emoji, index) => (
                <EmojiButton
                  key={index}
                  onClick={() => handleAddEmoji(emoji)}
                  size="small"
                >
                  {emoji}
                </EmojiButton>
              ))}
            </EmojiGrid>
          </Box>
        )}

        {/* Media Count Info */}
        {mediaFiles.length > 0 && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Đã chọn {mediaFiles.filter(m => m.type === 'image').length}/4 ảnh và {mediaFiles.filter(m => m.type === 'video').length}/1 video
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Privacy Dialog */}
      <Dialog open={showPrivacyDialog} onClose={() => setShowPrivacyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chọn quyền riêng tư</DialogTitle>
        <DialogContent>
          <List>
            {privacyOptions.map((option) => (
              <ListItem
                key={option.value}
                button
                onClick={() => {
                  setPrivacy(option.value);
                  setShowPrivacyDialog(false);
                }}
                selected={privacy === option.value}
              >
                <ListItemIcon>
                  <Typography variant="h6">{option.icon}</Typography>
                </ListItemIcon>
                <ListItemText
                  primary={option.label}
                  secondary={option.description}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrivacyDialog(false)}>Hủy</Button>
        </DialogActions>
      </Dialog>
    </CreatePostContainer>
  );
};

export default CreatePost;
