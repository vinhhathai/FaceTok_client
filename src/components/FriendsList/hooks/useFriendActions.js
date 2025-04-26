import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  removeFriend, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  cancelFriendRequest,
  clearFriendError
} from '../../../redux/features/friendSlice';
import { fetchConversations } from '../../../redux/features/messageSlice';
import socketService from '../../../services/socketService';
import { store } from '../../../redux/store';

/**
 * Custom hook to handle friend-related actions
 * @param {Object} initialState - Initial state for the hook
 * @returns {Object} State and action handlers
 */
export default function useFriendActions() {
  const dispatch = useDispatch();
  
  // Modal states
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [selectedFriendName, setSelectedFriendName] = useState("");
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
              // Navigate to messages page with userId
              // Note: Navigation will be handled in the parent component
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
          toast.success('Friend request accepted successfully');
        })
        .catch((error) => {
          console.error('Error accepting friend request:', error);
          const errorMsg = typeof error === 'object' ? error.message || 'Error accepting friend request' : error;
          toast.error(errorMsg);
        });
    } catch (err) {
      console.error('Exception in handleAcceptRequest:', err);
      toast.error('Error accepting friend request');
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
          toast.success('Friend request rejected successfully');
        })
        .catch((error) => {
          console.error('Error rejecting friend request:', error);
          const errorMsg = typeof error === 'object' ? error.message || 'Error rejecting friend request' : error;
          toast.error(errorMsg);
        });
    } catch (err) {
      console.error('Exception in handleRejectRequest:', err);
      toast.error('Error rejecting friend request');
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
          toast.success('Friend request cancelled successfully');
        })
        .catch((error) => {
          console.error('Error cancelling friend request:', error);
          const errorMsg = typeof error === 'object' ? error.message || 'Error cancelling friend request' : error;
          toast.error(errorMsg);
        });
    } catch (err) {
      console.error('Exception in handleCancelRequest:', err);
      toast.error('Error cancelling friend request');
    }
  };

  // Open remove friend confirmation modal
  const openRemoveFriendModal = (friendId, friendName) => {
    console.log("[openRemoveFriendModal] Called with:", { friendId, friendName });
    
    // Validate friendId
    if (!friendId) {
      console.error("[CRITICAL ERROR] friendId is undefined or empty", new Error().stack);
      toast.error("Cannot determine friend ID to remove. Please try again.");
      return;
    }
    
    try {
      // Store values in state directly
      setSelectedFriendId(friendId);
      setSelectedFriendName(friendName || "");
      
      // Debug log
      console.log("[DEBUG] State after setSelectedFriendId:", { 
        friendId, 
        selectedFriendId: friendId,
        friendName: friendName || ""
      });
      
      // Open modal
      setOpenConfirmModal(true);
    } catch (error) {
      console.error("[ERROR] Error in openRemoveFriendModal:", error);
      toast.error("Error opening confirmation dialog. Please try again.");
    }
  };
  
  // Confirm remove friend
  const handleConfirmRemoveFriend = async () => {
    console.log("[handleConfirmRemoveFriend] Starting with ID:", selectedFriendId);
    
    // Ensure ID exists
    if (!selectedFriendId) {
      console.error("[ERROR] No valid friendId found in handleConfirmRemoveFriend");
      toast.error("Cannot determine friend ID to remove. Please try again.");
      setOpenConfirmModal(false);
      return;
    }
    
    try {
      // Close modal first
      setOpenConfirmModal(false);
      setIsRemoving(true);
      
      // Dispatch action to Redux để xử lý optimistic update và gọi API
      dispatch(removeFriend(selectedFriendId))
        .unwrap()
        .then((result) => {
          console.log("[SUCCESS] Friend removed successfully:", result);
          toast.success("Friend removed successfully!");
        })
        .catch((error) => {
          console.error("[ERROR] Failed to remove friend:", error);
          toast.error(error.message || "Error removing friend. Please try again later.");
        });
    } catch (error) {
      console.error("[ERROR] Exception in handleConfirmRemoveFriend:", error);
      toast.error(error.message || "Error removing friend. Please try again later.");
    } finally {
      setIsRemoving(false);
      // Reset state
      setSelectedFriendId(null);
      setSelectedFriendName("");
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

  return {
    // States
    openConfirmModal,
    selectedFriendId,
    selectedFriendName,
    isRemoving,
    startingChat,
    
    // Actions
    handleMessageClick,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    openRemoveFriendModal,
    handleConfirmRemoveFriend,
    handleCloseConfirmModal
  };
} 