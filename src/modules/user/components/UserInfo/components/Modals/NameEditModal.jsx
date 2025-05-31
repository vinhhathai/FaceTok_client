import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../../../../../../shared/utils/toastMessageUtils";

// Redux
import { updateUserProfile, fetchUserProfile } from '../../../../redux/slices/userSlice';

const NameEditModal = ({ isOpen, onClose, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  
  const [newName, setNewName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  
  // Set initial name when modal opens
  useEffect(() => {
    if (isOpen && user?.fullName) {
      setNewName(user.fullName);
    }
  }, [isOpen, user?.fullName]);
  
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  
  const handleUpdateName = async () => {
    if (!newName || newName.trim().length === 0) {
      showError('Tên không được để trống!');
      return;
    }
    
    try {
      setIsUpdatingName(true);
      
      // Dispatch action to update user name
      await dispatch(updateUserProfile({
        fullName: newName.trim()
      })).unwrap();
      
      showSuccess('Cập nhật tên thành công!');
      onClose();
      
      // Refresh user profile after update
      if (user?.id) {
        dispatch(fetchUserProfile(user.id));
      }
    } catch (error) {
      showError('Không thể cập nhật tên. Vui lòng thử lại sau.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="edit-name-modal"
      aria-describedby="modal-to-edit-user-full-name"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 400 },
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
      }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Chỉnh sửa tên hiển thị
        </Typography>
        
        <TextField
          fullWidth
          label="Tên hiển thị"
          value={newName}
          onChange={handleNameChange}
          variant="outlined"
          autoFocus
          sx={{ mb: 3 }}
        />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 1,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={isUpdatingName}
            fullWidth={isMobile}
            sx={{ mb: isMobile ? 1 : 0 }}
          >
            Huỷ
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateName}
            disabled={isUpdatingName || !newName.trim()}
            startIcon={isUpdatingName ? <CircularProgress size={16} color="inherit" /> : null}
            fullWidth={isMobile}
          >
            {isUpdatingName ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

NameEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
  }),
};

export default NameEditModal; 