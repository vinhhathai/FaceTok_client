import React from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Box, Typography, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageIcon from '@mui/icons-material/Message';
import { deleteFriend } from '../../redux';
import { useNavigate } from 'react-router-dom';
import { FriendListContainer, FriendCard, FriendActionButtons } from './FriendList.styles';

function FriendList({ friends, loading, error }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteFriend = (friendId) => {
    if (window.confirm('Bạn có chắc muốn xóa người bạn này?')) {
      dispatch(deleteFriend(friendId));
    }
  };

  const handleMessageFriend = (friendId) => {
    navigate(`/messages/${friendId}`);
  };
  
  const navigateToProfile = (friendId) => {
    navigate(`/profile/${friendId}`);
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

  if (!friends || friends.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 2 }}>
        <Typography>Bạn chưa có người bạn nào. Hãy tìm bạn mới!</Typography>
      </Box>
    );
  }

  return (
    <FriendListContainer>
      <List>
        {friends.map((friend) => (
          <FriendCard 
            key={friend.id || friend._id} 
            elevation={1}
            sx={{ cursor: 'pointer' }}
            onClick={(e) => {
              // Only navigate if the click was not on one of the action buttons
              if (!e.defaultPrevented) {
                navigateToProfile(friend.id || friend._id);
              }
            }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar 
                  alt={friend.fullName} 
                  src={friend.profilePicture || '/assets/default-avatar.png'}
                />
              </ListItemAvatar>
              <ListItemText
                primary={friend.fullName}
                secondary={friend.email || friend.bio || 'Người dùng FaceTok'}
              />
              <FriendActionButtons>
                <IconButton 
                  edge="end" 
                  aria-label="message" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleMessageFriend(friend.id || friend._id);
                  }}
                  color="primary"
                >
                  <MessageIcon />
                </IconButton>
                <IconButton 
                  edge="end" 
                  aria-label="delete" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteFriend(friend.id || friend._id);
                  }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </FriendActionButtons>
            </ListItem>
          </FriendCard>
        ))}
      </List>
    </FriendListContainer>
  );
}

export default FriendList; 