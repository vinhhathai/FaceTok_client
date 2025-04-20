import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { sendFriendRequest } from '../../../redux/features/friendSlice';
import {
  DropdownPaper,
  DropdownHeader,
  ResultCount,
  CategoryHeader,
  ProfileLink,
  AddFriendButton,
  FooterLink
} from './styles';

function SearchDropdown({ searchResult, loading, error }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requestedMap, setRequestedMap] = useState({});
  
  // Lấy trạng thái kết bạn từ Redux để biết ai đã là bạn hoặc đã gửi lời mời
  const { friendshipStatus } = useSelector(state => state.friends);

  const handleAddFriendClick = (userId, index, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Gửi yêu cầu kết bạn thông qua Redux
    dispatch(sendFriendRequest(userId));
    
    // Cập nhật UI
    const updatedMap = { ...requestedMap };
    updatedMap[index] = true;
    setRequestedMap(updatedMap);
  };
  
  const handleUserClick = (userId, event) => {
    // Chuyển hướng đến trang profile của người dùng
    navigate(`/profile/${userId}`);
  };
  
  // Kiểm tra trạng thái kết bạn
  const getFriendshipStatus = (userId) => {
    return friendshipStatus[userId]?.status || 'not_friends';
  };

  // Hiển thị thông báo khi đang tải hoặc có lỗi
  if (loading) {
    return (
      <DropdownPaper elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      </DropdownPaper>
    );
  }

  if (error) {
    return (
      <DropdownPaper elevation={3}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">Error searching users</Typography>
        </Box>
      </DropdownPaper>
    );
  }

  if (!searchResult || searchResult.length === 0) {
    return (
      <DropdownPaper elevation={3}>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">No users found</Typography>
        </Box>
      </DropdownPaper>
    );
  }

  return (
    <DropdownPaper elevation={3}>
      <DropdownHeader>
        <Typography variant="subtitle2">
          Search Results
          <ResultCount 
            label={searchResult.length} 
            color="primary" 
            size="small" 
          />
        </Typography>
      </DropdownHeader>
      
      <Box>
        <CategoryHeader variant="subtitle2">People</CategoryHeader>
        <List disablePadding>
          {searchResult.map((user, index) => {
            // Normalize user ID (could be _id or id)
            const userId = user._id || user.id;
            const userFriendshipStatus = getFriendshipStatus(userId);
            const isAlreadyFriend = userFriendshipStatus === 'friends';
            const requestSent = userFriendshipStatus === 'request_sent' || requestedMap[index];
            
            return (
              <ListItem 
                key={userId}
                divider
                sx={{ py: 1, cursor: 'pointer' }}
                onClick={(e) => handleUserClick(userId, e)}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={user.profilePicture} 
                    alt={user.fullName} 
                  />
                </ListItemAvatar>
                <ListItemText 
                  primary={user.fullName || user.username || "User"}
                  secondary={user.email}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
                
                {!isAlreadyFriend && (
                  <AddFriendButton
                    variant="contained"
                    size="small"
                    requested={requestSent}
                    onClick={(event) => handleAddFriendClick(userId, index, event)}
                    disabled={requestSent}
                    startIcon={requestSent ? <HowToRegIcon /> : <PersonAddIcon />}
                  >
                    {requestSent ? "Requested" : "Add Friend"}
                  </AddFriendButton>
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>
      
      {searchResult.length > 5 && (
        <FooterLink to="/friends">
          <Typography variant="body2">See All</Typography>
        </FooterLink>
      )}
    </DropdownPaper>
  );
}

export default SearchDropdown;
