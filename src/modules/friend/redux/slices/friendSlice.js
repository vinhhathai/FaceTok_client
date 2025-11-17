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
} from '@friend/api/friendAPI';

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
      const payload = {
        message: error?.message || 'Không thể chấp nhận lời mời',
        code: error?.code,
        status: error?.status || 500,
      };
      return rejectWithValue(payload);
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
      const payload = {
        message: error?.message || 'Không thể từ chối lời mời',
        code: error?.code,
        status: error?.status || 500,
      };
      return rejectWithValue(payload);
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

// Initialize state - chỉ giữ data states
const initialState = {
  friends: [],
  receivedRequests: [],
  sentRequests: [],
  searchResults: {
    data: [],
    pagination: {
      page: 1,
      totalPages: 1,
      totalCount: 0
    }
  }
};

// Create slice
const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults.data = [];
      state.searchResults.pagination = {
        page: 1,
        totalPages: 1,
        totalCount: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Friends
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload?.friends || [];
      })
      
      // Fetch Received Friend Requests
      .addCase(fetchReceivedFriendRequests.fulfilled, (state, action) => {
        state.receivedRequests = action.payload?.requests || [];
      })
      
      // Fetch Sent Friend Requests
      .addCase(fetchSentFriendRequests.fulfilled, (state, action) => {
        state.sentRequests = action.payload?.requests || [];
      })
      
      // Search Friends
      .addCase(searchFriendsThunk.fulfilled, (state, action) => {
        state.searchResults.data = action.payload?.data?.friends || [];
        
        // Update pagination data
        if (action.payload?.data?.pagination) {
          state.searchResults.pagination = action.payload.data.pagination;
        }
      })
      
      // Send Friend Request
      .addCase(sendNewFriendRequest.fulfilled, (state) => {
        // Không cần thay đổi state, chỉ cần toast success
      })
      
      // Accept Request
      .addCase(acceptRequest.fulfilled, (state, action) => {
        // Update receivedRequests list by removing the accepted request
        state.receivedRequests = state.receivedRequests.filter(
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
          state.friends.push(newFriend);
        }
      })
      
      // Reject Request
      .addCase(rejectRequest.fulfilled, (state, action) => {
        // Update receivedRequests list by removing the rejected request
        state.receivedRequests = state.receivedRequests.filter(
          request => request.id !== action.meta.arg
        );
      })
      
      // Remove Friend
      .addCase(deleteFriend.fulfilled, (state, action) => {
        // Update friends list by removing the deleted friend
        state.friends = state.friends.filter(
          friend => friend.id !== action.meta.arg
        );
      });
  }
});

export const { resetSearchResults } = friendSlice.actions;

export default friendSlice.reducer;