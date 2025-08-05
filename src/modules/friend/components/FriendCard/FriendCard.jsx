import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Typography, Avatar, Button, IconButton, Stack, Tooltip, Chip, Snackbar, Alert } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from 'react-router-dom';

// API functions
import { acceptFriendRequest, rejectFriendRequest, removeFriend, cancelFriendRequest } from '@friend/api/friendAPI';

// Utils
import { getInitials } from '@utils/stringUtils';

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
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/profile/${friend.id}`);
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    navigate(`/messages/${friend.id}`);
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleAccept = async (e) => {
    e.stopPropagation();
    if (isLoading || !requestId) return;

    setIsLoading(true);
    try {
      const response = await acceptFriendRequest(requestId);
      if (response.success) {
        showToast(`Đã chấp nhận lời mời kết bạn từ ${friend.fullName}`);
        if (onActionComplete) onActionComplete('accepted', requestId);
      } else {
        showToast(response.error?.message || "Không thể chấp nhận lời mời", "error");
        console.error("Failed to accept request:", response.error);
      }
    } catch (error) {
      showToast("Đã xảy ra lỗi, vui lòng thử lại sau", "error");
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
        showToast(`Đã từ chối lời mời kết bạn từ ${friend.fullName}`);
        if (onActionComplete) onActionComplete('rejected', requestId);
      } else {
        showToast(response.error?.message || "Không thể từ chối lời mời", "error");
        console.error("Failed to reject request:", response.error);
      }
    } catch (error) {
      showToast("Đã xảy ra lỗi, vui lòng thử lại sau", "error");
      console.error("Error rejecting friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (e) => {
    e.stopPropagation();
    if (isLoading || !requestId) return;
    
    if (!window.confirm("Bạn có chắc muốn hủy lời mời kết bạn?")) return;

    setIsLoading(true);
    try {
      const response = await cancelFriendRequest(requestId);
      if (response.success) {
        showToast(`Đã hủy lời mời kết bạn đến ${friend.fullName}`);
        if (onActionComplete) onActionComplete('cancelled', requestId);
      } else {
        showToast(response.error?.message || "Không thể hủy lời mời", "error");
        console.error("Failed to cancel request:", response.error);
      }
    } catch (error) {
      showToast("Đã xảy ra lỗi, vui lòng thử lại sau", "error");
      console.error("Error cancelling friend request:", error);
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
        showToast(`Đã hủy kết bạn với ${friend.fullName}`);
        if (onActionComplete) onActionComplete('removed', friend.id);
      } else {
        showToast(response.error?.message || "Không thể hủy kết bạn", "error");
        console.error("Failed to remove friend:", response.error);
      }
    } catch (error) {
      showToast("Đã xảy ra lỗi, vui lòng thử lại sau", "error");
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
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label="Đã gửi lời mời" 
              color="primary" 
              variant="outlined" 
              size="small" 
            />
            <Tooltip title="Hủy lời mời">
              <IconButton
                color="error"
                size="small"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <>
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