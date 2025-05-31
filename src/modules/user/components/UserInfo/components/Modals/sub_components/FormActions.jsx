import React from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ButtonContainer, ButtonContainerMobile, CancelButton } from '../ProfileEditModal.styles';

const FormActions = ({ onClose, onSave, isUpdating }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (isMobile) {
    return (
      <ButtonContainerMobile>
        <CancelButton
          variant="outlined" 
          onClick={onClose}
          disabled={isUpdating}
          fullWidth
          isMobile={true}
        >
          Huỷ
        </CancelButton>
        <Button 
          variant="contained" 
          onClick={onSave}
          disabled={isUpdating}
          startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : null}
          fullWidth
        >
          {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </ButtonContainerMobile>
    );
  }
  
  return (
    <ButtonContainer>
      <CancelButton 
        variant="outlined" 
        onClick={onClose}
        disabled={isUpdating}
        isMobile={false}
      >
        Huỷ
      </CancelButton>
      <Button 
        variant="contained" 
        onClick={onSave}
        disabled={isUpdating}
        startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
      </Button>
    </ButtonContainer>
  );
};

FormActions.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
};

export default FormActions; 