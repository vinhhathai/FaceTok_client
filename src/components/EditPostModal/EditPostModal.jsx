import React, { useState, useEffect } from 'react';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Box
} from '@mui/material';

import { StyledTextField, StyledDialog, ImagePreview } from './styles';

/**
 * Modal để chỉnh sửa bài viết
 * @param {Object} props
 * @param {boolean} props.open - Trạng thái hiển thị của modal
 * @param {Function} props.onClose - Hàm xử lý đóng modal
 * @param {Function} props.onSave - Hàm xử lý lưu bài viết
 * @param {boolean} props.loading - Trạng thái loading khi đang cập nhật
 * @param {Object} props.post - Dữ liệu bài viết cần chỉnh sửa
 * @returns {JSX.Element}
 */
const EditPostModal = ({ open, onClose, onSave, loading = false, post }) => {
  const [content, setContent] = useState('');

  // Cập nhật content khi post thay đổi
  useEffect(() => {
    if (post && open) {
      setContent(post.content || post.caption || '');
    }
  }, [post, open]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = () => {
    onSave(content);
  };

  return (
    <StyledDialog
      open={open}
      onClose={loading ? null : onClose}
      aria-labelledby="edit-dialog-title"
      aria-describedby="edit-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="edit-dialog-title">
        Chỉnh sửa bài viết
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="edit-dialog-description">
          Chỉnh sửa nội dung bài viết của bạn
        </DialogContentText>
        <StyledTextField
          autoFocus
          margin="dense"
          id="postContent"
          label="Nội dung bài viết"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={content}
          onChange={handleContentChange}
          disabled={loading}
        />
        {post && post.image && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <ImagePreview 
              src={post.image} 
              alt="Post" 
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="primary" 
          disabled={loading}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading || !content.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditPostModal; 