import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const EmailModal = ({ open, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Tiêu đề không được để trống';
    } else if (formData.subject.length > 200) {
      newErrors.subject = 'Tiêu đề không được vượt quá 200 ký tự';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Nội dung không được để trống';
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Nội dung không được vượt quá 2000 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData({
      subject: '',
      message: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <EmailIcon />
          <Typography variant="h6" fontWeight="bold">
            Gửi email đến người dùng
          </Typography>
        </Stack>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Stack spacing={3}>
          {/* User Info Alert */}
          {user && (
            <Alert severity="info" icon={<EmailIcon />}>
              <Typography variant="body2">
                <strong>Người nhận:</strong> {user.fullName} ({user.email})
              </Typography>
            </Alert>
          )}

          {/* Subject */}
          <TextField
            label="Tiêu đề email"
            fullWidth
            required
            value={formData.subject}
            onChange={handleChange('subject')}
            error={!!errors.subject}
            helperText={errors.subject || `${formData.subject.length}/200 ký tự`}
            placeholder="Nhập tiêu đề email..."
          />

          {/* Message */}
          <TextField
            label="Nội dung email"
            fullWidth
            required
            multiline
            rows={8}
            value={formData.message}
            onChange={handleChange('message')}
            error={!!errors.message}
            helperText={errors.message || `${formData.message.length}/2000 ký tự`}
            placeholder="Nhập nội dung chi tiết của email..."
          />

          {/* Info Note */}
          <Alert severity="warning">
            Email sẽ được gửi từ địa chỉ chính thức của Chaotok. Vui lòng kiểm tra kỹ nội dung trước khi gửi.
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SendIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3AB0A8 0%, #2E8B82 100%)',
            },
          }}
        >
          Gửi Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailModal;
