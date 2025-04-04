import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PeopleIcon from '@mui/icons-material/People';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  cancelFriendRequest, 
  removeFriend,
  checkFriendshipStatus
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
 */
const FriendButton = ({ userId, size = 'small', variant = 'contained', showText = true }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get current user info
  const currentUser = useSelector(state => state.user.user);
  const { friendshipStatus, error } = useSelector(state => state.friends);
  
  // Get status for this specific user
  const status = friendshipStatus[userId]?.status || 'not_friends';
  const requestId = friendshipStatus[userId]?.requestId;
  
  useEffect(() => {
    // Check friendship status if not already available and currentUser exists
    if (currentUser && userId && !friendshipStatus[userId] && userId !== currentUser._id) {
      dispatch(checkFriendshipStatus(userId));
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
              startIcon={<PeopleIcon />}
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
              <CloseIcon fontSize="small" />
              Remove Friend
            </FriendMenuItem>
          </FriendActionMenu>
        </>
      );
      
    case 'request_sent':
      return (
        <Tooltip title="Cancel Friend Request">
          <FriendActionButton
            variant={variant}
            size={size}
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={handleCancelRequest}
            disabled={loading}
          >
            {showText && 'Cancel Request'}
          </FriendActionButton>
        </Tooltip>
      );
      
    case 'request_received':
      return (
        <>
          <Tooltip title="Respond to Friend Request">
            <FriendActionButton
              variant={variant}
              size={size}
              color="primary"
              startIcon={<HowToRegIcon />}
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
              <CheckIcon fontSize="small" />
              Accept
            </FriendMenuItem>
            <FriendMenuItem onClick={handleRejectRequest} disabled={loading}>
              <CloseIcon fontSize="small" />
              Reject
            </FriendMenuItem>
          </FriendActionMenu>
        </>
      );
      
    case 'not_friends':
    default:
      return (
        <Tooltip title="Add Friend">
          <FriendActionButton
            variant={variant}
            size={size}
            color="primary"
            startIcon={<PersonAddIcon />}
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