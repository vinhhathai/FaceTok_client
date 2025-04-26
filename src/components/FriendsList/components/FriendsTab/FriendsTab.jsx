import React from 'react';
import PropTypes from 'prop-types';
import { 
  List, 
  Avatar, 
  ListItemAvatar, 
  ListItemText, 
  Divider, 
  Button, 
  Stack, 
  Box, 
  Typography 
} from '@mui/material';
import { Link } from 'react-router-dom';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ChatIcon from '@mui/icons-material/Chat';
import './FriendsTab.css';

/**
 * FriendsTab component displays the list of friends
 */
const FriendsTab = ({ 
  loading, 
  friends, 
  startingChat, 
  handleMessageClick, 
  openRemoveFriendModal 
}) => {
  
  if (!loading && friends.length === 0) {
    return (
      <div className="empty-state">
        <Typography variant="body1">
          You don't have any friends yet.
        </Typography>
      </div>
    );
  }
  
  const handleRemoveFriend = (friend) => {
    console.log('Remove friend button clicked for:', friend);
    
    // Get friend ID - handle different possible formats
    let friendId = null;
    let friendName = 'User';
    
    if (friend && friend._id) {
      friendId = String(friend._id);
    } else if (friend && friend.id) {
      friendId = String(friend.id);
    } else if (typeof friend === 'string') {
      friendId = friend;
    } else {
      console.error("Friend data is invalid", friend);
      return;
    }
    
    // Get friend name from available fields
    if (friend) {
      friendName = friend.username || friend.fullName || friend.name || 'User';
    }
    
    console.log("Opening modal for friend ID:", friendId);
    console.log("Opening modal for friend name:", friendName);
    
    // Call remove function with confirmed ID
    openRemoveFriendModal(friendId, friendName);
  };
  
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
      {friends.map((friend, index) => (
        <React.Fragment key={friend._id}>
          <div className="styled-list-item">
            <div className="friend-info-container">
              <ListItemAvatar>
                <Avatar 
                  alt={friend.username || friend.fullName || 'User'}
                  src={friend.avatar || friend.profilePicture} 
                  component={Link}
                  to={`/profile/${friend._id}`}
                  sx={{ cursor: 'pointer', width: 40, height: 40 }}
                />
              </ListItemAvatar>
              <div className="friend-text-container">
                <Link 
                  to={`/profile/${friend._id}`}
                  className="user-link"
                >
                  {friend.username || friend.fullName || 'User'}
                </Link>
                <Typography 
                  component="p" 
                  variant="body2" 
                  color="text.secondary"
                >
                  {friend.email || 'No email available'}
                </Typography>
              </div>
            </div>
            <div className="action-buttons">
              <Button
                className="message-button"
                variant="outlined"
                size="small"
                startIcon={<ChatIcon />}
                onClick={() => handleMessageClick(friend._id)}
                disabled={startingChat}
              >
                Nhắn tin
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error" 
                startIcon={<PersonRemoveIcon />}
                onClick={() => handleRemoveFriend(friend)}
              >
                Xóa
              </Button>
            </div>
          </div>
          {index < friends.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

FriendsTab.propTypes = {
  loading: PropTypes.bool.isRequired,
  friends: PropTypes.array.isRequired,
  startingChat: PropTypes.bool.isRequired,
  handleMessageClick: PropTypes.func.isRequired,
  openRemoveFriendModal: PropTypes.func.isRequired
};

export default FriendsTab; 