import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stack,
  Alert,
  IconButton,
  FormHelperText,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Campaign as CampaignIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const AnnouncementModal = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    startsAt: '',
    expiresAt: '',
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        message: initialData.message || '',
        type: initialData.type || 'info',
        targetAudience: initialData.targetAudience || 'all',
        startsAt: initialData.startsAt ? new Date(initialData.startsAt).toISOString().slice(0, 16) : '',
        expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().slice(0, 16) : '',
      });
      // Set existing image if available
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    } else {
      setFormData({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all',
        startsAt: '',
        expiresAt: '',
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [initialData, open]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Vui lòng chọn file ảnh' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Kích thước ảnh không được vượt quá 5MB' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear error
      if (errors.image) {
        setErrors({ ...errors, image: '' });
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (errors.image) {
      setErrors({ ...errors, image: '' });
    }
  };

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
    const now = new Date();
    
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Tiêu đề không được vượt quá 100 ký tự';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Nội dung không được để trống';
    } else if (formData.message.length > 500) {
      newErrors.message = 'Nội dung không được vượt quá 500 ký tự';
    }

    // Validate dates
    if (formData.startsAt) {
      const starts = new Date(formData.startsAt);
      // Check if start time is in the past (only for new announcements, not edits)
      if (!initialData && starts < now) {
        newErrors.startsAt = 'Thời gian bắt đầu không được ở trong quá khứ';
      }
    }

    if (formData.expiresAt) {
      const expires = new Date(formData.expiresAt);
      // Check if expiry time is in the past
      if (!initialData && expires < now) {
        newErrors.expiresAt = 'Thời gian kết thúc không được ở trong quá khứ';
      }
    }

    if (formData.startsAt && formData.expiresAt) {
      const starts = new Date(formData.startsAt);
      const expires = new Date(formData.expiresAt);
      if (starts >= expires) {
        newErrors.expiresAt = 'Thời gian kết thúc phải sau thời gian bắt đầu';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Convert datetime-local to ISO string or null
      const submitData = {
        ...formData,
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        imageFile: imageFile, // Include image file
      };
      onSubmit(submitData);
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      targetAudience: 'all',
      startsAt: '',
      expiresAt: '',
    });
    setErrors({});
    setImageFile(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'info':
        return <InfoIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'success':
        return <CheckCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
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
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <CampaignIcon />
          <Typography variant="h6" fontWeight="bold">
            {initialData ? 'Chỉnh sửa thông báo' : 'Tạo thông báo quan trọng'}
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
          {/* Info Alert */}
          <Alert severity="info" icon={<InfoIcon />}>
            Thông báo sẽ được gửi đến tất cả người dùng đang hoạt động trong hệ thống.
          </Alert>

          {/* Title */}
          <TextField
            label="Tiêu đề thông báo"
            fullWidth
            required
            value={formData.title}
            onChange={handleChange('title')}
            error={!!errors.title}
            helperText={errors.title || `${formData.title.length}/100 ký tự`}
            placeholder="Nhập tiêu đề ngắn gọn, súc tích..."
          />

          {/* Message */}
          <TextField
            label="Nội dung thông báo"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange('message')}
            error={!!errors.message}
            helperText={errors.message || `${formData.message.length}/500 ký tự`}
            placeholder="Nhập nội dung chi tiết của thông báo..."
          />

          {/* Type */}
          <FormControl fullWidth>
            <InputLabel id="type-label">Loại thông báo</InputLabel>
            <Select
              labelId="type-label"
              value={formData.type}
              label="Loại thông báo"
              onChange={handleChange('type')}
            >
              <MenuItem value="info">
                <Stack direction="row" spacing={1} alignItems="center">
                  <InfoIcon color="info" fontSize="small" />
                  <Typography>Thông tin</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="success">
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography>Thành công</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="warning">
                <Stack direction="row" spacing={1} alignItems="center">
                  <WarningIcon color="warning" fontSize="small" />
                  <Typography>Cảnh báo</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="error">
                <Stack direction="row" spacing={1} alignItems="center">
                  <ErrorIcon color="error" fontSize="small" />
                  <Typography>Lỗi/Khẩn cấp</Typography>
                </Stack>
              </MenuItem>
            </Select>
            <FormHelperText>Chọn mức độ quan trọng của thông báo</FormHelperText>
          </FormControl>

          {/* Target Audience */}
          <FormControl fullWidth>
            <InputLabel id="audience-label">Đối tượng nhận</InputLabel>
            <Select
              labelId="audience-label"
              value={formData.targetAudience}
              label="Đối tượng nhận"
              onChange={handleChange('targetAudience')}
            >
              <MenuItem value="all">Tất cả người dùng</MenuItem>
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
            <FormHelperText>Chọn nhóm người dùng sẽ nhận thông báo</FormHelperText>
          </FormControl>

          {/* Image Upload */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ảnh minh họa (tùy chọn)
            </Typography>
            <Stack spacing={2}>
              {imagePreview ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 400,
                    mx: 'auto',
                  }}
                >
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: 300,
                      objectFit: 'contain',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: 'white',
                      },
                    }}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Chọn ảnh
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              )}
              {errors.image && (
                <Typography variant="caption" color="error">
                  {errors.image}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF
              </Typography>
            </Stack>
          </Box>

          {/* Schedule Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Lên lịch hiển thị (tùy chọn)
            </Typography>
            
            {/* Start Date */}
            <TextField
              label="Thời gian bắt đầu"
              type="datetime-local"
              fullWidth
              value={formData.startsAt}
              onChange={handleChange('startsAt')}
              error={!!errors.startsAt}
              helperText={errors.startsAt || "Để trống để hiển thị ngay lập tức"}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: initialData ? undefined : new Date().toISOString().slice(0, 16),
              }}
              sx={{ mb: 2 }}
            />

            {/* Expiry Date */}
            <TextField
              label="Thời gian kết thúc"
              type="datetime-local"
              fullWidth
              value={formData.expiresAt}
              onChange={handleChange('expiresAt')}
              error={!!errors.expiresAt}
              helperText={errors.expiresAt || "Để trống để không tự động ẩn"}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: initialData ? undefined : new Date().toISOString().slice(0, 16),
              }}
            />
          </Box>

          {/* Preview */}
          {formData.title && formData.message && (
            <Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Xem trước:
              </Typography>
              <Alert
                severity={getTypeColor(formData.type)}
                icon={getTypeIcon(formData.type)}
                sx={{ mt: 1 }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {formData.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {formData.message}
                </Typography>
                {(formData.startsAt || formData.expiresAt) && (
                  <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formData.startsAt && `📅 Bắt đầu: ${new Date(formData.startsAt).toLocaleString('vi-VN')}`}
                      {formData.startsAt && formData.expiresAt && ' • '}
                      {formData.expiresAt && `⏰ Kết thúc: ${new Date(formData.expiresAt).toLocaleString('vi-VN')}`}
                    </Typography>
                  </Box>
                )}
              </Alert>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SendIcon />}
          sx={{
            background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #44A08D 0%, #4ECDC4 100%)',
            },
          }}
        >
          {initialData ? 'Cập nhật' : 'Gửi thông báo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementModal;
