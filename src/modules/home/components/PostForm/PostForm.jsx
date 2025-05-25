import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  CircularProgress,
  IconButton,
  styled,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CancelIcon from '@mui/icons-material/Cancel';
import { toastService } from '../../../../shared/services';
import { useError } from '../../../../shared/hooks';

// Styled components
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

const PostInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
  },
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1),
  },
}));

const ImageButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const PostButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
  '& img': {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: theme.shape.borderRadius,
  },
}));

const RemovePreviewButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 5,
  right: 5,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const MobileActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  width: '100%',
}));

const PostForm = () => {
  const dispatch = useDispatch();
  const { withErrorHandler, showSuccess, showError } = useError();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  
  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      showError('Chỉ hỗ trợ tải lên hình ảnh');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('Kích thước tập tin không được vượt quá 5MB');
      return;
    }
    
    setMediaFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };
  
  const resetForm = () => {
    setContent('');
    setMediaFile(null);
    setMediaPreview(null);
    setIsSubmitting(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !mediaFile) {
      showError('Vui lòng nhập nội dung hoặc thêm hình ảnh');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      // Example: await dispatch(createPost({ content, mediaFile }));
      
      // Simulate a delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Đăng bài viết thành công!');
      resetForm();
    } catch (error) {
      showError('Không thể đăng bài viết. Vui lòng thử lại sau.');
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer elevation={1}>
      <form onSubmit={handleSubmit}>
        <PostInput
          fullWidth
          multiline
          rows={isMobile ? 2 : 3}
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={handleContentChange}
          disabled={isSubmitting}
        />
        
        {mediaPreview && (
          <PreviewContainer>
            <img src={mediaPreview} alt="Preview" />
            <RemovePreviewButton onClick={handleRemoveMedia} size="small">
              <CancelIcon fontSize="small" />
            </RemovePreviewButton>
          </PreviewContainer>
        )}
        
        {isMobile ? (
          <MobileActionsContainer>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="media-upload"
              onChange={handleMediaSelect}
              disabled={isSubmitting}
            />
            <label htmlFor="media-upload" style={{ width: '100%' }}>
              <ImageButton
                component="span"
                startIcon={<ImageIcon />}
                disabled={isSubmitting}
                fullWidth
              >
                Thêm ảnh
              </ImageButton>
            </label>
            
            <PostButton
              type="submit"
              variant="contained"
              disabled={(!content.trim() && !mediaFile) || isSubmitting}
              fullWidth
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Đăng'}
            </PostButton>
          </MobileActionsContainer>
        ) : (
          <ActionsContainer>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="media-upload"
              onChange={handleMediaSelect}
              disabled={isSubmitting}
            />
            <label htmlFor="media-upload">
              <ImageButton
                component="span"
                startIcon={<ImageIcon />}
                disabled={isSubmitting}
              >
                Thêm ảnh
              </ImageButton>
            </label>
            
            <PostButton
              type="submit"
              variant="contained"
              disabled={(!content.trim() && !mediaFile) || isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Đăng'}
            </PostButton>
          </ActionsContainer>
        )}
      </form>
    </FormContainer>
  );
};

export default PostForm; 