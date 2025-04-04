import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  List, 
  Avatar, 
  Divider, 
  CircularProgress,
  Button,
  Grid,
  Paper,
  IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { fetchUserFriends } from '../../redux/features/friendSlice';
import socketService from '../../services/socketService';
import { fetchConversations } from '../../redux/features/messageSlice';
import FriendButton from '../FriendButton/FriendButton';

const ProfileFriendsList = ({ userId, isOwnProfile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [startingChat, setStartingChat] = useState(false);
  
  // Get user friends from Redux store
  const { userFriends, loading, error } = useSelector(state => state.friends);
  const friends = userFriends[userId] || [];
  
  // Fetch user's friends when component mounts
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserFriends(userId));
    }
  }, [dispatch, userId]);

  const handleMessageClick = async (friendId) => {
    try {
      setStartingChat(true);
      
      // Khởi tạo socket nếu chưa có
      socketService.initSocket();
      
      // Gửi một tin nhắn trống để tạo cuộc trò chuyện (không hiển thị)
      const messageSuccess = socketService.sendMessage(friendId, '👋');
      
      if (messageSuccess) {
        // Đợi một chút để cuộc trò chuyện được tạo trên server
        setTimeout(() => {
          // Cập nhật danh sách cuộc trò chuyện
          dispatch(fetchConversations())
            .then(() => {
              // Chuyển hướng đến trang tin nhắn với userId
              navigate(`/messages?userId=${friendId}`);
              setStartingChat(false);
            });
        }, 500);
      } else {
        console.error('Không thể gửi tin nhắn');
        setStartingChat(false);
      }
    } catch (error) {
      console.error('Lỗi khi bắt đầu cuộc trò chuyện:', error);
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={30} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Đang tải danh sách bạn bè...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography color="text.secondary" variant="body1">
          {isOwnProfile 
            ? "Bạn chưa có bất kỳ người bạn nào."
            : "Người dùng này chưa có bất kỳ người bạn nào."}
        </Typography>
        {isOwnProfile && (
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            startIcon={<PersonAddIcon />}
            sx={{ mt: 2 }}
            onClick={() => navigate('/friends')}
          >
            Tìm bạn bè
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={2}>
        {friends.map(friend => (
          <Grid item xs={12} sm={6} md={4} key={friend._id}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <Avatar
                src={friend.profilePicture}
                alt={friend.fullName}
                component={Link}
                to={`/profile/${friend._id}`}
                sx={{ 
                  width: 70, 
                  height: 70, 
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <Typography
                variant="subtitle1"
                component={Link}
                to={`/profile/${friend._id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'text.primary',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {friend.fullName}
              </Typography>
              
              <Box sx={{ mt: 1.5, display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleMessageClick(friend._id)}
                  disabled={startingChat}
                  sx={{ 
                    border: '1px solid rgba(25, 118, 210, 0.5)',
                    p: 0.8
                  }}
                >
                  <ChatIcon fontSize="small" />
                </IconButton>
                {isOwnProfile && (
                  <FriendButton 
                    userId={friend._id} 
                    size="small"
                    showText={false}
                    iconSize="small"
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfileFriendsList; 