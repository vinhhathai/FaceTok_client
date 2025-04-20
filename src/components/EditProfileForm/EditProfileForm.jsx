import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { styled } from '@mui/system';

import updateProfileApi from '../../api/updateProfileApi';
import {
  StyledDialogTitle,
  StyledDialogContent,
  StyledDialogActions,
  FormSectionTitle
} from './styles';

// Helper for formatting date to YYYY-MM-DD for input[type="date"]
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0];
};

// Functional component
const EditProfileForm = ({ open, onClose, profile, refreshProfile }) => {
  // Form state
  const [formData, setFormData] = useState({
    bio: '',
    gender: '',
    birthday: '',
    location: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Lấy user ID từ Redux store
  const userId = useSelector(state => state.user.id);

  // Cập nhật form khi profile thay đổi
  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        gender: profile.gender || '',
        // Format date for input type="date"
        birthday: profile.birthday ? formatDateForInput(profile.birthday) : '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Giới thiệu không được vượt quá 500 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Chuẩn bị dữ liệu để gửi đi
      const dataToSubmit = {
        id: userId,
        bio: formData.bio,
        gender: formData.gender,
        birthday: formData.birthday || undefined,
        location: formData.location,
      };
      
      const response = await updateProfileApi(dataToSubmit);
      
      // Hiển thị thông báo thành công
      toast.success('Cập nhật thông tin thành công!');
      
      // Refresh dữ liệu profile
      if (refreshProfile) {
        refreshProfile();
      }
      
      // Đóng dialog
      onClose();
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <StyledDialogTitle>
        <Typography variant="h6">Chỉnh sửa thông tin cá nhân</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      
      <StyledDialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormSectionTitle>Giới thiệu bản thân</FormSectionTitle>
              <TextField
                name="bio"
                fullWidth
                multiline
                rows={4}
                value={formData.bio || ''}
                onChange={handleChange}
                error={!!errors.bio}
                helperText={errors.bio}
                placeholder="Viết đôi điều về bản thân..."
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormSectionTitle>Giới tính</FormSectionTitle>
              <FormControl fullWidth variant="outlined">
                <Select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Chọn giới tính</em>
                  </MenuItem>
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="No gender">Không xác định</MenuItem>
                </Select>
                {errors.gender && <Typography color="error" variant="caption">{errors.gender}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormSectionTitle>Ngày sinh</FormSectionTitle>
              <TextField
                name="birthday"
                type="date"
                fullWidth
                value={formData.birthday}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.birthday}
                helperText={errors.birthday}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormSectionTitle>Nơi sống</FormSectionTitle>
              <TextField
                name="location"
                fullWidth
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="Ví dụ: Hà Nội, Việt Nam"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </form>
      </StyledDialogContent>
      
      <StyledDialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

export default EditProfileForm; 