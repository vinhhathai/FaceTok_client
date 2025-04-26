import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Tab, 
  Tabs, 
  CircularProgress, 
  Typography 
} from '@mui/material';
import { toast } from 'react-toastify';

// Redux actions
import { 
  fetchFriends, 
  fetchFriendRequests 
} from '../../redux/features/friendSlice';

// Custom components
import TabPanel from './components/TabPanel/TabPanel';
import FriendsTab from './components/FriendsTab/FriendsTab';
import FriendRequestsTab from './components/FriendRequestsTab/FriendRequestsTab';
import SentRequestsTab from './components/SentRequestsTab/SentRequestsTab';
import { ConfirmDialog } from './components/DialogComponents';

// Custom hooks and styles
import useFriendActions from './hooks/useFriendActions';
import { LoadingContainer } from './styles';
import './FriendsList.css';

/**
 * FriendsList - Main component that manages the friends list and requests
 * This component has been refactored to be under 300 lines by:
 * - Moving UI components to separate files
 * - Moving business logic to custom hooks
 * - Using composition for complex UI elements
 */
const FriendsList = () => {
  // Navigation and state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  // Custom hook for friend actions
  const { 
    // States
    openConfirmModal,
    selectedFriendId,
    selectedFriendName,
    startingChat,
    
    // Actions
    handleMessageClick,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    openRemoveFriendModal,
    handleConfirmRemoveFriend,
    handleCloseConfirmModal
  } = useFriendActions();
  
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
  
  // Get current user
  const currentUser = useSelector(state => state.user.user);
  
  // Fetch friends and friend requests on component mount
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFriends());
      dispatch(fetchFriendRequests());
    }
  }, [dispatch, currentUser]);

  // Debug: Log friends data
  useEffect(() => {
    console.log('Friends data:', friends);
    console.log('Received requests data:', receivedRequests);
  }, [friends, receivedRequests]);
  
  // Show error notifications when there's an error
  useEffect(() => {
    if (friendRequestError) {
      const errorMsg = typeof friendRequestError === 'object' 
        ? friendRequestError.message 
        : friendRequestError;
      
      if (errorMsg) {
        toast.error(errorMsg);
      }
    }
  }, [friendRequestError]);

  // Show error notifications for general errors
  useEffect(() => {
    if (error && error !== 'Resource not found') {
      const errorMsg = typeof error === 'object' 
        ? (error.message || 'Đã xảy ra lỗi khi tải danh sách bạn bè') 
        : error;
      
      if (errorMsg) {
        toast.error(errorMsg);
      }
    }
  }, [error]);
  
  // Handle tab change
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle message click - navigate to messages
  const handleMessageStart = async (userId) => {
    const result = await handleMessageClick(userId);
    if (result) {
      navigate(`/messages?userId=${userId}`);
    }
  };

  // Show loading state if user not loaded
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
      {/* Tabs navigation */}
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
        <FriendsTab 
          loading={loading}
          friends={friends}
          startingChat={startingChat}
          handleMessageClick={handleMessageStart}
          openRemoveFriendModal={openRemoveFriendModal}
        />
      </TabPanel>
      
      {/* Friend requests tab */}
      <TabPanel value={tabValue} index={1}>
        <FriendRequestsTab 
          loading={loading}
          receivedRequests={receivedRequests}
          friendRequestLoading={friendRequestLoading}
          handleAcceptRequest={handleAcceptRequest}
          handleRejectRequest={handleRejectRequest}
        />
      </TabPanel>
      
      {/* Sent requests tab */}
      <TabPanel value={tabValue} index={2}>
        <SentRequestsTab 
          loading={loading}
          sentRequests={sentRequests}
          friendRequestLoading={friendRequestLoading}
          handleCancelRequest={handleCancelRequest}
        />
      </TabPanel>
      
      {/* Confirmation dialog for removing friends */}
      <ConfirmDialog 
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmRemoveFriend}
        friendName={selectedFriendName}
      />
    </div>
  );
};

export default FriendsList; 