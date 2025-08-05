import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  TextField, 
  InputAdornment, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { searchFriendsThunk, deleteFriend, resetSearchResults } from '@friend/redux';
import { SearchContainer, SearchResults, SearchResultCard, NoResults } from './FriendSearch.styles';

// Thời gian debounce: 500ms
const DEBOUNCE_DELAY = 500;

function FriendSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults } = useSelector((state) => state.friend);
  
  const { data: friends, pagination, isLoading, error } = searchResults;

  // Xử lý debounce cho searchTerm
  useEffect(() => {
    // Đặt một timer để cập nhật debouncedSearchTerm sau DEBOUNCE_DELAY
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    // Cleanup timer mỗi khi searchTerm thay đổi
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Theo dõi sự thay đổi của debouncedSearchTerm để thực hiện tìm kiếm
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  // Clean up search results when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetSearchResults());
    };
  }, [dispatch]);

  // Hàm tìm kiếm được tách riêng để tái sử dụng
  const performSearch = useCallback((query, page = 1) => {
    if (!query.trim()) return;
    
    dispatch(searchFriendsThunk({
      query,
      page
    }));
  }, [dispatch]);

  // Xử lý khi form submit (khi người dùng nhấn Enter)
  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      performSearch(searchTerm, 1);
    }
  };

  // Xử lý khi nhập tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý chuyển trang
  const handlePageChange = (event, value) => {
    performSearch(searchTerm, value);
  };

  const handleDeleteFriend = (friendId) => {
    if (window.confirm('Bạn có chắc muốn xóa người bạn này?')) {
      dispatch(deleteFriend(friendId));
    }
  };

  const handleMessageFriend = (friendId) => {
    navigate(`/messages/`, { state: { friendId } });
  };

  const navigateToProfile = (userId) => {
    navigate(`/profile/`, { state: { userId } });
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm bạn bè..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: isLoading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null
          }}
        />
      </form>

      {error && (
        <Box sx={{ mt: 2, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      {friends.length > 0 ? (
        <SearchResults>
          <List>
            {friends.map((friend) => (
              <SearchResultCard 
                key={friend.id || friend._id} 
                elevation={1}
                sx={{ cursor: 'pointer' }}
                onClick={(e) => {
                  // Only navigate if the click was not on the button
                  if (!e.defaultPrevented) {
                    navigateToProfile(friend.id || friend._id);
                  }
                }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar 
                      alt={friend.fullName} 
                      src={friend.profilePicture || '/assets/default-avatar.png'} 
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.fullName}
                    secondary={friend.email || friend.bio || 'Người dùng FaceTok'}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      edge="end" 
                      aria-label="message" 
                      onClick={(e) => {
                        e.preventDefault(); // Prevent card click event
                        handleMessageFriend(friend.id || friend._id);
                      }}
                      color="primary"
                    >
                      <MessageIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={(e) => {
                        e.preventDefault(); // Prevent card click event
                        handleDeleteFriend(friend.id || friend._id);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              </SearchResultCard>
            ))}
          </List>
          
          {pagination && pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
              <Pagination 
                count={pagination.totalPages} 
                page={pagination.page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </SearchResults>
      ) : debouncedSearchTerm && !isLoading && (
        <NoResults>
          <Typography>Không tìm thấy bạn bè nào phù hợp</Typography>
        </NoResults>
      )}
    </SearchContainer>
  );
}

export default FriendSearch; 