import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Grid,
} from '@mui/material';

const EditProfileModal = ({
  open,
  onClose,
  isMobile,
  profileForm,
  isUpdatingProfile,
  onFormChange,
  onDateChange,
  onSave,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-profile-modal"
      aria-describedby="modal-to-edit-user-profile"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: 600 },
        maxHeight: { xs: '80vh', sm: '90vh' },
        overflow: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
      }}>
        <Typography variant="h6" component="h2" sx={{ mb: { xs: 2, sm: 3 } }}>
          Chỉnh sửa thông tin
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Giới thiệu về bản thân"
              value={profileForm.bio}
              onChange={e => onFormChange('bio', e.target.value)}
              variant="outlined"
              multiline
              rows={isMobile ? 3 : 4}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Đang sống tại"
              value={profileForm.location}
              onChange={e => onFormChange('location', e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Giới tính</InputLabel>
              <Select
                value={profileForm.gender}
                label="Giới tính"
                onChange={e => onFormChange('gender', e.target.value)}
              >
                <MenuItem value="">Không xác định</MenuItem>
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sinh nhật"
              type="date"
              value={profileForm.birthday || ''}
              onChange={onDateChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tình trạng mối quan hệ</InputLabel>
              <Select
                value={profileForm.relationship}
                label="Tình trạng mối quan hệ"
                onChange={e => onFormChange('relationship', e.target.value)}
              >
                <MenuItem value="">Không xác định</MenuItem>
                <MenuItem value="single">Độc thân</MenuItem>
                <MenuItem value="relationship">Đang trong mối quan hệ</MenuItem>
                <MenuItem value="married">Đã kết hôn</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 1, 
          mt: 3,
          flexDirection: isMobile ? 'column' : 'row' 
        }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={isUpdatingProfile}
            fullWidth={isMobile}
            sx={{ mb: isMobile ? 1 : 0 }}
          >
            Huỷ
          </Button>
          <Button 
            variant="contained" 
            onClick={onSave}
            disabled={isUpdatingProfile}
            startIcon={isUpdatingProfile ? <CircularProgress size={16} color="inherit" /> : null}
            fullWidth={isMobile}
          >
            {isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

EditProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  profileForm: PropTypes.shape({
    bio: PropTypes.string,
    location: PropTypes.string,
    gender: PropTypes.string,
    birthday: PropTypes.string,
    relationship: PropTypes.string,
  }).isRequired,
  isUpdatingProfile: PropTypes.bool.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditProfileModal; 