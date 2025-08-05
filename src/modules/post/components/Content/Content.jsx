import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Button 
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { ContentContainer, PostsContainer } from './Content.styles';
import { fetchTimelinePosts } from "@post/redux";
import { toast } from 'react-toastify';

function Content() {
  const dispatch = useDispatch();
  const { 
    timelinePosts, 
    currentPage, 
    totalPages
  } = useSelector(state => state.posts);

  // Local states thay vì Redux loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch initial posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await dispatch(fetchTimelinePosts({ page: 1, limit: 10 })).unwrap();
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError('Không thể tải bài viết');
        toast.error('Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [dispatch]);

  // Handle loading more posts
  const handleLoadMore = async () => {
    if (currentPage < totalPages && !loading && !loadingMore) {
      setLoadingMore(true);
      setError(null);
      
      try {
        await dispatch(fetchTimelinePosts({ page: currentPage + 1, limit: 10 })).unwrap();
      } catch (error) {
        console.error('Failed to load more posts:', error);
        setError('Không thể tải thêm bài viết');
        toast.error('Không thể tải thêm bài viết');
      } finally {
        setLoadingMore(false);
      }
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await dispatch(fetchTimelinePosts({ page: 1, limit: 10 })).unwrap();
      toast.success('Đã làm mới trang');
    } catch (error) {
      console.error('Failed to refresh posts:', error);
      setError('Không thể làm mới bài viết');
      toast.error('Không thể làm mới bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContainer>
      {/* CreatePost placeholder - to be implemented */}
      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
        <Typography variant="body1">Chia sẻ cảm nghĩ của bạn...</Typography>
      </Box>
      
      {/* Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={loading}
          size="small"
        >
          Làm mới
        </Button>
      </Box>
      
      {/* Error state */}
      {error && (
        <Box sx={{ textAlign: 'center', my: 3, p: 2, bgcolor: '#FFF4F4', borderRadius: 1 }}>
          <Typography color="error" variant="body1">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            sx={{ mt: 1 }}
            onClick={handleRefresh}
          >
            Thử lại
          </Button>
        </Box>
      )}
      
      {/* Loading state (first load) */}
      {loading && timelinePosts.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Empty state */}
      {!loading && timelinePosts.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', my: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Không có bài viết nào để hiển thị.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hãy tạo bài viết đầu tiên hoặc kết bạn với người khác!
          </Typography>
        </Box>
      )}
      
      {/* Posts list - to be populated */}
      <PostsContainer>
        {/* Posts will be inserted here */}
        {timelinePosts.map(post => (
          <div key={post.id}>
            {/* Post component will go here */}
          </div>
        ))}
      </PostsContainer>
      
      {/* Load more button */}
      {!loading && timelinePosts.length > 0 && currentPage < totalPages && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={handleLoadMore} 
            disabled={loadingMore}
          >
            {loadingMore ? 'Đang tải...' : 'Tải thêm'}
          </Button>
        </Box>
      )}
      
      {/* Loading more indicator */}
      {loadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="body2">Đang tải thêm bài viết...</Typography>
        </Box>
      )}
    </ContentContainer>
  );
}

export default Content; 