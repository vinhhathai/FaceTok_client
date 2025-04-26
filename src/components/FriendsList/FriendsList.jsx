import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Divider, 
  Badge, 
  Tab, 
  Tabs, 
  CircularProgress,
  Button,
  Stack,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  fetchFriends, 
  fetchFriendRequests, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  cancelFriendRequest,
  removeFriend,
  clearFriendError
} from '../../redux/features/friendSlice';
import { Link, useNavigate } from 'react-router-dom';
import FriendButton from '../FriendButton/FriendButton';
import ChatIcon from '@mui/icons-material/Chat';
import socketService from '../../services/socketService';
import { fetchConversations } from '../../redux/features/messageSlice';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MessageIcon from '@mui/icons-material/Message';
import './FriendsList.css';

import {
  FriendListContainer,
  TabPanelContainer,
  EmptyStateText,
  StyledListItem,
  UserLink,
  MessageButton,
  LoadingContainer,
  ErrorContainer
} from './styles';

// Tab panel component for the tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friends-tabpanel-${index}`}
      aria-labelledby={`friends-tab-${index}`}
      {...other}
    >
      {value === index && (
        <TabPanelContainer>
          {children}
        </TabPanelContainer>
      )}
    </div>
  );
}

/**
 * FriendsList component displays a user's friends and friend requests
 */
const FriendsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [startingChat, setStartingChat] = useState(false);
  
  // Modal states
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get data from Redux store
  const { 
    friends, 
    receivedRequests, 
    sentRequests,
    loading, 
    error,
    friendRequestLoading,
    friendRequestError
  } = useSelector(state => state.friends);
  
  // Check if current user is loaded
  const currentUser = useSelector(state => state.user.user);
  
  // Fetch friends and friend requests on component mount
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFriends());
      dispatch(fetchFriendRequests());
    }
  }, [dispatch, currentUser]);

  // Debug: Log friends data to console
  useEffect(() => {
    console.log('Friends data:', friends);
    console.log('Received requests data:', receivedRequests);
  }, [friends, receivedRequests]);
  
  // Show error modal when there's an error
  useEffect(() => {
    if (friendRequestError) {
      setErrorMessage(typeof friendRequestError === 'object' ? friendRequestError.message : friendRequestError);
      setOpenErrorModal(true);
    }
  }, [friendRequestError]);

  // Show error modal for general errors
  useEffect(() => {
    if (error && error !== 'Resource not found') {
      setErrorMessage(typeof error === 'object' ? (error.message || 'Đã xảy ra lỗi khi tải danh sách bạn bè') : error);
      setOpenErrorModal(true);
    }
  }, [error]);
  
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMessageClick = async (userId) => {
    try {
      setStartingChat(true);
      
      // Khởi tạo socket nếu chưa có
      socketService.initSocket();
      
      // Gửi một tin nhắn trống để tạo cuộc trò chuyện (không hiển thị)
      const messageSuccess = socketService.sendMessage(userId, '👋');
      
      if (messageSuccess) {
        // Đợi một chút để cuộc trò chuyện được tạo trên server
        setTimeout(() => {
          // Cập nhật danh sách cuộc trò chuyện
          dispatch(fetchConversations())
            .then(() => {
              // Chuyển hướng đến trang tin nhắn với userId
              navigate(`/messages?userId=${userId}`);
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
  
  // Calculate badge counts for tabs
  const requestCount = receivedRequests.length;
  
  const handleAcceptRequest = (requestId) => {
    dispatch(acceptFriendRequest(requestId));
  };

  const handleRejectRequest = (requestId) => {
    console.log('Attempting to reject friend request with ID:', requestId);
    if (!requestId) {
      console.error('No request ID provided for rejection');
      return;
    }
    
    // Clear any previous errors
    dispatch(clearFriendError());
    
    // Show loading indicator
    setTabValue(1); // Switch to the Requests tab
    
    dispatch(rejectFriendRequest(requestId))
      .then((result) => {
        if (result.type.endsWith('/fulfilled')) {
          console.log('Friend request rejected successfully');
          // Refresh the friend requests list
          dispatch(fetchFriendRequests());
        } else {
          console.error('Rejection failed:', result);
        }
      })
      .catch((error) => {
        console.error('Error rejecting friend request:', error);
      });
  };

  const handleCancelRequest = (requestId) => {
    dispatch(cancelFriendRequest(requestId));
  };

  // Mở modal xác nhận khi muốn xóa bạn bè
  const openRemoveFriendModal = (friendId) => {
    console.log("Opening modal for friend ID:", friendId);
    setSelectedFriendId(friendId);
    setOpenConfirmModal(true);
  };
  
  // Đóng modal và xóa bạn bè
  const handleConfirmRemoveFriend = () => {
    console.log("Confirming remove friend with ID:", selectedFriendId);
    if (selectedFriendId) {
      dispatch(removeFriend(selectedFriendId));
    } else {
      console.error("No friend ID selected for removal");
    }
    setOpenConfirmModal(false);
  };
  
  // Đóng modal
  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
    setSelectedFriendId(null);
  };
  
  // Đóng modal lỗi
  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
    dispatch(clearFriendError());
  };

  if (!currentUser) {
    return (
      <LoadingContainer>
        <CircularProgress />
        <Typography ml={2}>Loading user data...</Typography>
      </LoadingContainer>
    );
  }
  
  return (
    <div className="friends-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChangeTab}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            label="Friends" 
            id="friends-tab-0" 
            aria-controls="friends-tabpanel-0" 
          />
          <Tab 
            label={`Requests${receivedRequests.length > 0 ? ` (${receivedRequests.length})` : ''}`} 
            id="friends-tab-1" 
            aria-controls="friends-tabpanel-1" 
          />
          <Tab 
            label={`Sent${sentRequests.length > 0 ? ` (${sentRequests.length})` : ''}`} 
            id="friends-tab-2" 
            aria-controls="friends-tabpanel-2" 
          />
        </Tabs>
      </Box>
      
      {/* Loading indicator */}
      {loading && (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      )}
      
      {/* Friends tab */}
      <TabPanel value={tabValue} index={0}>
        {!loading && friends.length === 0 ? (
          <EmptyStateText variant="body1">
            You don't have any friends yet.
          </EmptyStateText>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {friends.map((friend, index) => (
              <React.Fragment key={friend._id}>
                <StyledListItem
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <MessageButton
                        variant="outlined"
                        size="small"
                        startIcon={<ChatIcon />}
                        onClick={() => handleMessageClick(friend._id)}
                        disabled={startingChat}
                      >
                        Nhắn tin
                      </MessageButton>
                      {/* <FriendButton userId={friend._id} /> */}
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<PersonRemoveIcon />}
                        onClick={() => openRemoveFriendModal(friend._id)}
                      >
                        Xóa
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      alt={friend.username || friend.fullName || 'User'}
                      src={friend.avatar || friend.profilePicture} 
                      component={Link}
                      to={`/profile/${friend._id}`}
                      sx={{ cursor: 'pointer' }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <UserLink
                        component={Link}
                        to={`/profile/${friend._id}`}
                      >
                        {friend.username || friend.fullName || 'User'}
                      </UserLink>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography 
                          component="p" 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {friend.email || 'No email available'}
                        </Typography>
                      </Box>
                    }
                  />
                </StyledListItem>
                {index < friends.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </TabPanel>
      
      {/* Friend requests tab */}
      <TabPanel value={tabValue} index={1}>
        {!loading && receivedRequests.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
            You don't have any friend requests.
          </Typography>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {receivedRequests.map((request, index) => (
              <React.Fragment key={request._id}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    request.sender && (
                      <Stack direction="row" spacing={1}>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="success" 
                          startIcon={<CheckIcon />}
                          onClick={() => handleAcceptRequest(request._id)}
                          disabled={friendRequestLoading}
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
                        >
                          Từ chối
                        </Button>
                      </Stack>
                    )
                  }
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
                        <Typography
                          component={Link}
                          to={`/profile/${request.sender._id}`}
                          sx={{ 
                            color: 'inherit', 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {request.sender.username || request.sender.fullName || 'User'}
                        </Typography>
                      )
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Sent you a friend request
                        </Typography>
                        {' — '}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </>
                    }
                  />
                </ListItem>
                {index < receivedRequests.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </TabPanel>
      
      {/* Sent requests tab */}
      <TabPanel value={tabValue} index={2}>
        {!loading && sentRequests.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
            You haven't sent any friend requests.
          </Typography>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {sentRequests.map((request, index) => (
              <React.Fragment key={request._id}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    request.recipient && (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<CloseIcon />}
                        onClick={() => handleCancelRequest(request._id)}
                        disabled={friendRequestLoading}
                      >
                        Hủy
                      </Button>
                    )
                  }
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
                        <Typography
                          component={Link}
                          to={`/profile/${request.recipient._id}`}
                          sx={{ 
                            color: 'inherit', 
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {request.recipient.username || request.recipient.fullName || 'User'}
                        </Typography>
                      )
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Request sent
                        </Typography>
                        {' — '}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </>
                    }
                  />
                </ListItem>
                {index < sentRequests.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </TabPanel>
      
      {/* Modal xác nhận xóa bạn bè */}
      <Dialog
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận xóa bạn bè
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa bạn bè này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmModal} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmRemoveFriend} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal hiển thị lỗi */}
      <Dialog
        open={openErrorModal}
        onClose={handleCloseErrorModal}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title" sx={{ color: 'error.main' }}>
          Lỗi
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorModal} color="primary" autoFocus>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FriendsList; 