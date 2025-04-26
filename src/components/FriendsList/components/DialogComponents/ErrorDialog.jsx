import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import AccessibleDialog from '../AccessibleDialog';
import './ErrorDialog.css';

/**
 * ErrorDialog component for displaying errors
 */
const ErrorDialog = ({ 
  open, 
  onClose, 
  errorMessage 
}) => {
  return (
    <AccessibleDialog
      open={open}
      onClose={onClose}
      title="Lỗi"
      description={errorMessage}
      role="alertdialog"
      actions={
        <Button 
          onClick={onClose} 
          color="primary" 
          autoFocus
          aria-label="Đóng thông báo lỗi"
          className="close-error-button"
        >
          Đóng
        </Button>
      }
      sx={{ '& .MuiDialogTitle-root': { color: 'error.main' } }}
    />
  );
};

ErrorDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired
};

export default ErrorDialog; 