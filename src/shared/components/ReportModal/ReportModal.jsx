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
  BugReport as BugReportIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const ReportModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  defaultType = null,
  relatedPostId = null,
  relatedUserId = null 
}) => {
  const [formData, setFormData] = useState({
    reportType: defaultType || 'other',
    title: '',
    description: '',
    relatedPostId: relatedPostId || '',
    relatedUserId: relatedUserId || '',
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        reportType: defaultType || 'other',
        title: '',
        description: '',
        relatedPostId: relatedPostId || '',
        relatedUserId: relatedUserId || '',
      });
      setImageFile(null);
      setImagePreview(null);
      setErrors({});
    }
  }, [open, defaultType, relatedPostId, relatedUserId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Vui lòng chọn file ảnh' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Kích thước ảnh không được vượt quá 5MB' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
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
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Mô tả không được vượt quá 1000 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        imageFile,
      });
      handleClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Có lỗi xảy ra khi gửi báo cáo' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
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
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlagIcon color="primary" />
          <Typography variant="h6" component="span">
            Gửi Báo Cáo
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={3}>
          {errors.submit && (
            <Alert severity="error" onClose={() => setErrors({ ...errors, submit: '' })}>
              {errors.submit}
            </Alert>
          )}

          <FormControl fullWidth error={Boolean(errors.reportType)}>
            <InputLabel>Loại Báo Cáo</InputLabel>
            <Select
              value={formData.reportType}
              onChange={handleChange('reportType')}
              label="Loại Báo Cáo"
              disabled={defaultType !== null || isSubmitting}
            >
              <MenuItem value="bug">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BugReportIcon fontSize="small" color="error" />
                  <span>Lỗi Hệ Thống</span>
                </Box>
              </MenuItem>
              <MenuItem value="post">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagIcon fontSize="small" color="warning" />
                  <span>Báo Cáo Bài Viết</span>
                </Box>
              </MenuItem>
              <MenuItem value="user">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" color="info" />
                  <span>Báo Cáo Người Dùng</span>
                </Box>
              </MenuItem>
              <MenuItem value="other">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HelpIcon fontSize="small" />
                  <span>Khác</span>
                </Box>
              </MenuItem>
            </Select>
            {errors.reportType && (
              <FormHelperText>{errors.reportType}</FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Tiêu Đề"
            value={formData.title}
            onChange={handleChange('title')}
            error={Boolean(errors.title)}
            helperText={errors.title || `${formData.title.length}/200 ký tự`}
            disabled={isSubmitting}
            inputProps={{ maxLength: 200 }}
          />

          <TextField
            fullWidth
            label="Mô Tả Chi Tiết"
            value={formData.description}
            onChange={handleChange('description')}
            error={Boolean(errors.description)}
            helperText={errors.description || `${formData.description.length}/1000 ký tự`}
            disabled={isSubmitting}
            multiline
            rows={6}
            inputProps={{ maxLength: 1000 }}
          />

          {/* Image Upload */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Ảnh Minh Chứng (Tùy Chọn)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCameraIcon />}
              disabled={isSubmitting || imagePreview}
              fullWidth
            >
              Chọn Ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {errors.image && (
              <FormHelperText error>{errors.image}</FormHelperText>
            )}
            {imagePreview && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'contain',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                  }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'error.main',
                      color: 'white',
                    },
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <Alert severity="info" icon={<HelpIcon />}>
            Báo cáo của bạn sẽ được quản trị viên xem xét và phản hồi sớm nhất có thể. 
            Vui lòng cung cấp thông tin chi tiết để chúng tôi có thể xử lý tốt hơn.
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 2,
        }}
      >
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
          color="inherit"
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SendIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang Gửi...' : 'Gửi Báo Cáo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportModal;
