import React from 'react';
import PropTypes from 'prop-types';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Divider, 
  Button, 
  Stack, 
  Typography 
} from '@mui/material';
import { Link } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './FriendRequestsTab.css';

/**
 * FriendRequestsTab component displays the friend requests received
 */
const FriendRequestsTab = ({ 
  loading, 
  receivedRequests, 
  friendRequestLoading,
  handleAcceptRequest, 
  handleRejectRequest 
}) => {
  
  if (!loading && receivedRequests.length === 0) {
    return (
      <div className="empty-requests">
        <Typography variant="body1">
          You don't have any friend requests.
        </Typography>
      </div>
    );
  }
  
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {receivedRequests.map((request, index) => (
        <React.Fragment key={request._id}>
          <ListItem 
            alignItems="flex-start"
            className="request-item"
          >
            <ListItemAvatar>
              {request.sender && (
                <Avatar 
                  alt={request.sender.username || request.sender.fullName || 'User'}
                  src={request.sender.avatar || request.sender.profilePicture}
                  component={Link}
                  to={`/profile/${request.sender._id}`}
                  sx={{ cursor: 'pointer' }}
                />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={
                request.sender && (
                  <Link
                    to={`/profile/${request.sender._id}`}
                    className="sender-link"
                  >
                    {request.sender.username || request.sender.fullName || 'User'}
                  </Link>
                )
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    className="request-text"
                  >
                    Sent you a friend request
                  </Typography>
                  {' — '}
                  {new Date(request.createdAt).toLocaleDateString()}
                </>
              }
            />
            {request.sender && (
              <div className="request-actions">
                <Stack direction="row" spacing={1}>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="success" 
                    startIcon={<CheckIcon />}
                    onClick={() => handleAcceptRequest(request._id)}
                    disabled={friendRequestLoading}
                    className="accept-button"
                  >
                    Đồng ý
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error" 
                    startIcon={<CloseIcon />}
                    onClick={() => handleRejectRequest(request._id)}
                    disabled={friendRequestLoading}
                    className="reject-button"
                  >
                    Từ chối
                  </Button>
                </Stack>
              </div>
            )}
          </ListItem>
          {index < receivedRequests.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

FriendRequestsTab.propTypes = {
  loading: PropTypes.bool.isRequired,
  receivedRequests: PropTypes.array.isRequired,
  friendRequestLoading: PropTypes.bool.isRequired,
  handleAcceptRequest: PropTypes.func.isRequired,
  handleRejectRequest: PropTypes.func.isRequired
};

export default FriendRequestsTab; 