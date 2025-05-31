import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, 
  CircularProgress, 
  Grid, 
  CardMedia, 
  CardContent, 
  Button, 
  Avatar 
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useNavigate } from 'react-router-dom';

// Styles
import { 
  LoadingContainer, 
  EmptyContainer, 
  FriendsContainer, 
  StyledGrid,
  FriendCard,
  FriendCardContent,
  FriendCardMedia,
  FriendCardActions
} from './UserFriends.styles';

// Default image
const DEFAULT_AVATAR = '/assets/images/avatar_default.jpg';

const UserFriends = ({ userId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  
  useEffect(() => {
    // Giả lập việc tải dữ liệu
    const timer = setTimeout(() => {
      // Dữ liệu mẫu
      setFriends([
        {
          id: '1',
          name: 'Trần Văn B',
          avatar: DEFAULT_AVATAR,
          mutualFriends: 5,
          isFriend: true
        },
        {
          id: '2',
          name: 'Lê Thị C',
          avatar: DEFAULT_AVATAR,
          mutualFriends: 3,
          isFriend: true
        },
        {
          id: '3',
          name: 'Phạm Văn D',
          avatar: DEFAULT_AVATAR,
          mutualFriends: 2,
          isFriend: true
        },
        {
          id: '4',
          name: 'Hoàng Thị E',
          avatar: DEFAULT_AVATAR,
          mutualFriends: 1,
          isFriend: false
        },
      ]);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [userId]);

  const handleViewProfile = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

  const handleMessage = (friendId) => {
    navigate(`/messages/${friendId}`);
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }
  
  if (friends.length === 0) {
    return (
      <EmptyContainer>
        <Typography variant="body1" color="text.secondary">
          Người dùng chưa có bạn bè nào.
        </Typography>
      </EmptyContainer>
    );
  }
  
  return (
    <FriendsContainer>
      <StyledGrid container spacing={3}>
        {friends.map((friend) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={friend.id}>
            <FriendCard>
              <FriendCardMedia>
                <CardMedia
                  component="img"
                  image={friend.avatar}
                  alt={friend.name}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </FriendCardMedia>
              <FriendCardContent>
                <CardContent sx={{ p: 0, pb: 0, "&:last-child": { pb: 0 } }}>
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleViewProfile(friend.id)}
                  >
                    {friend.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {friend.mutualFriends} bạn chung
                  </Typography>
                </CardContent>
              </FriendCardContent>
              <FriendCardActions>
                <Button
                  startIcon={friend.isFriend ? <PersonRemoveIcon /> : <PersonAddIcon />}
                  variant={friend.isFriend ? "outlined" : "contained"}
                  size="small"
                  color={friend.isFriend ? "error" : "primary"}
                >
                  {friend.isFriend ? 'Hủy kết bạn' : 'Kết bạn'}
                </Button>
                <Button
                  startIcon={<MessageIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => handleMessage(friend.id)}
                >
                  Nhắn tin
                </Button>
              </FriendCardActions>
            </FriendCard>
          </Grid>
        ))}
      </StyledGrid>
    </FriendsContainer>
  );
};

UserFriends.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserFriends; 