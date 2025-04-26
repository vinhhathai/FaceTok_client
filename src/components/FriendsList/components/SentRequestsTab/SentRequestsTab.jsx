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
  Typography 
} from '@mui/material';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import './SentRequestsTab.css';

/**
 * SentRequestsTab component displays the friend requests sent by the user
 */
const SentRequestsTab = ({ 
  loading, 
  sentRequests, 
  friendRequestLoading,
  handleCancelRequest 
}) => {
  
  if (!loading && sentRequests.length === 0) {
    return (
      <div className="empty-sent-requests">
        <Typography variant="body1">
          You haven't sent any friend requests.
        </Typography>
      </div>
    );
  }
  
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {sentRequests.map((request, index) => (
        <React.Fragment key={request._id}>
          <ListItem 
            alignItems="flex-start"
            className="sent-request-item"
          >
            <ListItemAvatar>
              {request.recipient && (
                <Avatar 
                  alt={request.recipient.username || request.recipient.fullName || 'User'}
                  src={request.recipient.avatar || request.recipient.profilePicture}
                  component={Link}
                  to={`/profile/${request.recipient._id}`}
                  sx={{ cursor: 'pointer' }}
                />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={
                request.recipient && (
                  <Link
                    to={`/profile/${request.recipient._id}`}
                    className="recipient-link"
                  >
                    {request.recipient.username || request.recipient.fullName || 'User'}
                  </Link>
                )
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    className="sent-request-text"
                  >
                    Request sent
                  </Typography>
                  {' — '}
                  {new Date(request.createdAt).toLocaleDateString()}
                </>
              }
            />
            {request.recipient && (
              <div className="request-cancel-action">
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="error" 
                  startIcon={<CloseIcon />}
                  onClick={() => handleCancelRequest(request._id)}
                  disabled={friendRequestLoading}
                  className="cancel-button"
                >
                  Hủy
                </Button>
              </div>
            )}
          </ListItem>
          {index < sentRequests.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

SentRequestsTab.propTypes = {
  loading: PropTypes.bool.isRequired,
  sentRequests: PropTypes.array.isRequired,
  friendRequestLoading: PropTypes.bool.isRequired,
  handleCancelRequest: PropTypes.func.isRequired
};

export default SentRequestsTab; 