import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimelinePosts } from "../../redux/features/postSlice";
import CreatePost from "../CreatingPost/CreatingPost";
import Post from "../Post/Post";
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Button 
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import './Content.css';

function Content() {
  const dispatch = useDispatch();
  const { 
    timelinePosts, 
    currentPage, 
    totalPages, 
    isLoading, 
    error, 
    createPostStatus 
  } = useSelector((state) => state.posts);

  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch initial posts when component mounts
  useEffect(() => {
    dispatch(fetchTimelinePosts({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Refresh timeline when a new post is created
  useEffect(() => {
    if (createPostStatus === 'succeeded') {
      // If a new post is created, refresh the timeline
      dispatch(fetchTimelinePosts({ page: 1, limit: 10 }));
    }
  }, [createPostStatus, dispatch]);

  // Handle loading more posts
  const handleLoadMore = async () => {
    if (currentPage < totalPages && !isLoading && !loadingMore) {
      setLoadingMore(true);
      await dispatch(fetchTimelinePosts({ page: currentPage + 1, limit: 10 }));
      setLoadingMore(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchTimelinePosts({ page: 1, limit: 10 }));
  };

  return (
    <Box className="content-container" sx={{ maxWidth: 700, mx: 'auto', pb: 4 }}>
      <CreatePost />
      
      {/* Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={isLoading}
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
      {isLoading && timelinePosts.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Empty state */}
      {!isLoading && timelinePosts.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', my: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Không có bài viết nào để hiển thị.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hãy tạo bài viết đầu tiên hoặc kết bạn với người khác!
          </Typography>
        </Box>
      )}
      
      {/* Posts list */}
      <Box className="posts-container">
        {timelinePosts.map((post) => (
          <Post
            key={post._id}
            post={{
              userImage: post.userId?.profilePicture,
              userName: post.userId?.fullName,
              time: new Date(post.createdAt).toLocaleDateString('vi-VN'),
              content: post.caption,
              image: post.filePath || null,
              likeCount: post.likesCount || 0,
              commentCount: post.commentsCount || 0,
              postId: post._id,
              userId: post.userId?._id,
              _id: post._id
            }}
          />
        ))}
      </Box>
      
      {/* Load more button */}
      {!isLoading && timelinePosts.length > 0 && currentPage < totalPages && (
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
    </Box>
  );
}

export default Content;
