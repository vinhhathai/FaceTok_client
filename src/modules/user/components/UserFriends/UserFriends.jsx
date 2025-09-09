import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, 
  CircularProgress, 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Button, 
  Avatar,
  Box,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import userApi from '@user/api/userApi';
import { getFriends, checkRelationship, sendFriendRequest, removeFriend } from '@friend/api/friendAPI';

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
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relationshipStatus, setRelationshipStatus] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const currentUser = useSelector((state) => state.auth.user);
  const isOwnProfile = currentUser && currentUser._id === userId;

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  useEffect(() => {
    const loadFriends = async () => {
      try {
        setLoading(true);
        setError(null);
        // Sử dụng friend API để lấy danh sách bạn bè của user hiện tại
        const response = await getFriends();
        const friendsList = response.data?.friends || [];
        setFriends(friendsList);
        
        // Nếu không phải chủ tài khoản, kiểm tra relationship status với từng friend
        if (!isOwnProfile && currentUser) {
          const statusPromises = friendsList.map(async (friend) => {
            try {
              const relationshipResponse = await checkRelationship(friend._id || friend.id);
              return {
                friendId: friend._id || friend.id,
                status: relationshipResponse.data?.status || 'NONE'
              };
            } catch (error) {
              console.error(`Error checking relationship with ${friend._id || friend.id}:`, error);
              return {
                friendId: friend._id || friend.id,
                status: 'NONE'
              };
            }
          });
          
          const statusResults = await Promise.all(statusPromises);
          const statusMap = {};
          statusResults.forEach(result => {
            statusMap[result.friendId] = result.status;
          });
          setRelationshipStatus(statusMap);
        }
      } catch (error) {
        console.error('Failed to fetch friends:', error);
        setError('Không thể tải danh sách bạn bè. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, []);

  const handleViewProfile = (friend) => {
    // Sử dụng state để truyền thông tin user thay vì ID trực tiếp trên URL
    navigate('/profile', { 
      state: { 
        userId: friend._id || friend.id,
        userInfo: {
          fullName: friend.fullName,
          profilePicture: friend.profilePicture
        }
      } 
    });
  };

  const handleMessage = (friend) => {
    // Sử dụng state để truyền thông tin user thay vì ID trực tiếp trên URL
    navigate('/messages', { 
      state: { 
        friendId: friend._id || friend.id,
        userInfo: {
          fullName: friend.fullName,
          profilePicture: friend.profilePicture
        }
      } 
    });
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      if (!window.confirm('Bạn có chắc muốn hủy kết bạn?')) {
        return;
      }
      
      // Tìm tên của friend trước khi xóa
      const friendToRemove = friends.find(friend => 
        (friend._id || friend.id) === friendId
      );
      
      const response = await removeFriend(friendId);
      
      if (response.success) {
        // Cập nhật danh sách friends sau khi unfriend thành công
        setFriends(prevFriends => 
          prevFriends.filter(friend => 
            (friend._id || friend.id) !== friendId
          )
        );
        showToast(`Đã hủy kết bạn với ${friendToRemove?.fullName || 'người này'}`);
      } else {
        showToast(response.error?.message || 'Không thể hủy kết bạn', 'error');
      }
    } catch (error) {
      showToast('Đã xảy ra lỗi, vui lòng thử lại sau', 'error');
      console.error('Error removing friend:', error);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      // Tìm tên của friend
      const friendToAdd = friends.find(friend => 
        (friend._id || friend.id) === friendId
      );
      
      const response = await sendFriendRequest(friendId);
      
      if (response.success) {
        // Cập nhật relationship status sau khi gửi friend request
        setRelationshipStatus(prev => ({
          ...prev,
          [friendId]: 'REQUEST_SENT'
        }));
        showToast(`Đã gửi lời mời kết bạn đến ${friendToAdd?.fullName || 'người này'}`);
      } else {
        showToast(response.error?.message || 'Không thể gửi lời mời kết bạn', 'error');
      }
    } catch (error) {
      showToast('Đã xảy ra lỗi, vui lòng thử lại sau', 'error');
      console.error('Error sending friend request:', error);
    }
  };
  
  const renderFriends = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      );
    }
    
    if (error) {
      return (
        <EmptyContainer>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              const loadFriends = async () => {
                try {
                  setLoading(true);
                  setError(null);
                  const response = await getFriends();
                  setFriends(response.data?.friends || []);
                } catch (error) {
                  console.error('Failed to fetch friends:', error);
                  setError('Không thể tải danh sách bạn bè. Vui lòng thử lại.');
                } finally {
                  setLoading(false);
                }
              };
              loadFriends();
            }}
            sx={{ mt: 2 }}
          >
            Thử lại
          </Button>
        </EmptyContainer>
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
        <List>
        {friends.map((friend) => (
          <ListItem key={friend.id} divider>
            <ListItemAvatar>
              <Avatar
                src={friend.profilePicture || DEFAULT_AVATAR}
                alt={friend.fullName}
                sx={{ width: 56, height: 56, cursor: 'pointer' }}
                onClick={() => handleViewProfile(friend)}
              />
            </ListItemAvatar>
            <ListItemText
                primary={
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => handleViewProfile(friend)}
                  >
                    {friend.fullName}
                  </Typography>
                }
                secondary={friend.bio || 'Chưa có thông tin'}
                sx={{ marginLeft: 2 }}
              />
            {/* Ẩn tất cả các nút action trong tab bạn bè */}
            {/* <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isOwnProfile ? (
                  // Nếu là chủ tài khoản: hiển thị nút Message và Unfriend
                  <>
                    <IconButton
                      color="primary"
                      onClick={() => handleMessage(friend)}
                      size="small"
                    >
                      <MessageIcon />
                    </IconButton>
                    <IconButton
                       color="error"
                       onClick={() => handleRemoveFriend(friend.id)}
                       size="small"
                     >
                       <PersonRemoveIcon />
                     </IconButton>
                  </>
                ) : (
                   // Nếu là người khác xem: hiển thị nút dựa trên relationship status
                   (() => {
                     const status = relationshipStatus[friend._id || friend.id];
                     
                     if (status === 'FRIEND') {
                       // Đã là bạn bè: chỉ cho phép click vào avatar/tên để xem profile
                       return null;
                     } else if (status === 'REQUEST_SENT') {
                       // Đã gửi friend request: hiển thị nút disabled
                       return (
                         <IconButton
                           color="default"
                           disabled
                           size="small"
                           title="Đã gửi lời mời kết bạn"
                         >
                           <PersonAddIcon />
                         </IconButton>
                       );
                     } else if (status === 'REQUEST_RECEIVED') {
                       // Nhận được friend request: có thể hiển thị nút accept (tùy chọn)
                       return null;
                     } else {
                       // Chưa có mối quan hệ: hiển thị nút Add Friend
                       return (
                         <IconButton
                           color="primary"
                           onClick={() => handleAddFriend(friend._id || friend.id)}
                           size="small"
                           title="Gửi lời mời kết bạn"
                         >
                           <PersonAddIcon />
                         </IconButton>
                       );
                     }
                   })()
                 )}
              </Box>
            </ListItemSecondaryAction> */}
          </ListItem>
        ))}
        </List>
      </FriendsContainer>
    );
  };

  return (
    <>
      {renderFriends()}
      
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

UserFriends.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserFriends;