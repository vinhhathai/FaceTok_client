import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab, Grid, Paper, InputBase, IconButton, CircularProgress, Alert, Fade } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import { useDebounce } from '../../../../shared/hooks/useDebounce';

// Components
import FriendCard from '../../components/FriendCard';
import EmptyState from '../../../../shared/components/EmptyState';

// API
import { 
  getFriends, 
  getReceivedFriendRequests, 
  getSentFriendRequests,
  searchFriends
} from '../../api/friendAPI';

// Utils
import { handleApiError } from '../../../../shared/utils/errorHandlers';

const TABS = {
  FRIENDS: 0,
  RECEIVED_REQUESTS: 1,
  SENT_REQUESTS: 2,
};

const FriendsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(TABS.FRIENDS);
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  
  const [isLoading, setIsLoading] = useState({
    friends: true,
    receivedRequests: false,
    sentRequests: false,
    search: false
  });
  const [error, setError] = useState(null);

  // Fetch friends list on component mount
  useEffect(() => {
    fetchFriends();
  }, []);

  // Load appropriate data when tab changes
  useEffect(() => {
    if (activeTab === TABS.RECEIVED_REQUESTS && receivedRequests.length === 0 && !isLoading.receivedRequests) {
      fetchReceivedRequests();
    } else if (activeTab === TABS.SENT_REQUESTS && sentRequests.length === 0 && !isLoading.sentRequests) {
      fetchSentRequests();
    }
  }, [activeTab]);

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) {
      performSearch(debouncedSearchQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  // Fetch friends list
  const fetchFriends = async () => {
    setError(null);
    setIsLoading(prev => ({ ...prev, friends: true }));
    
    try {
      const response = await getFriends();
      if (response.success) {
        setFriends(response.data.friends || []);
      } else {
        handleError('Không thể tải danh sách bạn bè');
      }
    } catch (err) {
      handleApiError(err, 'Đã xảy ra lỗi khi tải danh sách bạn bè');
    } finally {
      setIsLoading(prev => ({ ...prev, friends: false }));
    }
  };

  // Fetch received friend requests
  const fetchReceivedRequests = async () => {
    setError(null);
    setIsLoading(prev => ({ ...prev, receivedRequests: true }));
    
    try {
      const response = await getReceivedFriendRequests();
      if (response.success) {
        setReceivedRequests(response.data.requests || []);
      } else {
        handleError('Không thể tải lời mời kết bạn');
      }
    } catch (err) {
      handleApiError(err, 'Đã xảy ra lỗi khi tải lời mời kết bạn');
    } finally {
      setIsLoading(prev => ({ ...prev, receivedRequests: false }));
    }
  };

  // Fetch sent friend requests
  const fetchSentRequests = async () => {
    setError(null);
    setIsLoading(prev => ({ ...prev, sentRequests: true }));
    
    try {
      const response = await getSentFriendRequests();
      if (response.success) {
        setSentRequests(response.data.requests || []);
      } else {
        handleError('Không thể tải lời mời đã gửi');
      }
    } catch (err) {
      handleApiError(err, 'Đã xảy ra lỗi khi tải lời mời đã gửi');
    } finally {
      setIsLoading(prev => ({ ...prev, sentRequests: false }));
    }
  };

  // Perform search
  const performSearch = async (query) => {
    if (!query || query.trim().length < 2) return;

    setIsLoading(prev => ({ ...prev, search: true }));
    
    try {
      const response = await searchFriends(query.trim());
      if (response.success) {
        setSearchResults(response.data.friends || []);
      } else {
        console.error('Search failed:', response.error);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, search: false }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleError = (message) => {
    setError(message);
  };

  // Handle friend request actions (accept/reject/unfriend)
  const handleActionComplete = (action, id) => {
    if (action === 'accepted' || action === 'rejected') {
      // Xóa yêu cầu khỏi danh sách nhận
      setReceivedRequests(prev => prev.filter(request => request.id !== id));
      
      // Nếu chấp nhận, thêm vào danh sách bạn bè và tải lại danh sách
      if (action === 'accepted') {
        fetchFriends();
      }
    } else if (action === 'removed') {
      // Xóa khỏi danh sách bạn bè
      setFriends(prev => prev.filter(friend => friend.id !== id));
    }
  };

  // Render friend list or appropriate empty state
  const renderFriendsList = () => {
    // Nếu đang tìm kiếm, hiển thị kết quả tìm kiếm
    if (searchQuery.trim().length >= 2) {
      return renderSearchResults();
    }

    // Handle different tabs
    switch (activeTab) {
      case TABS.FRIENDS:
        if (isLoading.friends) {
          return renderLoadingState();
        }
        
        return friends.length > 0 ? (
          <Grid container spacing={2}>
            {friends.map((friend) => (
              <Grid item xs={12} sm={6} md={4} key={friend.id}>
                <FriendCard 
                  friend={friend} 
                  type="FRIEND"
                  onActionComplete={handleActionComplete}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState 
            icon="people"
            title="Chưa có bạn bè" 
            description="Bạn chưa có kết bạn với ai. Hãy tìm kiếm để thêm bạn bè!"
          />
        );

      case TABS.RECEIVED_REQUESTS:
        if (isLoading.receivedRequests) {
          return renderLoadingState();
        }
        
        return receivedRequests.length > 0 ? (
          <Grid container spacing={2}>
            {receivedRequests.map((request) => (
              <Grid item xs={12} sm={6} md={4} key={request.id}>
                <FriendCard 
                  friend={{
                    id: request.sender.id,
                    fullName: request.sender.fullName,
                    email: request.sender.email,
                    profilePicture: request.sender.profilePicture
                  }}
                  type="REQUEST_RECEIVED"
                  requestId={request.id}
                  onActionComplete={handleActionComplete}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState 
            icon="notifications"
            title="Không có lời mời kết bạn" 
            description="Bạn hiện không có lời mời kết bạn nào."
          />
        );

      case TABS.SENT_REQUESTS:
        if (isLoading.sentRequests) {
          return renderLoadingState();
        }
        
        return sentRequests.length > 0 ? (
          <Grid container spacing={2}>
            {sentRequests.map((request) => (
              <Grid item xs={12} sm={6} md={4} key={request.id}>
                <FriendCard 
                  friend={{
                    id: request.recipient.id,
                    fullName: request.recipient.fullName,
                    profilePicture: request.recipient.profilePicture
                  }}
                  type="REQUEST_SENT"
                  requestId={request.id}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState 
            icon="send"
            title="Không có lời mời đã gửi" 
            description="Bạn chưa gửi lời mời kết bạn nào."
          />
        );

      default:
        return <EmptyState title="Không có dữ liệu" />;
    }
  };

  // Render search results
  const renderSearchResults = () => {
    if (isLoading.search) {
      return renderLoadingState();
    }

    if (searchResults.length === 0) {
      return (
        <EmptyState 
          icon="search"
          title="Không tìm thấy kết quả" 
          description={`Không tìm thấy kết quả cho "${searchQuery}"`}
        />
      );
    }

    return (
      <>
        <Box mb={2}>
          <Typography variant="subtitle1">
            Kết quả tìm kiếm cho "{searchQuery}"
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {searchResults.map((friend) => (
            <Grid item xs={12} sm={6} md={4} key={friend.id}>
              <FriendCard 
                friend={friend}
                type={friend.relationshipStatus || "NONE"}
                requestId={friend.requestId}
                onActionComplete={handleActionComplete}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  // Render loading state
  const renderLoadingState = () => (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      height="200px"
      width="100%"
    >
      <CircularProgress />
    </Box>
  );
  
  return (
    <Container maxWidth="md">
      <Box py={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý bạn bè
        </Typography>
        
        {/* Thanh tìm kiếm */}
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            mb: 3
          }}
          elevation={1}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm bạn bè..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <IconButton 
              sx={{ p: '10px' }} 
              aria-label="clear" 
              onClick={clearSearch}
            >
              <ClearIcon />
            </IconButton>
          )}
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        
        {/* Tab điều hướng */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Bạn bè" />
          <Tab label="Lời mời nhận được" />
          <Tab label="Lời mời đã gửi" />
        </Tabs>
        
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Fade>
        )}
        
        {/* Hiển thị danh sách */}
        {renderFriendsList()}
      </Box>
    </Container>
  );
};

export default FriendsPage; 