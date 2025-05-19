import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Box
} from '@mui/material';

function CreateGroupModal() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // For the initial implementation, we'll just have a basic placeholder modal
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Tạo nhóm mới</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tên nhóm"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="description"
            label="Mô tả nhóm"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleClose} color="primary" variant="contained">
          Tạo nhóm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateGroupModal; 