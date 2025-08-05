import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Box, 
  Typography, 
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import Avatar from '@components/Avatar';
import { FriendListContainer, FriendCard, FriendActionButtons } from '@friend/components/FriendList/FriendList.styles';
import { CancelRequestButton } from './SentRequestsList.styles';

function SentRequestsList({ requests, loading, error, onCancelRequest }) {
  const navigate = useNavigate();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  
  const handleCancelRequest = (requestId, e) => {
    e.preventDefault();
    setSelectedRequestId(requestId);
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmCancel = () => {
    if (selectedRequestId) {
      onCancelRequest(selectedRequestId);
    }
    setConfirmDialogOpen(false);
  };
  
  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
  };
  
  const navigateToProfile = (userId) => {
    navigate(`/profile/`, { state: { userId } });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', color: 'error.main', my: 2 }}>
        <Typography>Đã xảy ra lỗi: {error}</Typography>
      </Box>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 2 }}>
        <Typography>Bạn chưa gửi lời mời kết bạn nào.</Typography>
      </Box>
    );
  }

  return (
    <>
      <FriendListContainer>
        <List>
          {requests.map((request) => {
            const recipient = request.recipient || {};
            const requestId = request.id || request._id;
            const recipientId = recipient.id || recipient._id;
            
            return (
              <FriendCard 
                key={requestId} 
                elevation={1}
                sx={{ cursor: 'pointer' }}
                onClick={(e) => {
                  // Only navigate if the click was not on cancel button
                  if (!e.defaultPrevented) {
                    navigateToProfile(recipientId);
                  }
                }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar 
                      alt={recipient.fullName} 
                      src={recipient.profilePicture}
                      size={40}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={recipient.fullName || 'Người dùng'}
                    secondary={recipient.email || 'Đã gửi lời mời kết bạn'}
                  />
                  <FriendActionButtons>
                    <CancelRequestButton
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={(e) => handleCancelRequest(requestId, e)}
                      startIcon={<CancelIcon fontSize="small" />}
                    >
                      Hủy lời mời
                    </CancelRequestButton>
                  </FriendActionButtons>
                </ListItem>
              </FriendCard>
            );
          })}
        </List>
      </FriendListContainer>

      {/* Modal xác nhận hủy lời mời */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận hủy lời mời
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc muốn hủy lời mời kết bạn này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

SentRequestsList.propTypes = {
  requests: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onCancelRequest: PropTypes.func.isRequired
};

SentRequestsList.defaultProps = {
  requests: [],
  loading: false,
  error: null
};

export default SentRequestsList; 