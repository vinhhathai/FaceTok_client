import React, { useState, useEffect } from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { StyledDialog, DialogHeader, DialogBodyContent } from './styles';

function CreateGroupModal({ show, handleClose }) {
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');

    const handleCreateGroup = () => {
        // Kiểm tra xem ô input có trống không
        if (groupName.trim() === '') {
            setError('Please enter group name');
            return;
        }

        // Thực hiện các hành động cần thiết khi tạo nhóm
        console.log('Tên nhóm mới:', groupName);
        // Đóng modal sau khi tạo nhóm thành công
        handleClose();
    };

    useEffect(() => {
        setGroupName('');
        setError('');
    }, [show]);

    return (
        <StyledDialog
            open={show}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogHeader id="form-dialog-title">
                <span>Create group</span>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    size="small"
                >
                    <CloseIcon />
                </IconButton>
            </DialogHeader>
            
            <DialogBodyContent>
                <DialogContentText>
                    Write the name of group:
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="groupName"
                    label="Group Name"
                    type="text"
                    fullWidth
                    value={groupName}
                    onChange={(e) => {
                        setGroupName(e.target.value);
                        setError('');
                    }}
                    error={!!error}
                    helperText={error}
                    variant="outlined"
                    sx={{ mt: 2 }}
                />
            </DialogBodyContent>
            
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} color="inherit">
                    Close
                </Button>
                <Button onClick={handleCreateGroup} variant="contained" color="primary">
                    Create
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}

export default CreateGroupModal;
