import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PeopleIcon from '@mui/icons-material/People';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  cancelFriendRequest, 
  removeFriend,
  getFriendshipStatus
} from '../../redux/features/friendSlice';

import {
  FriendActionButton,
  FriendActionMenu,
  FriendMenuItem
} from './styles';

/**
 * FriendButton component for managing friendship actions
 * @param {Object} props
 * @param {string} props.userId - ID of the user to whom the friendship action applies
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 * @param {string} props.variant - Button variant ('text', 'outlined', 'contained')
 * @param {boolean} props.showText - Whether to show text along with icon
 * @param {string} props.iconSize - Size of the icon ('small', 'medium', 'large')
 */
const FriendButton = ({ userId, size = 'small', variant = 'contained', showText = true, iconSize = 'medium' }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get current user info
  const currentUser = useSelector(state => state.user.user);
  const { friendshipStatus, error } = useSelector(state => state.friends);
  
  // Get status for this specific user - đảm bảo xử lý đúng cả khi status là string
  const userStatus = friendshipStatus[userId];
  const status = typeof userStatus === 'string' 
    ? userStatus 
    : (userStatus?.status || 'none');
  const requestId = typeof userStatus === 'object' ? userStatus?.requestId : undefined;
  
  useEffect(() => {
    // Check friendship status if not already available and currentUser exists
    if (currentUser && userId && !friendshipStatus[userId] && userId !== currentUser._id) {
      dispatch(getFriendshipStatus(userId));
    }
  }, [userId, dispatch, friendshipStatus, currentUser]);
  
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleSendRequest = async () => {
    setLoading(true);
    await dispatch(sendFriendRequest(userId));
    setLoading(false);
  };
  
  const handleAcceptRequest = async () => {
    if (!requestId) return;
    setLoading(true);
    await dispatch(acceptFriendRequest(requestId));
    setLoading(false);
    handleCloseMenu();
  };
  
  const handleRejectRequest = async () => {
    if (!requestId) return;
    setLoading(true);
    await dispatch(rejectFriendRequest(requestId));
    setLoading(false);
    handleCloseMenu();
  };
  
  const handleCancelRequest = async () => {
    if (!requestId) return;
    setLoading(true);
    await dispatch(cancelFriendRequest(requestId));
    setLoading(false);
  };
  
  const handleRemoveFriend = async () => {
    setLoading(true);
    await dispatch(removeFriend(userId));
    setLoading(false);
    handleCloseMenu();
  };
  
  // Don't render if currentUser isn't loaded yet or if viewing own profile
  if (!currentUser || !userId || userId === currentUser._id) {
    return null;
  }
  
  // Render different buttons based on friendship status
  switch (status) {
    case 'friends':
      return (
        <>
          <Tooltip title="Friends">
            <FriendActionButton
              variant={variant}
              size={size}
              color="primary"
              startIcon={<PeopleIcon fontSize={iconSize} />}
              onClick={handleOpenMenu}
              disabled={loading}
            >
              {showText && 'Friends'}
            </FriendActionButton>
          </Tooltip>
          <FriendActionMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <FriendMenuItem onClick={handleRemoveFriend} disabled={loading}>
              <PersonRemoveIcon fontSize={iconSize} />
              Remove
            </FriendMenuItem>
          </FriendActionMenu>
        </>
      );
      
    case 'pending_sent':
    case 'request_sent':
      return (
        <Tooltip title="Cancel Friend Request">
          <FriendActionButton
            variant={variant}
            size={size}
            color="secondary"
            startIcon={<CancelIcon fontSize={iconSize} />}
            onClick={handleCancelRequest}
            disabled={loading}
          >
            {showText && 'Cancel Request'}
          </FriendActionButton>
        </Tooltip>
      );
      
    case 'pending_received':
    case 'request_received':
      return (
        <>
          <Tooltip title="Respond to Friend Request">
            <FriendActionButton
              variant={variant}
              size={size}
              color="primary"
              startIcon={<HowToRegIcon fontSize={iconSize} />}
              onClick={handleOpenMenu}
              disabled={loading}
            >
              {showText && 'Respond'}
            </FriendActionButton>
          </Tooltip>
          <FriendActionMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <FriendMenuItem onClick={handleAcceptRequest} disabled={loading}>
              <CheckIcon fontSize={iconSize} />
              Accept
            </FriendMenuItem>
            <FriendMenuItem onClick={handleRejectRequest} disabled={loading}>
              <CloseIcon fontSize={iconSize} />
              Reject
            </FriendMenuItem>
          </FriendActionMenu>
        </>
      );
    
    case 'rejected':
      return (
        <Tooltip title="Request Rejected">
          <FriendActionButton
            variant={variant}
            size={size}
            color="secondary"
            startIcon={<PersonAddIcon fontSize={iconSize} />}
            onClick={handleSendRequest}
            disabled={loading}
          >
            {showText && 'Request Again'}
          </FriendActionButton>
        </Tooltip>
      );
      
    case 'none':
    case 'not_friends':
    default:
      return (
        <Tooltip title="Add Friend">
          <FriendActionButton
            variant={variant}
            size={size}
            color="primary"
            startIcon={<PersonAddIcon fontSize={iconSize} />}
            onClick={handleSendRequest}
            disabled={loading}
          >
            {showText && 'Add Friend'}
          </FriendActionButton>
        </Tooltip>
      );
  }
};

export default FriendButton; 