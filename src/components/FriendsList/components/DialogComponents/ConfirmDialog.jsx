import React from 'react';
import PropTypes from 'prop-types';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions,
  Button 
} from '@mui/material';
import './ConfirmDialog.css';

/**
 * ConfirmDialog component for confirming friend removal
 */
const ConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  friendName 
}) => {
  const handleConfirm = () => {
    console.log("Confirm button clicked, executing onConfirm handler");
    if (typeof onConfirm === 'function') {
      onConfirm();
    } else {
      console.error("onConfirm is not a function:", onConfirm);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      className="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog-title">
        Xác nhận xóa bạn bè
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {friendName 
            ? `Bạn có chắc chắn muốn xóa ${friendName} khỏi danh sách bạn bè không?` 
            : "Bạn có chắc chắn muốn xóa bạn bè này không?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="primary"
          aria-label="Hủy xóa bạn bè"
          className="cancel-remove-button"
        >
          Hủy
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="error" 
          variant="contained"
          autoFocus
          aria-label="Xác nhận xóa bạn bè"
          className="confirm-remove-button"
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  friendName: PropTypes.string
};

export default ConfirmDialog; 