import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateUserFullname } from '@user/redux/slices/userSlice';
import { showSuccess, showError } from '@utils';

const NameEditModal = ({ open, onClose, currentName, user }) => {
  const dispatch = useDispatch();
  
  // Local states thay vì Redux selectors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // API/server error
  const [validationError, setValidationError] = useState(null); // client validation error
  const [name, setName] = useState(currentName || '');

  // Hàm tạo thông điệp lỗi tiếng Việt từ lỗi server
  const getLocalizedErrorMessage = (err) => {
    if (!err) return 'Không thể cập nhật tên';
    // Khi lỗi là chuỗi, giả định đã là thông báo tiếng Việt do client tạo
    if (typeof err === 'string') return err;

    // Lỗi giới hạn thời gian đổi tên
    if (err.code === 'USER_NAME_UPDATE_TIME_LIMIT') {
      const time = Number(err.timeRemaining);
      if (Number.isFinite(time)) {
        return `Bạn cần đợi thêm ${time} phút để cập nhật tên`;
      }
      return 'Bạn cần đợi thêm một thời gian trước khi cập nhật tên';
    }

    // Các lỗi khác: dùng thông điệp tổng quát tiếng Việt
    return 'Không thể cập nhật tên. Vui lòng thử lại sau.';
  };

  useEffect(() => {
    setName(currentName || '');
    setError(null);
    setValidationError(null);
  }, [currentName, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setValidationError('Tên không được để trống');
      return;
    }

    if (name.trim() === currentName) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);
    setValidationError(null);

    try {
      await dispatch(updateUserFullname(name.trim())).unwrap();
      showSuccess('Cập nhật tên thành công!');
      onClose();
    } catch (error) {
      const localizedMsg = getLocalizedErrorMessage(error);
      console.error('Update name error:', error);
      setError(localizedMsg);
      showError(localizedMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setValidationError(null);
      setName(currentName || '');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Chỉnh sửa tên
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error">
                {error}
              </Alert>
            </Box>
          )}
          <Box sx={{ mb: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Tên hiển thị"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!validationError}
              helperText={validationError}
              disabled={loading}
              placeholder="Nhập tên của bạn"
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !name.trim() || name.trim() === currentName}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NameEditModal;
