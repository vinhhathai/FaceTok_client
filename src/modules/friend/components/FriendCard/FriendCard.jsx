import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Typography, Avatar, Button, IconButton, Stack, Tooltip, Chip } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from 'react-router-dom';

// API functions
import { acceptFriendRequest, rejectFriendRequest, removeFriend } from '../../api/friendAPI';

// Utils
import { getInitials } from '../../../../shared/utils/stringUtils';

// Styles
import { FriendCardStyled, FriendCardHeader, CardMediaContainer, FriendNameWrapper, FriendCardActions } from './FriendCard.styles';

/**
 * Component to display a friend's information in a card format
 */
const FriendCard = ({ 
  friend, 
  type = 'FRIEND', 
  requestId,
  onActionComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/profile/${friend.id}`);
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    navigate(`/messages/${friend.id}`);
  };

  const handleAccept = async (e) => {
    e.stopPropagation();
    if (isLoading || !requestId) return;

    setIsLoading(true);
    try {
      const response = await acceptFriendRequest(requestId);
      if (response.success) {
        if (onActionComplete) onActionComplete('accepted', requestId);
      } else {
        console.error("Failed to accept request:", response.error);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    if (isLoading || !requestId) return;

    setIsLoading(true);
    try {
      const response = await rejectFriendRequest(requestId);
      if (response.success) {
        if (onActionComplete) onActionComplete('rejected', requestId);
      } else {
        console.error("Failed to reject request:", response.error);
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async (e) => {
    e.stopPropagation();
    if (isLoading || !friend.id) return;
    
    if (!window.confirm("Bạn có chắc muốn hủy kết bạn?")) return;

    setIsLoading(true);
    try {
      const response = await removeFriend(friend.id);
      if (response.success) {
        if (onActionComplete) onActionComplete('removed', friend.id);
      } else {
        console.error("Failed to remove friend:", response.error);
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị các nút hành động dựa vào loại quan hệ
  const renderActions = () => {
    switch (type) {
      case 'FRIEND':
        return (
          <>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<MessageIcon />} 
              onClick={handleMessage}
            >
              Nhắn tin
            </Button>
            <Tooltip title="Hủy kết bạn">
              <IconButton 
                color="error" 
                onClick={handleRemoveFriend} 
                disabled={isLoading}
              >
                <PersonRemoveIcon />
              </IconButton>
            </Tooltip>
          </>
        );
        
      case 'REQUEST_RECEIVED':
        return (
          <>
            <Tooltip title="Chấp nhận">
              <IconButton 
                color="success" 
                onClick={handleAccept} 
                disabled={isLoading}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Từ chối">
              <IconButton 
                color="error" 
                onClick={handleReject} 
                disabled={isLoading}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </>
        );

      case 'REQUEST_SENT':
        return (
          <Chip 
            label="Đã gửi lời mời" 
            color="primary" 
            variant="outlined" 
            size="small" 
          />
        );

      default:
        return null;
    }
  };

  return (
    <FriendCardStyled onClick={handleViewProfile}>
      <FriendCardHeader>
        <CardMediaContainer>
          {friend.profilePicture ? (
            <CardMedia
              component="img"
              image={friend.profilePicture}
              alt={friend.fullName}
            />
          ) : (
            <Avatar sx={{ width: 50, height: 50 }}>
              {getInitials(friend.fullName)}
            </Avatar>
          )}
        </CardMediaContainer>
        
        <CardContent sx={{ flexGrow: 1, paddingBottom: 1 }}>
          <FriendNameWrapper>
            <Typography variant="h6" component="div">
              {friend.fullName}
            </Typography>
            {friend.email && (
              <Typography variant="body2" color="text.secondary">
                {friend.email}
              </Typography>
            )}
          </FriendNameWrapper>
        </CardContent>
      </FriendCardHeader>

      <FriendCardActions>
        <Stack direction="row" spacing={1} alignItems="center">
          {renderActions()}
        </Stack>
      </FriendCardActions>
    </FriendCardStyled>
  );
};

FriendCard.propTypes = {
  friend: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string,
    profilePicture: PropTypes.string
  }).isRequired,
  type: PropTypes.oneOf(['FRIEND', 'REQUEST_RECEIVED', 'REQUEST_SENT', 'NONE']),
  requestId: PropTypes.string,
  onActionComplete: PropTypes.func
};

export default FriendCard; 