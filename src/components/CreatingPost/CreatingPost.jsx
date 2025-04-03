import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import mediaIcon from "../../assets/images/icons/theme/post-image.png";
import { createNewPost, resetCreatePostStatus } from '../../redux/features/postSlice';

import {
  CreatePostWrapper,
  CreatePostInput,
  CreatePostActions,
  MediaButton,
  PublishButton,
  PreviewContainer,
  RemovePreviewButton
} from './styles';

function CreatePost() {
  const dispatch = useDispatch();
  const { createPostStatus, createPostError } = useSelector(state => state.posts);
  const currentUser = useSelector(state => state.user);
  
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState(null);
  
  const isLoading = createPostStatus === 'loading';
  const isDisabled = !content.trim() && !mediaFiles.length || isLoading;
  
  // Reset trạng thái sau khi đăng bài thành công hoặc thất bại
  useEffect(() => {
    if (createPostStatus === 'succeeded') {
      // Reset form sau khi đăng bài thành công
      setContent('');
      handleRemoveMedia();
      
      // Reset trạng thái createPostStatus sau 1 giây
      const timer = setTimeout(() => {
        dispatch(resetCreatePostStatus());
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (createPostStatus === 'failed' && createPostError) {
      toast.error(createPostError || 'Đăng bài thất bại, vui lòng thử lại sau.');
      
      // Reset trạng thái lỗi
      dispatch(resetCreatePostStatus());
    }
  }, [createPostStatus, createPostError, dispatch]);
  
  // Xử lý thay đổi nội dung bài viết
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  
  // Xử lý chọn file media (ảnh)
  const handleMediaSelect = (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    // Kiểm tra file có phải là ảnh không
    const file = files[0];
    if (!file.type.match('image.*')) {
      toast.error('Chỉ hỗ trợ file ảnh');
      return;
    }
    
    // Kiểm tra kích thước file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }
    
    setMediaFiles([file]);
    
    // Tạo preview URL
    const previewURL = URL.createObjectURL(file);
    setMediaPreview(previewURL);
  };
  
  // Xóa file đã chọn
  const handleRemoveMedia = () => {
    setMediaFiles([]);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
  };
  
  // Đăng bài viết
  const handlePublish = async () => {
    if (isDisabled) return;
    
    try {
      await dispatch(createNewPost({ content, mediaFiles })).unwrap();
      toast.success('Đăng bài thành công!');
    } catch (error) {
      console.error('Error creating post:', error);
      // Thông báo lỗi sẽ được xử lý trong useEffect
    }
  };
  
  // Lấy placeholder dựa trên user name
  const getPlaceholder = () => {
    // Ưu tiên sử dụng redux state, fallback về localStorage nếu cần
    const name = currentUser?.fullName || localStorage.getItem('userFullName');
    if (name) {
      return `${name} ơi, bạn đang nghĩ gì?`;
    }
    return "Hãy chia sẻ điều gì đó...";
  };
  
  return (
    <CreatePostWrapper elevation={3}>
      <CreatePostInput
        fullWidth
        multiline
        rows={2}
        placeholder={getPlaceholder()}
        variant="outlined"
        value={content}
        onChange={handleContentChange}
        disabled={isLoading}
      />
      
      {mediaPreview && (
        <PreviewContainer>
          <img src={mediaPreview} alt="Preview" />
          <RemovePreviewButton onClick={handleRemoveMedia}>
            <CancelIcon />
          </RemovePreviewButton>
        </PreviewContainer>
      )}
      
      <CreatePostActions>
        <input
          type="file"
          accept="image/*" // Chỉ chấp nhận ảnh
          style={{ display: 'none' }}
          id="media-upload"
          onChange={handleMediaSelect}
          disabled={isLoading}
        />
        <label htmlFor="media-upload">
          <MediaButton component="span" disabled={isLoading}>
            <img src={mediaIcon} alt="Media" />
            Thêm ảnh
          </MediaButton>
        </label>
        
        <PublishButton 
          variant="contained" 
          size="small"
          onClick={handlePublish}
          disabled={isDisabled}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : 'Đăng'}
        </PublishButton>
      </CreatePostActions>
    </CreatePostWrapper>
  );
}

export default CreatePost; 