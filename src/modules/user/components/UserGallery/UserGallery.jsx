import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Typography, 
  CircularProgress, 
  ImageListItem, 
  ImageListItemBar, 
  IconButton,
  Box,
  Chip,
  Button
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

// API
import userApi from '../../api/userApi';

// Components
import MediaViewer from '../MediaViewer';

// Styles
import { 
  LoadingContainer, 
  EmptyContainer, 
  GalleryContainer, 
  StyledImageList,
  ImageItemContainer,
  FilterContainer,
  LoadMoreContainer,
  VideoOverlay
} from './UserGallery.styles';

const UserGallery = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // MediaViewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  
  const fetchMedia = async (pageNum = 1, filterType = 'all', reset = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const params = {
        page: pageNum,
        limit: 20,
        ...(filterType !== 'all' && { type: filterType })
      };

      const response = await userApi.getUserMedia(userId, params);
      
      if (response.success) {
        const newMedia = response.data.media || [];
        const pagination = response.data.pagination || {};
        
        if (reset || pageNum === 1) {
          setMedia(newMedia);
        } else {
          setMedia(prev => [...prev, ...newMedia]);
        }
        
        setHasMore(pageNum < pagination.pages);
        setPage(pageNum);
      } else {
        throw new Error(response.message || 'Failed to fetch media');
      }
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Không thể tải media files. Vui lòng thử lại.');
      if (pageNum === 1) {
        setMedia([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMedia(1, filter, true);
    }
  }, [userId, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchMedia(page + 1, filter, false);
    }
  };

  // MediaViewer handlers
  const handleMediaClick = (index) => {
    setCurrentMediaIndex(index);
    setViewerOpen(true);
  };

  const handleViewerClose = () => {
    setViewerOpen(false);
  };

  const handleIndexChange = (newIndex) => {
    setCurrentMediaIndex(newIndex);
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải media files...</Typography>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <EmptyContainer>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => fetchMedia(1, filter, true)}
          sx={{ mt: 2 }}
        >
          Thử lại
        </Button>
      </EmptyContainer>
    );
  }
  
  if (media.length === 0) {
    return (
      <EmptyContainer>
        <Typography variant="body1" color="text.secondary">
          {filter === 'all' 
            ? 'Người dùng chưa có media files nào.' 
            : `Người dùng chưa có ${filter === 'image' ? 'hình ảnh' : 'video'} nào.`
          }
        </Typography>
      </EmptyContainer>
    );
  }
  
  return (
    <GalleryContainer>
      {/* Filter Chips */}
      <FilterContainer>
        <Chip
          icon={<ImageIcon />}
          label="Tất cả"
          onClick={() => handleFilterChange('all')}
          color={filter === 'all' ? 'primary' : 'default'}
          variant={filter === 'all' ? 'filled' : 'outlined'}
          size="small"
        />
        <Chip
          icon={<ImageIcon />}
          label="Hình ảnh"
          onClick={() => handleFilterChange('image')}
          color={filter === 'image' ? 'primary' : 'default'}
          variant={filter === 'image' ? 'filled' : 'outlined'}
          size="small"
        />
        <Chip
          icon={<VideoLibraryIcon />}
          label="Video"
          onClick={() => handleFilterChange('video')}
          color={filter === 'video' ? 'primary' : 'default'}
          variant={filter === 'video' ? 'filled' : 'outlined'}
          size="small"
        />
      </FilterContainer>

      <StyledImageList>
        {media.map((item, index) => (
          <ImageListItem key={item.id}>
            <ImageItemContainer
              onClick={() => handleMediaClick(index)}
            >
              {item.type === 'video' ? (
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <video
                    src={item.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                  />
                  <VideoOverlay>
                    <PlayArrowIcon sx={{ color: 'white', fontSize: { xs: 24, sm: 32 } }} />
                  </VideoOverlay>
                </Box>
              ) : (
                <img
                  src={item.url}
                  alt={item.postContent || 'Media'}
                  loading="lazy"
                />
              )}
              <ImageListItemBar
                title={item.type === 'video' ? 'Video' : 'Hình ảnh'}
                subtitle={new Date(item.createdAt).toLocaleDateString('vi-VN')}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`info about ${item.type}`}
                  >
                    <InfoIcon />
                  </IconButton>
                }
                sx={{ opacity: 0.7, transition: 'opacity 0.3s' }}
              />
            </ImageItemContainer>
          </ImageListItem>
        ))}
      </StyledImageList>

      {/* Load More Button */}
      {hasMore && (
        <LoadMoreContainer>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={20} /> : null}
            size="large"
            sx={{ minWidth: { xs: '120px', sm: '140px' } }}
          >
            {loadingMore ? 'Đang tải...' : 'Tải thêm'}
          </Button>
        </LoadMoreContainer>
      )}

      {/* Media Viewer Modal */}
      <MediaViewer
        open={viewerOpen}
        onClose={handleViewerClose}
        mediaList={media}
        currentIndex={currentMediaIndex}
        onIndexChange={handleIndexChange}
      />
    </GalleryContainer>
  );
};

UserGallery.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserGallery;