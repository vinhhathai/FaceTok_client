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
  CircularProgress
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateUserFullname } from '@user/redux/slices/userSlice';
import { showSuccess, showError } from '@utils';

const NameEditModal = ({ open, onClose, currentName, user }) => {
  const dispatch = useDispatch();
  
  // Local states thay vì Redux selectors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState(currentName || '');

  useEffect(() => {
    setName(currentName || '');
    setError(null);
  }, [currentName, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Tên không được để trống');
      return;
    }

    if (name.trim() === currentName) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await dispatch(updateUserFullname(name.trim())).unwrap();
      showSuccess('Cập nhật tên thành công!');
      onClose();
    } catch (error) {
      console.error('Update name error:', error);
      setError(error.message || 'Không thể cập nhật tên');
      showError(error.message || 'Không thể cập nhật tên');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
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
              error={!!error}
              helperText={error}
              disabled={loading}
              placeholder="Nhập tên của bạn"
            />
          </Box>
          
          {error && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          )}
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
