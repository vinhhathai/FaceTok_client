import React from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { acceptRequest, rejectRequest } from '../../redux';
import { useNavigate } from 'react-router-dom';
import { RequestContainer, RequestCard, RequestActionButton, RequestActionButtons } from './FriendRequests.styles';

function FriendRequests({ requests, loading, error }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAcceptRequest = (requestId) => {
    dispatch(acceptRequest(requestId));
  };

  const handleRejectRequest = (requestId) => {
    dispatch(rejectRequest(requestId));
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
        <Typography>Không có lời mời kết bạn nào.</Typography>
      </Box>
    );
  }

  return (
    <RequestContainer>
      <List>
        {requests.map((request) => (
          <RequestCard 
            key={request.id} 
            elevation={1}
            sx={{ cursor: 'pointer' }}
            onClick={(e) => {
              // Only navigate if the click was not on one of the action buttons
              if (!e.defaultPrevented) {
                navigateToProfile(request.sender.id);
              }
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar 
                  alt={request.sender.fullName} 
                  src={request.sender.profilePicture || '/assets/default-avatar.png'} 
                />
              </ListItemAvatar>
              <ListItemText
                primary={request.sender.fullName}
                secondary={
                  <span>
                    {`Đã gửi lời mời kết bạn ${new Date(request.createdAt).toLocaleDateString()}`}
                  </span>
                }
              />
              <RequestActionButtons>
                <RequestActionButton
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAcceptRequest(request.id);
                  }}
                >
                  Chấp nhận
                </RequestActionButton>
                <RequestActionButton
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRejectRequest(request.id);
                  }}
                >
                  Từ chối
                </RequestActionButton>
              </RequestActionButtons>
            </ListItem>
          </RequestCard>
        ))}
      </List>
    </RequestContainer>
  );
}

export default FriendRequests; 