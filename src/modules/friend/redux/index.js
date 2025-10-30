import friendReducer, {
  fetchFriends,
  fetchReceivedFriendRequests,
  fetchSentFriendRequests,
  searchFriendsThunk,
  sendNewFriendRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
  resetSearchResults
} from './slices/friendSlice';

// Export reducer
export const reducer = { friend: friendReducer };

// Export actions
export const actions = {
  fetchFriends,
  fetchReceivedFriendRequests,
  fetchSentFriendRequests,
  searchFriendsThunk,
  sendNewFriendRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
  resetSearchResults
};

// Export directly
export {
  fetchFriends,
  fetchReceivedFriendRequests,
  fetchSentFriendRequests,
  searchFriendsThunk,
  sendNewFriendRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
  resetSearchResults
};

// Default export for friendReducer
export default friendReducer; 