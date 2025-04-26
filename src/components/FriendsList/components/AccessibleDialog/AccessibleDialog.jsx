import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import './AccessibleDialog.css';

/**
 * Enhanced Dialog component with improved accessibility
 */
const AccessibleDialog = forwardRef((props, ref) => {
  const { 
    open, 
    onClose, 
    title, 
    description, 
    actions, 
    children,
    role = 'dialog',
    ...other 
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={`dialog-title-${title ? title.replace(/\s+/g, '-').toLowerCase() : 'custom'}`}
      aria-describedby={`dialog-description-${description ? description.replace(/\s+/g, '-').toLowerCase() : 'custom'}`}
      ref={ref}
      role={role}
      className="accessible-dialog"
      {...other}
    >
      {title && (
        <DialogTitle id={`dialog-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="dialog-title">
          {title}
        </DialogTitle>
      )}
      <DialogContent>
        {description && (
          <DialogContentText id={`dialog-description-${description.replace(/\s+/g, '-').toLowerCase()}`}>
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
});

AccessibleDialog.displayName = 'AccessibleDialog';

AccessibleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node,
  role: PropTypes.string
};

export default AccessibleDialog; 