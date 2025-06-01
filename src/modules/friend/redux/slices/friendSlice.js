import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getFriends,
  getReceivedFriendRequests,
  getSentFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  searchFriends
} from '../../api/friendAPI';

// Create async thunks
export const fetchFriends = createAsyncThunk(
  'friend/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFriends();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch friends');
    }
  }
);

export const fetchReceivedFriendRequests = createAsyncThunk(
  'friend/fetchReceivedFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getReceivedFriendRequests();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch received friend requests');
    }
  }
);

export const fetchSentFriendRequests = createAsyncThunk(
  'friend/fetchSentFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSentFriendRequests();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch sent friend requests');
    }
  }
);

export const searchFriendsThunk = createAsyncThunk(
  'friend/searchFriends',
  async ({ query, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await searchFriends(query, page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search friends');
    }
  }
);

export const sendNewFriendRequest = createAsyncThunk(
  'friend/sendFriendRequest',
  async (recipientId, { rejectWithValue }) => {
    try {
      const response = await sendFriendRequest(recipientId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to send friend request');
    }
  }
);

export const acceptRequest = createAsyncThunk(
  'friend/acceptRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await acceptFriendRequest(requestId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to accept friend request');
    }
  }
);

export const rejectRequest = createAsyncThunk(
  'friend/rejectRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await rejectFriendRequest(requestId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject friend request');
    }
  }
);

export const deleteFriend = createAsyncThunk(
  'friend/deleteFriend',
  async (friendId, { rejectWithValue }) => {
    try {
      const response = await removeFriend(friendId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove friend');
    }
  }
);

// Initialize state
const initialState = {
  friends: {
    data: [],
    isLoading: false,
    error: null
  },
  receivedRequests: {
    data: [],
    isLoading: false, 
    error: null
  },
  sentRequests: {
    data: [],
    isLoading: false,
    error: null
  },
  searchResults: {
    data: [],
    pagination: {
      page: 1,
      totalPages: 1,
      totalCount: 0
    },
    isLoading: false,
    error: null
  },
  operations: {
    isLoading: false,
    success: false,
    error: null
  }
};

// Create slice
const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    resetOperationStatus: (state) => {
      state.operations.isLoading = false;
      state.operations.success = false;
      state.operations.error = null;
    },
    resetSearchResults: (state) => {
      state.searchResults.data = [];
      state.searchResults.pagination = {
        page: 1,
        totalPages: 1,
        totalCount: 0
      };
      state.searchResults.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Friends
      .addCase(fetchFriends.pending, (state) => {
        state.friends.isLoading = true;
        state.friends.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends.isLoading = false;
        state.friends.data = action.payload?.friends || [];
        state.friends.error = null;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.friends.isLoading = false;
        state.friends.error = action.payload;
      })
      
      // Fetch Received Friend Requests
      .addCase(fetchReceivedFriendRequests.pending, (state) => {
        state.receivedRequests.isLoading = true;
        state.receivedRequests.error = null;
      })
      .addCase(fetchReceivedFriendRequests.fulfilled, (state, action) => {
        state.receivedRequests.isLoading = false;
        state.receivedRequests.data = action.payload?.requests || [];
        state.receivedRequests.error = null;
      })
      .addCase(fetchReceivedFriendRequests.rejected, (state, action) => {
        state.receivedRequests.isLoading = false;
        state.receivedRequests.error = action.payload;
      })
      
      // Fetch Sent Friend Requests
      .addCase(fetchSentFriendRequests.pending, (state) => {
        state.sentRequests.isLoading = true;
        state.sentRequests.error = null;
      })
      .addCase(fetchSentFriendRequests.fulfilled, (state, action) => {
        state.sentRequests.isLoading = false;
        state.sentRequests.data = action.payload?.requests || [];
        state.sentRequests.error = null;
      })
      .addCase(fetchSentFriendRequests.rejected, (state, action) => {
        state.sentRequests.isLoading = false;
        state.sentRequests.error = action.payload;
      })
      
      // Search Friends
      .addCase(searchFriendsThunk.pending, (state) => {
        state.searchResults.isLoading = true;
        state.searchResults.error = null;
      })
      .addCase(searchFriendsThunk.fulfilled, (state, action) => {
        state.searchResults.isLoading = false;
        state.searchResults.data = action.payload?.data?.friends || [];
        
        // Update pagination data
        if (action.payload?.data?.pagination) {
          state.searchResults.pagination = action.payload.data.pagination;
        }
        
        state.searchResults.error = null;
      })
      .addCase(searchFriendsThunk.rejected, (state, action) => {
        state.searchResults.isLoading = false;
        state.searchResults.error = action.payload;
      })
      
      // Send Friend Request
      .addCase(sendNewFriendRequest.pending, (state) => {
        state.operations.isLoading = true;
        state.operations.error = null;
      })
      .addCase(sendNewFriendRequest.fulfilled, (state) => {
        state.operations.isLoading = false;
        state.operations.success = true;
      })
      .addCase(sendNewFriendRequest.rejected, (state, action) => {
        state.operations.isLoading = false;
        state.operations.error = action.payload;
      })
      
      // Accept Request
      .addCase(acceptRequest.pending, (state) => {
        state.operations.isLoading = true;
        state.operations.error = null;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.operations.isLoading = false;
        state.operations.success = true;
        
        // Update receivedRequests list by removing the accepted request
        state.receivedRequests.data = state.receivedRequests.data.filter(
          request => request.id !== action.meta.arg
        );
        
        // If the API returns the new friend, add it to the friends list
        if (action.payload?.data?.friendRequest?.sender) {
          const newFriend = {
            id: action.payload.data.friendRequest.sender.id,
            fullName: action.payload.data.friendRequest.sender.fullName,
            profilePicture: action.payload.data.friendRequest.sender.profilePicture,
            bio: action.payload.data.friendRequest.sender.bio || ''
          };
          state.friends.data.push(newFriend);
        }
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.operations.isLoading = false;
        state.operations.error = action.payload;
      })
      
      // Reject Request
      .addCase(rejectRequest.pending, (state) => {
        state.operations.isLoading = true;
        state.operations.error = null;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.operations.isLoading = false;
        state.operations.success = true;
        
        // Update receivedRequests list by removing the rejected request
        state.receivedRequests.data = state.receivedRequests.data.filter(
          request => request.id !== action.meta.arg
        );
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.operations.isLoading = false;
        state.operations.error = action.payload;
      })
      
      // Remove Friend
      .addCase(deleteFriend.pending, (state) => {
        state.operations.isLoading = true;
        state.operations.error = null;
      })
      .addCase(deleteFriend.fulfilled, (state, action) => {
        state.operations.isLoading = false;
        state.operations.success = true;
        
        // Update friends list by removing the deleted friend
        state.friends.data = state.friends.data.filter(
          friend => friend.id !== action.meta.arg
        );
      })
      .addCase(deleteFriend.rejected, (state, action) => {
        state.operations.isLoading = false;
        state.operations.error = action.payload;
      });
  }
});

export const { resetOperationStatus, resetSearchResults } = friendSlice.actions;

export default friendSlice.reducer; 