import React from 'react';
import {
  Button,
  DialogTitle,
  DialogContentText,
  CircularProgress
} from '@mui/material';

import { StyledDialog, StyledDialogContent, StyledDialogActions } from './styles';

/**
 * Modal xác nhận khi xóa một bài viết
 * @param {Object} props
 * @param {boolean} props.open - Trạng thái hiển thị của modal
 * @param {Function} props.onClose - Hàm xử lý đóng modal
 * @param {Function} props.onConfirm - Hàm xử lý xác nhận xóa
 * @param {boolean} props.loading - Trạng thái loading khi đang xóa
 * @returns {JSX.Element}
 */
const DeleteConfirmModal = ({ open, onClose, onConfirm, loading = false }) => {
  return (
    <StyledDialog
      open={open}
      onClose={loading ? null : onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Xác nhận xóa bài viết
      </DialogTitle>
      <StyledDialogContent>
        <DialogContentText id="delete-dialog-description">
          Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác và bài viết sẽ bị xóa vĩnh viễn.
        </DialogContentText>
      </StyledDialogContent>
      <StyledDialogActions>
        <Button 
          onClick={onClose} 
          color="primary" 
          disabled={loading}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default DeleteConfirmModal; 