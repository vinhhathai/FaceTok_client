import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch user's friends
export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/friend/list');
      return response.data.friends;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch friends');
    }
  }
);

// Thunk to fetch a specific user's friends by userId
export const fetchUserFriends = createAsyncThunk(
  'friends/fetchUserFriends',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/friend/list/${userId}`);
      return {
        userId,
        friends: response.data.friends
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user friends');
    }
  }
);

// Thunk to fetch friend requests
export const fetchFriendRequests = createAsyncThunk(
  'friends/fetchFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/friend/requests');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch friend requests');
    }
  }
);

// Thunk to check friendship status
export const checkFriendshipStatus = createAsyncThunk(
  'friends/checkFriendshipStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/friend/status/${userId}`);
      return {
        userId,
        status: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to check friendship status');
    }
  }
);

// Thunk to send friend request
export const sendFriendRequest = createAsyncThunk(
  'friends/sendFriendRequest',
  async (recipientId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/friend/request', { recipientId });
      return {
        ...response.data,
        recipientId
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to send friend request');
    }
  }
);

// Thunk to accept friend request
export const acceptFriendRequest = createAsyncThunk(
  'friends/acceptFriendRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/friend/accept', { requestId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to accept friend request');
    }
  }
);

// Thunk to reject friend request
export const rejectFriendRequest = createAsyncThunk(
  'friends/rejectFriendRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/friend/reject', { requestId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to reject friend request');
    }
  }
);

// Thunk to cancel friend request
export const cancelFriendRequest = createAsyncThunk(
  'friends/cancelFriendRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/friend/cancel', { requestId });
      return {
        requestId,
        ...response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel friend request');
    }
  }
);

// Thunk to remove friend
export const removeFriend = createAsyncThunk(
  'friends/removeFriend',
  async (friendId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/friend/remove', { friendId });
      return {
        friendId,
        ...response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove friend');
    }
  }
);

// Initial state
const initialState = {
  friends: [],
  userFriends: {}, // { userId: friends[] }
  friendRequests: {
    received: [],
    sent: []
  },
  friendshipStatus: {}, // { userId: { status, requestId } }
  loading: false,
  error: null,
  successMessage: null
};

// Create the slice
const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    clearFriendError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    // For real-time updates
    addFriend: (state, action) => {
      const { friend } = action.payload;
      if (!state.friends.some(f => f._id === friend._id)) {
        state.friends.push(friend);
      }
      
      // Remove from pending requests if it exists
      state.friendRequests.received = state.friendRequests.received.filter(
        req => req.sender._id !== friend._id
      );
      state.friendRequests.sent = state.friendRequests.sent.filter(
        req => req.recipient._id !== friend._id
      );
      
      // Update status
      state.friendshipStatus[friend._id] = { status: 'friends' };
    },
    removeFriendAction: (state, action) => {
      const { friendId } = action.payload;
      state.friends = state.friends.filter(friend => friend._id !== friendId);
      
      // Update status
      if (state.friendshipStatus[friendId]) {
        state.friendshipStatus[friendId] = { status: 'not_friends' };
      }
    },
    addFriendRequest: (state, action) => {
      const { request, isIncoming } = action.payload;
      if (isIncoming) {
        // Check if request already exists
        if (!state.friendRequests.received.some(req => req._id === request._id)) {
          state.friendRequests.received.push(request);
        }
        
        // Update status
        state.friendshipStatus[request.sender._id] = { 
          status: 'request_received', 
          requestId: request._id 
        };
      } else {
        // Check if request already exists
        if (!state.friendRequests.sent.some(req => req._id === request._id)) {
          state.friendRequests.sent.push(request);
        }
        
        // Update status
        state.friendshipStatus[request.recipient._id] = {
          status: 'request_sent',
          requestId: request._id
        };
      }
    },
    removeFriendRequest: (state, action) => {
      const { requestId, userId, status } = action.payload;
      
      // Remove from pending requests
      state.friendRequests.received = state.friendRequests.received.filter(
        req => req._id !== requestId
      );
      state.friendRequests.sent = state.friendRequests.sent.filter(
        req => req._id !== requestId
      );
      
      // Update status if userId is provided
      if (userId) {
        state.friendshipStatus[userId] = { status };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchFriends
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
        
        // Update friendship status for all friends
        action.payload.forEach(friend => {
          state.friendshipStatus[friend._id] = { status: 'friends' };
        });
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch friends';
      })
      
      // fetchUserFriends
      .addCase(fetchUserFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFriends.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, friends } = action.payload;
        state.userFriends[userId] = friends;
      })
      .addCase(fetchUserFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user friends';
      })
      
      // fetchFriendRequests
      .addCase(fetchFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = action.payload;
        
        // Update friendship status for all requests
        action.payload.received.forEach(request => {
          state.friendshipStatus[request.sender._id] = { 
            status: 'request_received', 
            requestId: request._id 
          };
        });
        
        action.payload.sent.forEach(request => {
          state.friendshipStatus[request.recipient._id] = { 
            status: 'request_sent',
            requestId: request._id 
          };
        });
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch friend requests';
      })
      
      // checkFriendshipStatus
      .addCase(checkFriendshipStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        state.friendshipStatus[userId] = status;
      })
      
      // sendFriendRequest
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        // If request was accepted (mutual friend request)
        if (action.payload.message === 'Friend request accepted') {
          const newFriend = {
            _id: action.payload.friendRequest.sender.toString() === action.payload.recipientId ? 
                action.payload.friendRequest.recipient :
                action.payload.friendRequest.sender
          };
          
          // Add to friends list if not there
          if (!state.friends.some(f => f._id === newFriend._id)) {
            state.friends.push(newFriend);
          }
          
          // Update status
          state.friendshipStatus[newFriend._id] = { status: 'friends' };
        } else {
          // Regular friend request was sent
          const requestId = action.payload.friendRequest._id;
          const recipientId = action.payload.recipientId;
          
          // Update status
          state.friendshipStatus[recipientId] = { 
            status: 'request_sent',
            requestId 
          };
          
          // Add to sent requests
          state.friendRequests.sent.push({
            _id: requestId,
            recipient: {
              _id: recipientId
            }
          });
        }
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send friend request';
      })
      
      // acceptFriendRequest
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        const request = action.payload.friendRequest;
        const senderId = request.sender;
        
        // Add to friends list if not already there
        if (!state.friends.some(f => f._id === senderId)) {
          state.friends.push({ _id: senderId });
        }
        
        // Remove from pending requests
        state.friendRequests.received = state.friendRequests.received.filter(
          req => req._id !== request._id
        );
        
        // Update status
        state.friendshipStatus[senderId] = { status: 'friends' };
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to accept friend request';
      })
      
      // rejectFriendRequest
      .addCase(rejectFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        const request = action.payload.friendRequest;
        const senderId = request.sender;
        
        // Remove from pending requests
        state.friendRequests.received = state.friendRequests.received.filter(
          req => req._id !== request._id
        );
        
        // Update status
        state.friendshipStatus[senderId] = { 
          status: 'request_rejected',
          requestId: request._id 
        };
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to reject friend request';
      })
      
      // cancelFriendRequest
      .addCase(cancelFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        const requestId = action.payload.requestId;
        
        // Find the request to get recipient ID
        const request = state.friendRequests.sent.find(req => req._id === requestId);
        
        if (request) {
          // Update status
          state.friendshipStatus[request.recipient._id] = { 
            status: 'not_friends' 
          };
          
          // Remove from sent requests
          state.friendRequests.sent = state.friendRequests.sent.filter(
            req => req._id !== requestId
          );
        }
      })
      .addCase(cancelFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to cancel friend request';
      })
      
      // removeFriend
      .addCase(removeFriend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        
        const { friendId } = action.payload;
        
        // Remove from friends list
        state.friends = state.friends.filter(friend => friend._id !== friendId);
        
        // Update status
        state.friendshipStatus[friendId] = { status: 'not_friends' };
      })
      .addCase(removeFriend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove friend';
      });
  }
});

export const { 
  clearFriendError, 
  clearSuccessMessage,
  addFriend,
  removeFriendAction,
  addFriendRequest,
  removeFriendRequest
} = friendSlice.actions;

export default friendSlice.reducer; 