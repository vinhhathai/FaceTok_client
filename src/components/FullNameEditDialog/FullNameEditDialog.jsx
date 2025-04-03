import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { styled } from '@mui/system';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import updateFullNameApi from '../../api/updateFullNameApi';

// Styled components
const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#f5f5f5',
});

const StyledDialogContent = styled(DialogContent)({
  padding: '24px',
});

const StyledDialogActions = styled(DialogActions)({
  padding: '16px 24px',
  borderTop: '1px solid #e0e0e0',
});

const TimerBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  marginTop: '12px',
  backgroundColor: '#fff9c4',
  borderRadius: '4px',
});

// Functional component
const FullNameEditDialog = ({ open, onClose, currentName, refreshProfile }) => {
  const [fullName, setFullName] = useState(currentName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const handleChange = (e) => {
    setFullName(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setError('Tên không được để trống');
      return;
    }
    
    try {
      setLoading(true);
      
      await updateFullNameApi(fullName);
      
      toast.success('Đã cập nhật tên thành công!');
      
      if (refreshProfile) {
        refreshProfile();
      }
      
      onClose();
    } catch (error) {
      console.error('Fullname update error:', error);
      
      // Kiểm tra xem có thông tin về thời gian chờ không
      if (error.timeRemaining) {
        setTimeRemaining(error.timeRemaining);
        toast.error(error.message);
      } else {
        setError(error.message || 'Không thể cập nhật tên');
        toast.error(error.message || 'Không thể cập nhật tên');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format thời gian còn lại thành phút:giây
  const formatTimeRemaining = (minutes) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <StyledDialogTitle>
        <Typography variant="h6">Đổi tên</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      
      <StyledDialogContent>
        <Typography variant="body2" gutterBottom>
          Bạn chỉ có thể thay đổi tên mỗi 60 phút một lần.
        </Typography>
        
        <TextField
          label="Tên mới"
          fullWidth
          margin="normal"
          value={fullName}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          disabled={loading || timeRemaining > 0}
        />
        
        {timeRemaining > 0 && (
          <TimerBox>
            <AccessTimeIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="body2" color="warning.main">
              Bạn cần đợi thêm <strong>{formatTimeRemaining(timeRemaining)}</strong> phút nữa để đổi tên
            </Typography>
          </TimerBox>
        )}
      </StyledDialogContent>
      
      <StyledDialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit}
          color="primary" 
          variant="contained"
          disabled={loading || timeRemaining > 0 || !fullName.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

export default FullNameEditDialog; 