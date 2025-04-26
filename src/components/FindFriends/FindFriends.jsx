import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import './FindFriends.css';
import { searchUsers } from '../../redux/features/userSlice';
import { sendFriendRequest, getFriendshipStatus } from '../../redux/features/friendSlice';
import defaultAvatar from '../../assets/images/default-avatar.png';

const FindFriends = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, searchLoading, searchError } = useSelector((state) => state.users);
  const { friendshipStatuses, sendRequestLoading } = useSelector((state) => state.friends);
  
  // Debounce the search to avoid making too many API calls
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim().length > 0) {
        dispatch(searchUsers(query));
      }
    }, 500),
    [dispatch]
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSendRequest = (userId) => {
    dispatch(sendFriendRequest(userId))
      .then(() => {
        dispatch(getFriendshipStatus(userId));
      });
  };

  useEffect(() => {
    // Get friendship status for all users in search results
    if (searchResults && searchResults.length > 0) {
      searchResults.forEach(user => {
        dispatch(getFriendshipStatus(user._id));
      });
    }
  }, [searchResults, dispatch]);

  const renderActionButton = (userId) => {
    const status = friendshipStatuses[userId];
    
    if (!status) {
      return (
        <button 
          className="friend-button"
          onClick={() => handleSendRequest(userId)}
          disabled={sendRequestLoading}
        >
          Add Friend
        </button>
      );
    } else if (status === 'pending') {
      return (
        <button className="friend-button disabled" disabled>
          Request Sent
        </button>
      );
    } else if (status === 'friends') {
      return (
        <button className="friend-button disabled" disabled>
          Friends
        </button>
      );
    } else if (status === 'received') {
      return (
        <button className="friend-button disabled" disabled>
          Respond to Request
        </button>
      );
    }
  };

  return (
    <div className="find-friends-container">
      <div className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search for friends by name or email"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {searchLoading && <div className="loading">Searching...</div>}

      {searchError && <div className="error">{typeof searchError === 'object' ? searchError.message || 'An error occurred' : searchError}</div>}

      {!searchLoading && searchResults && searchResults.length === 0 && searchQuery && (
        <div className="no-results">No users found matching "{searchQuery}"</div>
      )}

      <div className="search-results">
        {searchResults && searchResults.map(user => (
          <div key={user._id} className="user-item">
            <div className="user-info">
              <img 
                src={user.avatar || defaultAvatar} 
                alt={`${user.fullName || 'User'}'s avatar`}
                className="user-avatar"
                onError={(e) => { e.target.src = defaultAvatar }}
              />
              <div>
                <h3>{user.fullName || 'User'}</h3>
                <p>{user.email}</p>
              </div>
            </div>
            {renderActionButton(user._id)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindFriends; 