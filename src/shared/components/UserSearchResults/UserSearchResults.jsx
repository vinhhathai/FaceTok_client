import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const UserSearchResults = ({ 
  users = [], 
  loading = false,
  loadingMore = false,
  error = null, 
  onSelectUser, 
  searchQuery = '',
  totalResults = 0,
  hasMore = false,
  onLoadMore
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const isFirstRender = useRef(true);

  // Effect for smooth scrolling when loading more results
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (loadingMore && scrollRef.current) {
      // Don't scroll when first loading
      return;
    }
    
    if (!loading && !loadingMore && users.length > 0 && scrollRef.current) {
      const lastItem = scrollRef.current.lastElementChild;
      if (lastItem && users.length > 10) {
        lastItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [users, loading, loadingMore]);

  const handleUserClick = (userId) => {
    // Close the search results dropdown
    if (onSelectUser) {
      onSelectUser();
    }
    // Navigate to user profile using ObjectId-only identifier
    navigate('/profile', { state: { userId } });
  };

  // Common styling for the dropdown container
  const dropdownStyles = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    maxHeight: 350,
    overflow: 'auto',
    mt: 0.5,
    zIndex: 9999,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    backgroundColor: 'background.paper'
  };

  // Display loading state
  if (loading && users.length === 0) {
    return (
      <Paper elevation={3} sx={dropdownStyles}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      </Paper>
    );
  }

  // Display error state
  if (error) {
    return (
      <Paper elevation={3} sx={dropdownStyles}>
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography variant="body2">Lỗi tải kết quả. Vui lòng thử lại.</Typography>
        </Box>
      </Paper>
    );
  }

  // Display empty search results
  if (users.length === 0 && searchQuery) {
    return (
      <Paper elevation={3} sx={dropdownStyles}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
          <SearchIcon color="disabled" />
          <Typography variant="body2" color="text.secondary">Không tìm thấy người dùng nào cho từ khóa "{searchQuery}"</Typography>
        </Box>
      </Paper>
    );
  }

  // Display search results
  if (users.length > 0) {
    return (
      <Paper elevation={3} sx={dropdownStyles}>
        {/* Results count header */}
        <Box sx={{ 
          px: 2, 
          py: 1, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            Tìm thấy {totalResults} người dùng
          </Typography>
        
        </Box>
        
        {/* User list */}
        <List sx={{ p: 0 }} ref={scrollRef}>
          {users.map((user, index) => (
            <React.Fragment key={user._id || user.id}>
              <ListItem 
                button 
                onClick={() => handleUserClick(String(user?._id || user?.id))}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={user.profilePicture || undefined} 
                    alt={user.fullName}
                  >
                    {!user.profilePicture && (user.fullName?.charAt(0) || <PersonIcon />)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Typography variant="body1" fontWeight="medium">
                      {user.fullName}
                    </Typography>
                  }
                  secondary={user.bio ? (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {user.bio}
                    </Typography>
                  ) : null}
                />
              </ListItem>
              {index < users.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
          
          {/* Load more button */}
          {hasMore && (
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
              <Button 
                size="small" 
                color="primary" 
                onClick={onLoadMore}
                disabled={loadingMore}
                endIcon={loadingMore ? <CircularProgress size={16} /> : <KeyboardArrowDownIcon />}
                sx={{ textTransform: 'none' }}
              >
                {loadingMore ? 'Đang tải...' : 'Xem thêm'}
              </Button>
            </Box>
          )}
        </List>
      </Paper>
    );
  }

  return null;
};

export default UserSearchResults;