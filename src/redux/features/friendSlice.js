import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import { getTokenFromCookie } from '../../services/socketService';

// Helper function to extract data from different response formats
const getDataFromResponse = (response) => {
  if (!response) return null;
  
  // Check if response has a data property that contains the actual data
  if (response.data !== undefined) {
    return response.data;
  }
  
  // Check if response has a friends property (for list endpoints)
  if (response.friends !== undefined) {
    return response.friends;
  }
  
  return response;
};

// Async thunks
export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      // Get token from cookies
      const token = getTokenFromCookie();
      if (!token) {
        console.error('No authorization token found in cookies');
        return rejectWithValue('Authentication required');
      }

      const response = await axios.get(`${BASE_URL}/friend/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.error || 'Failed to fetch friends');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: 'Could not connect to server'
        }
      );
    }
  }
);

export const fetchUserFriends = createAsyncThunk(
  'friends/fetchUserFriends',
  async (userId, { rejectWithValue }) => {
    try {
      // Get token from cookies
      const token = getTokenFromCookie();
      if (!token) {
        console.error('No authorization token found in cookies');
        return rejectWithValue('Authentication required');
      }

      const response = await axios.get(`${BASE_URL}/friend/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        return {
          userId,
          friends: response.data.data.friends || [],
          totalFriends: response.data.data.totalFriends || 0
        };
      } else {
        return rejectWithValue(response.data.error || 'Failed to fetch user friends');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: 'Could not connect to server'
        }
      );
    }
  }
);

export const fetchFriendRequests = createAsyncThunk(
  'friends/fetchFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      // Get token from cookies
      const token = getTokenFromCookie();
      if (!token) {
        console.error('No authorization token found in cookies');
        return rejectWithValue('Authentication required');
      }

      const response = await axios.get(`${BASE_URL}/friend/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.error || 'Failed to fetch friend requests');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: 'Could not connect to server'
        }
      );
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  'friends/sendFriendRequest',
  async (recipientId, { rejectWithValue }) => {
    try {
      // Get token from cookies
      const token = getTokenFromCookie();
      if (!token) {
        console.error('No authorization token found in cookies');
        return rejectWithValue('Authentication required');
      }

      console.log(`Sending friend request to user ID: ${recipientId}`);
      console.log(`Using token (first 10 chars): ${token.substring(0, 10)}...`);

      const response = await axios.post(
        `${BASE_URL}/friend/request`,
        { recipientId }, // Make sure we're using the correct parameter name
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Friend request response:', response.data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error('Friend request failed:', response.data.error);
        return rejectWithValue(response.data.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error in sendFriendRequest:', error);
      console.error('Error response:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || {
          message: 'Could not connect to server'
        }
      );
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friends/acceptFriendRequest',
  async (requestId, { rejectWithValue, getState, dispatch }) => {
    try {
      // Get current state
      const state = getState();
      
      // Find the request in state
      const request = state.friends.receivedRequests.find(req => req._id === requestId);
      
      // Apply optimistic update - locally remove from received requests and add to friends
      if (request) {
        dispatch({
          type: 'friends/optimisticAcceptRequest',
          payload: { requestId, request }
        });
      }
      
      // Get token from cookies
      const token = getTokenFromCookie();
      if (!token) {
        console.error('No authorization token found in cookies');
        return rejectWithValue('Authentication required');
      }

      const response = await axios.put(
        `${BASE_URL}/friend/accept/${requestId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        return { ...response.data.data, requestId };
      } else {
        // Revert optimistic update on error
        if (request) {
          dispatch({
            type: 'friends/revertOptimisticAccept',
            payload: { requestId, request }
          });
        }
        return rejectWithValue(response.data.error || 'Failed to accept friend request');
      }
    } catch (error) {
      // Revert optimistic update on error
      const state = getState();
      const request = state.friends.receivedRequests.find(req => req._id === requestId);
      if (request) {
        dispatch({
          type: 'friends/revertOptimisticAccept',
          payload: { requestId, request }
        });
      }
      
      return rejectWithValue(
        error.response?.data?.error || {
          message: 'Could not connect to server'
        }
      );
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  'friends/rejectFriendRequest',
  async (requestId, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log(`Rejecting friend request with ID: ${requestId}`);
      
      // Make sure the requestId is valid
      if (!requestId) {
        console.error('No valid requestId provided');
        return rejectWithValue('Invalid request ID');
      }
      
      // Get current state
      const state = getState();
      
      // Find the request in state
      const request = state.friends.receivedRequests.find(req => req._id === requestId);
      
      // Apply optimistic update - locally remove from received requests
      if (request) {
        dispatch({
          type: 'friends/optimisticRejectRequest',
          payload: { requestId }
        });
      }
      
      // Get token from cookies
      const token = getTokenFromCookie();
      if (!token) {
        console.error('No authorization token found in cookies');
        return rejectWithValue('Authentication required');
      }
      
      // Log the request that we're about to make
      console.log(`Making PUT request to: ${BASE_URL}/friend/reject/${requestId}`);
      console.log('Using token (first 10 chars):', token.substring(0, 10) + '...');
      
      const response = await axios.put(
        `${BASE_URL}/friend/reject/${requestId}`,
        {}, // Empty body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Reject request response:', response.data);
      
      if (response.data.success) {
        return { ...response.data.data, requestId };
      } else {
        console.error('Reject request failed:', response.data.error);
        
        // Revert optimistic update on error
        if (request) {
          dispatch({
            type: 'friends/revertOptimisticReject',
            payload: { requestId, request }
          });
        }
        
        return rejectWithValue(response.data.error || 'Failed to reject friend request');
      }
    } catch (error) {
      console.error('Error in rejectFriendRequest:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Revert optimistic update on error
      const state = getState();
      const request = state.friends.receivedRequests.find(req => req._id === requestId);
      if (request) {
        dispatch({
          type: 'friends/revertOptimisticReject',
          payload: { requestId, request }
        });
      }
      
      // Check for specific permission error
      if (error.response?.data?.error?.code === 'VAL_VALIDATION_FAILED' && 
          error.response?.data?.error?.message?.includes('không có quyền')) {
        return rejectWithValue('Bạn không có quyền từ chối lời mời kết bạn này');
      }
      
      return rejectWithValue(
        error.response?.data?.error?.message || 
        error.response?.data?.message || 
        error.message || 
        'Could not connect to server'
      );
    }
  }
);

export const cancelFriendRequest = createAsyncThunk(
  'friends/cancelFriendRequest',
  async (requestId, { rejectWithValue, getState, dispatch }) => {
    try {
      // Get current state
      const state = getState();
      
      // Find the request in state
      const request = state.friends.sentRequests.find(req => req._id === requestId);
      
      // Apply optimistic update - locally remove from sent requests
      if (request) {
        dispatch({
          type: 'friends/optimisticCancelRequest',
          payload: { requestId }
        });
      }
      
      // Get token from cookies
      const token = getTokenFromCookie();
      if (!token) {
        console.error('No authorization token found in cookies');
        return rejectWithValue('Authentication required');
      }

      const response = await axios.delete(
        `${BASE_URL}/friend/cancel/${requestId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        return { ...response.data.data, requestId };
      } else {
        // Revert optimistic update on error
        if (request) {
          dispatch({
            type: 'friends/revertOptimisticCancel',
            payload: { requestId, request }
          });
        }
        
        return rejectWithValue(response.data.error || 'Failed to cancel friend request');
      }
    } catch (error) {
      // Revert optimistic update on error
      const state = getState();
      const request = state.friends.sentRequests.find(req => req._id === requestId);
      if (request) {
        dispatch({
          type: 'friends/revertOptimisticCancel',
          payload: { requestId, request }
        });
      }
      
      return rejectWithValue(
        error.response?.data?.error || {
          message: 'Could not connect to server'
        }
      );
    }
  }
);

export const removeFriend = createAsyncThunk(
  'friends/removeFriend',
  async (friendId, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log("Starting to remove friend with ID:", friendId);
      
      // Validate friendId
      if (!friendId) {
        throw new Error('Invalid friend ID');
      }
      
      // Get current state
      const state = getState();
      
      // Find the friend in state
      const friend = state.friends.friends.find(f => f._id === friendId);
      
      // Apply optimistic update
      if (friend) {
        dispatch({
          type: 'friends/optimisticRemoveFriend',
          payload: { friendId, friend }
        });
      }
      
      // Get token from cookies
      const token = getTokenFromCookie();
      if (!token) {
        console.error('No authorization token found in cookies');
        return rejectWithValue('Authentication required');
      }

      console.log(`Making DELETE request to ${BASE_URL}/friend/remove/${friendId}`);
      
      const response = await axios.delete(
        `${BASE_URL}/friend/remove/${friendId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Remove friend response:", response.data);
      
      if (response.data.success) {
        console.log("Friend removed successfully:", response.data.data);
        return { ...response.data.data, friendId };
      } else {
        console.error("Failed to remove friend:", response.data.error);
        
        // Revert optimistic update
        if (friend) {
          dispatch({
            type: 'friends/revertOptimisticRemoveFriend',
            payload: { friendId, friend }
          });
        }
        
        return rejectWithValue(response.data.error || 'Failed to remove friend');
      }
    } catch (error) {
      console.error("Error in removeFriend action:", error);
      console.error("Error response:", error.response?.data);
      
      // Revert optimistic update
      const state = getState();
      const friend = state.friends.friends.find(f => f._id === friendId);
      if (friend) {
        dispatch({
          type: 'friends/revertOptimisticRemoveFriend',
          payload: { friendId, friend }
        });
      }
      
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Could not connect to server'
      );
    }
  }
);

export const getFriendshipStatus = createAsyncThunk(
  'friends/getFriendshipStatus',
  async (userId, { rejectWithValue }) => {
    try {
      // Get token from cookies
      const token = getTokenFromCookie();
      if (!token) {
        console.error('No authorization token found in cookies');
        return rejectWithValue('Authentication required');
      }

      const response = await axios.post(
        `${BASE_URL}/friend/status`,
        { targetUserId: userId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // The response contains status and possibly requestId
        return {
          userId,
          status: response.data.data
        };
      } else {
        return rejectWithValue(response.data.error || 'Failed to get friendship status');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || {
          message: 'Could not connect to server'
        }
      );
    }
  }
);

// Initial state
const initialState = {
  friends: [],
  totalFriends: 0,
  receivedRequests: [],
  sentRequests: [],
  totalReceivedRequests: 0,
  totalSentRequests: 0,
  loading: false,
  error: null,
  friendRequestLoading: false,
  friendRequestError: null,
  friendshipStatus: {}, // Map of userId to status
  lastFetched: null,
  userFriends: {}, // Map of userId to their friends
};

// Create slice
const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    clearFriendError: (state) => {
      state.error = null;
      state.friendRequestError = null;
    },
    addFriendRequest: (state, action) => {
      const request = action.payload;
      const existingRequestIndex = state.receivedRequests.findIndex(req => req._id === request._id);
      if (existingRequestIndex === -1) {
        state.receivedRequests.push(request);
        state.totalReceivedRequests += 1;
      }
    },
    addFriend: (state, action) => {
      const friend = action.payload;
      const existingFriendIndex = state.friends.findIndex(f => f._id === friend._id);
      if (existingFriendIndex === -1) {
        state.friends.push(friend);
        state.totalFriends += 1;
      }
    },
    removeFriendAction: (state, action) => {
      const friendId = action.payload;
      state.friends = state.friends.filter(friend => friend._id !== friendId);
      state.totalFriends = Math.max(0, state.totalFriends - 1);
    },
    // Optimistic updates
    optimisticAcceptRequest: (state, action) => {
      const { requestId, request } = action.payload;
      // Remove from received requests
      state.receivedRequests = state.receivedRequests.filter(req => req._id !== requestId);
      state.totalReceivedRequests = Math.max(0, state.totalReceivedRequests - 1);
      
      // Add to friends
      if (request && request.sender) {
        const newFriend = {
          _id: request.sender._id,
          fullName: request.sender.fullName,
          profilePicture: request.sender.profilePicture,
          email: request.sender.email
        };
        
        const existingFriendIndex = state.friends.findIndex(f => f._id === newFriend._id);
        if (existingFriendIndex === -1) {
          state.friends.push(newFriend);
          state.totalFriends += 1;
          
          // Update friendship status
          state.friendshipStatus[newFriend._id] = "friends";
        }
      }
    },
    revertOptimisticAccept: (state, action) => {
      const { requestId, request } = action.payload;
      
      // Add back to received requests
      if (request) {
        const existingRequestIndex = state.receivedRequests.findIndex(req => req._id === requestId);
        if (existingRequestIndex === -1) {
          state.receivedRequests.push(request);
          state.totalReceivedRequests += 1;
        }
        
        // Remove from friends
        if (request.sender) {
          state.friends = state.friends.filter(friend => friend._id !== request.sender._id);
          state.totalFriends = Math.max(0, state.totalFriends - 1);
          
          // Update friendship status
          delete state.friendshipStatus[request.sender._id];
        }
      }
    },
    optimisticRejectRequest: (state, action) => {
      const { requestId } = action.payload;
      // Remove from received requests
      state.receivedRequests = state.receivedRequests.filter(req => req._id !== requestId);
      state.totalReceivedRequests = Math.max(0, state.totalReceivedRequests - 1);
    },
    revertOptimisticReject: (state, action) => {
      const { requestId, request } = action.payload;
      
      // Add back to received requests
      if (request) {
        const existingRequestIndex = state.receivedRequests.findIndex(req => req._id === requestId);
        if (existingRequestIndex === -1) {
          state.receivedRequests.push(request);
          state.totalReceivedRequests += 1;
        }
      }
    },
    optimisticCancelRequest: (state, action) => {
      const { requestId } = action.payload;
      // Remove from sent requests
      state.sentRequests = state.sentRequests.filter(req => req._id !== requestId);
      state.totalSentRequests = Math.max(0, state.totalSentRequests - 1);
    },
    revertOptimisticCancel: (state, action) => {
      const { requestId, request } = action.payload;
      
      // Add back to sent requests
      if (request) {
        const existingRequestIndex = state.sentRequests.findIndex(req => req._id === requestId);
        if (existingRequestIndex === -1) {
          state.sentRequests.push(request);
          state.totalSentRequests += 1;
        }
      }
    },
    optimisticRemoveFriend: (state, action) => {
      const { friendId } = action.payload;
      
      // Remove from friends list
      state.friends = state.friends.filter(friend => friend._id !== friendId);
      state.totalFriends = Math.max(0, state.totalFriends - 1);
      
      // Update friendship status
      delete state.friendshipStatus[friendId];
    },
    revertOptimisticRemoveFriend: (state, action) => {
      const { friendId, friend } = action.payload;
      
      // Add back to friends
      if (friend) {
        const existingFriendIndex = state.friends.findIndex(f => f._id === friendId);
        if (existingFriendIndex === -1) {
          state.friends.push(friend);
          state.totalFriends += 1;
          
          // Update friendship status
          state.friendshipStatus[friendId] = "friends";
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch friends
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload.friends || [];
        state.totalFriends = action.payload.totalFriends || 0;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'object' 
          ? action.payload.message || 'Failed to fetch friends' 
          : action.payload;
      })
      
      // Fetch friend requests
      .addCase(fetchFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedRequests = action.payload.received || [];
        state.sentRequests = action.payload.sent || [];
        state.totalReceivedRequests = action.payload.totalReceived || 0;
        state.totalSentRequests = action.payload.totalSent || 0;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'object' 
          ? action.payload.message || 'Failed to fetch friend requests' 
          : action.payload;
      })
      
      // Send friend request
      .addCase(sendFriendRequest.pending, (state) => {
        state.friendRequestLoading = true;
        state.friendRequestError = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.friendRequestLoading = false;
        if (action.payload.friendRequest) {
          state.sentRequests.push(action.payload.friendRequest);
          state.totalSentRequests += 1;
        }
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.friendRequestLoading = false;
        state.friendRequestError = typeof action.payload === 'object' 
          ? action.payload.message || 'Failed to send friend request' 
          : action.payload;
      })
      
      // Accept friend request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.friendRequestLoading = true;
        state.friendRequestError = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.friendRequestLoading = false;
        
        state.receivedRequests = state.receivedRequests.filter(
          request => request._id !== action.payload.requestId
        );
        state.totalReceivedRequests = Math.max(0, state.totalReceivedRequests - 1);
        
        if (action.payload.friend) {
          // Kiểm tra xem bạn bè đã tồn tại trong danh sách chưa trước khi thêm mới
          const friendExists = state.friends.some(friend => friend._id === action.payload.friend._id);
          if (!friendExists) {
            state.friends.push(action.payload.friend);
            state.totalFriends += 1;
          }
          
          // Cập nhật friendshipStatus khi chấp nhận lời mời kết bạn
          if (action.payload.friend._id) {
            state.friendshipStatus[action.payload.friend._id] = "friends";
          }
        }
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.friendRequestLoading = false;
        state.friendRequestError = typeof action.payload === 'object' 
          ? action.payload.message || 'Failed to accept friend request' 
          : action.payload;
      })
      
      // Reject friend request
      .addCase(rejectFriendRequest.pending, (state) => {
        state.friendRequestLoading = true;
        state.friendRequestError = null;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.friendRequestLoading = false;
        
        state.receivedRequests = state.receivedRequests.filter(
          request => request._id !== action.payload.requestId
        );
        state.totalReceivedRequests = Math.max(0, state.totalReceivedRequests - 1);
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.friendRequestLoading = false;
        state.friendRequestError = typeof action.payload === 'object' 
          ? action.payload.message || 'Failed to reject friend request' 
          : action.payload;
      })
      
      // Cancel friend request
      .addCase(cancelFriendRequest.pending, (state) => {
        state.friendRequestLoading = true;
        state.friendRequestError = null;
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        state.friendRequestLoading = false;
        
        state.sentRequests = state.sentRequests.filter(
          request => request._id !== action.payload.requestId
        );
        state.totalSentRequests = Math.max(0, state.totalSentRequests - 1);
      })
      .addCase(cancelFriendRequest.rejected, (state, action) => {
        state.friendRequestLoading = false;
        state.friendRequestError = typeof action.payload === 'object' 
          ? action.payload.message || 'Failed to cancel friend request' 
          : action.payload;
      })
      
      // Remove friend
      .addCase(removeFriend.pending, (state) => {
        console.log("removeFriend.pending state");
        state.friendRequestLoading = true;
        state.friendRequestError = null;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        console.log("removeFriend.fulfilled with payload:", action.payload);
        state.friendRequestLoading = false;
        
        state.friends = state.friends.filter(
          friend => friend._id !== action.payload.friendId
        );
        console.log("After filter, friends list length:", state.friends.length);
        state.totalFriends = Math.max(0, state.totalFriends - 1);
        
        // Also update friendshipStatus to reflect the friend removal
        if (action.payload.friendId) {
          delete state.friendshipStatus[action.payload.friendId];
          console.log("Updated friendshipStatus, removed:", action.payload.friendId);
        }
      })
      .addCase(removeFriend.rejected, (state, action) => {
        console.log("removeFriend.rejected with error:", action.payload);
        state.friendRequestLoading = false;
        state.friendRequestError = typeof action.payload === 'object' 
          ? action.payload.message || 'Failed to remove friend' 
          : action.payload;
      })
      
      // Handle getFriendshipStatus
      .addCase(getFriendshipStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriendshipStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.friendshipStatus[action.payload.userId] = action.payload.status;
      })
      .addCase(getFriendshipStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'object' 
          ? action.payload.message || 'Failed to get friendship status' 
          : action.payload || 'Failed to get friendship status';
      })
      
      // Handle fetchUserFriends
      .addCase(fetchUserFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.userFriends[action.payload.userId] = {
          friends: action.payload.friends,
          totalFriends: action.payload.totalFriends
        };
      })
      .addCase(fetchUserFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'object' 
          ? action.payload.message || 'Failed to fetch user friends' 
          : action.payload || 'Failed to fetch user friends';
      });
  },
});

export const { 
  clearFriendError, 
  addFriendRequest, 
  addFriend, 
  removeFriendAction,
  optimisticAcceptRequest,
  revertOptimisticAccept,
  optimisticRejectRequest,
  revertOptimisticReject,
  optimisticCancelRequest,
  revertOptimisticCancel,
  optimisticRemoveFriend,
  revertOptimisticRemoveFriend
} = friendSlice.actions;

export default friendSlice.reducer; 