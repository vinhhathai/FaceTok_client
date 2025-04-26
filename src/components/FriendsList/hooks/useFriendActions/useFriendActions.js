import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  removeFriend, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  cancelFriendRequest,
  clearFriendError
} from '../../../../redux/features/friendSlice';
import { fetchConversations } from '../../../../redux/features/messageSlice';
import socketService from '../../../../services/socketService';
import './useFriendActions.css';

/**
 * Custom hook to handle friend-related actions
 * @returns {Object} State and action handlers
 */
const useFriendActions = () => {
  const dispatch = useDispatch();
  
  // Modal states
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [selectedFriendName, setSelectedFriendName] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  
  // Debugging ref
  const debugRef = useRef({
    lastSelectedFriendId: null,
    lastSelectedFriendName: '',
  });
  
  // Update debug ref when selectedFriendId changes
  useEffect(() => {
    debugRef.current.lastSelectedFriendId = selectedFriendId;
    console.log("Selected Friend ID updated:", selectedFriendId);
  }, [selectedFriendId]);

  // Message handling
  const handleMessageClick = async (userId) => {
    try {
      setStartingChat(true);
      
      // Initialize socket if not already
      socketService.initSocket();
      
      // Send an empty message to create the conversation (not displayed)
      const messageSuccess = socketService.sendMessage(userId, '👋');
      
      if (messageSuccess) {
        // Wait a bit for the conversation to be created on the server
        setTimeout(() => {
          // Update the conversations list
          dispatch(fetchConversations())
            .then(() => {
              // Navigation will be handled in the parent component
              setStartingChat(false);
              return userId; // Return userId for the parent component to handle navigation
            });
        }, 500);
      } else {
        console.error('Could not send message');
        setStartingChat(false);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      setStartingChat(false);
    }
  };

  // Accept friend request
  const handleAcceptRequest = (requestId) => {
    try {
      if (!requestId) {
        console.error('No requestId provided for accept action');
        return;
      }
      
      dispatch(acceptFriendRequest(requestId))
        .unwrap()
        .then(() => {
          console.log('Friend request accepted successfully');
        })
        .catch((error) => {
          console.error('Error accepting friend request:', error);
          setErrorMessage(typeof error === 'object' ? error.message || 'Error accepting friend request' : error);
          setOpenErrorModal(true);
        });
    } catch (err) {
      console.error('Exception in handleAcceptRequest:', err);
    }
  };

  // Reject friend request
  const handleRejectRequest = (requestId) => {
    try {
      console.log('Attempting to reject friend request with ID:', requestId);
      if (!requestId) {
        console.error('No request ID provided for rejection');
        return;
      }
      
      // Clear any previous errors
      dispatch(clearFriendError());
      
      dispatch(rejectFriendRequest(requestId))
        .unwrap()
        .then(() => {
          console.log('Friend request rejected successfully');
        })
        .catch((error) => {
          console.error('Error rejecting friend request:', error);
          setErrorMessage(typeof error === 'object' ? error.message || 'Error rejecting friend request' : error);
          setOpenErrorModal(true);
        });
    } catch (err) {
      console.error('Exception in handleRejectRequest:', err);
    }
  };

  // Cancel friend request
  const handleCancelRequest = (requestId) => {
    try {
      if (!requestId) {
        console.error('No requestId provided for cancel action');
        return;
      }
      
      dispatch(cancelFriendRequest(requestId))
        .unwrap()
        .then(() => {
          console.log('Friend request cancelled successfully');
        })
        .catch((error) => {
          console.error('Error cancelling friend request:', error);
          setErrorMessage(typeof error === 'object' ? error.message || 'Error cancelling friend request' : error);
          setOpenErrorModal(true);
        });
    } catch (err) {
      console.error('Exception in handleCancelRequest:', err);
    }
  };

  // Open remove friend confirmation modal
  const openRemoveFriendModal = (friendId, friendName) => {
    console.log("[openRemoveFriendModal] Called with:", { friendId, friendName });
    
    // Validate friendId
    if (!friendId) {
      console.error("[CRITICAL ERROR] friendId is undefined or empty", new Error().stack);
      setErrorMessage("Cannot determine friend ID to remove. Please try again.");
      setOpenErrorModal(true);
      return;
    }
    
    try {
      // Store values in ref for persistence
      debugRef.current = {
        ...debugRef.current,
        lastSelectedFriendId: friendId,
        lastSelectedFriendName: friendName,
        selectionTime: new Date().toISOString()
      };
      
      // Set state
      setSelectedFriendId(friendId);
      setSelectedFriendName(friendName || "");
      
      // Debug log
      console.log("[DEBUG] State after setSelectedFriendId:", { 
        friendId, 
        debugRefValue: debugRef.current.lastSelectedFriendId
      });
      
      // Open modal
      setOpenConfirmModal(true);
    } catch (error) {
      console.error("[ERROR] Error in openRemoveFriendModal:", error);
      setErrorMessage("Error opening confirmation dialog. Please try again.");
      setOpenErrorModal(true);
    }
  };
  
  // Confirm remove friend
  const handleConfirmRemoveFriend = async () => {
    console.log("[handleConfirmRemoveFriend] Starting with ID:", selectedFriendId);
    
    // Try getting ID from multiple sources
    const friendIdToRemove = selectedFriendId || debugRef.current.lastSelectedFriendId;
    
    // Ensure ID exists
    if (!friendIdToRemove) {
      console.error("[ERROR] No valid friendId found in handleConfirmRemoveFriend");
      console.log("[DEBUG] Current state:", { 
        selectedFriendId, 
        debugRef: debugRef.current
      });
      
      setErrorMessage("Cannot determine friend ID to remove. Please try again.");
      setOpenErrorModal(true);
      setOpenConfirmModal(false);
      return;
    }
    
    try {
      setOpenConfirmModal(false);
      setIsRemoving(true);
      
      console.log("[INFO] Dispatching removeFriend with ID:", friendIdToRemove);
      
      // Dispatch removeFriend thunk
      await dispatch(removeFriend(friendIdToRemove))
        .unwrap()
        .then(() => {
          toast.success("Friend removed successfully!");
        })
        .catch((error) => {
          console.error("[ERROR] Error removing friend:", error);
          setErrorMessage(typeof error === 'object' ? error.message || "Error removing friend" : error);
          setOpenErrorModal(true);
        });
      
      // Reset state to avoid race conditions
      setSelectedFriendId(null);
      setSelectedFriendName("");
      debugRef.current.lastSelectedFriendId = null;
      debugRef.current.lastSelectedFriendName = null;
      
    } catch (error) {
      console.error("[ERROR] Exception in handleConfirmRemoveFriend:", error);
      setErrorMessage("Error removing friend. Please try again later.");
      setOpenErrorModal(true);
      
      // Reset state
      setSelectedFriendId(null);
      setSelectedFriendName("");
    } finally {
      setIsRemoving(false);
    }
  };
  
  // Close confirm modal
  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
    // Don't reset selectedFriendId immediately to avoid race conditions
    setTimeout(() => {
      setSelectedFriendId(null);
      setSelectedFriendName("");
    }, 100);
  };
  
  // Close error modal
  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
    dispatch(clearFriendError());
  };

  return {
    // States
    openConfirmModal,
    selectedFriendId,
    selectedFriendName,
    openErrorModal,
    errorMessage,
    isRemoving,
    startingChat,
    
    // Actions
    handleMessageClick,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    openRemoveFriendModal,
    handleConfirmRemoveFriend,
    handleCloseConfirmModal,
    handleCloseErrorModal,
    setErrorMessage
  };
};

export default useFriendActions; 