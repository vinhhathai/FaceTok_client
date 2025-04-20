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
  Stack
} from '@mui/material';
import { 
  fetchFriends, 
  fetchFriendRequests 
} from '../../redux/features/friendSlice';
import { Link, useNavigate } from 'react-router-dom';
import FriendButton from '../FriendButton/FriendButton';
import ChatIcon from '@mui/icons-material/Chat';
import socketService from '../../services/socketService';
import { fetchConversations } from '../../redux/features/messageSlice';

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
  
  // Get data from Redux store
  const { friends = [], friendRequests = { received: [], sent: [] }, loading, error } = useSelector(state => state.friends || {});
  const { received = [], sent = [] } = friendRequests;
  
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
  }, [friends]);
  
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
  const requestCount = received.length;
  
  if (!currentUser) {
    return (
      <LoadingContainer>
        <CircularProgress />
        <Typography ml={2}>Loading user data...</Typography>
      </LoadingContainer>
    );
  }
  
  return (
    <FriendListContainer>
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
          label={
            <Badge 
              badgeContent={requestCount} 
              color="error"
              sx={{ '& .MuiBadge-badge': { right: -15 } }}
            >
              Requests
            </Badge>
          } 
          id="friends-tab-1" 
          aria-controls="friends-tabpanel-1" 
        />
        <Tab 
          label="Sent" 
          id="friends-tab-2" 
          aria-controls="friends-tabpanel-2" 
        />
      </Tabs>
      
      {/* Loading indicator */}
      {loading && (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      )}
      
      {/* Error message */}
      {error && (
        <ErrorContainer>
          <Typography color="error">{error}</Typography>
        </ErrorContainer>
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
                      <FriendButton userId={friend._id} />
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
        {!loading && received.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
            You don't have any friend requests.
          </Typography>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {received.map((request, index) => (
              <React.Fragment key={request._id}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    request.sender && <FriendButton userId={request.sender._id} />
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
                {index < received.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </TabPanel>
      
      {/* Sent requests tab */}
      <TabPanel value={tabValue} index={2}>
        {!loading && sent.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
            You haven't sent any friend requests.
          </Typography>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {sent.map((request, index) => (
              <React.Fragment key={request._id}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    request.recipient && <FriendButton userId={request.recipient._id} />
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
                {index < sent.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </TabPanel>
    </FriendListContainer>
  );
};

export default FriendsList; 