import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Button 
} from "@mui/material";

import { ContentContainer, PostsContainer } from './Content.styles';
import Post from '../Post';
import CreatePost from '../CreatePost';
import { toast } from 'react-toastify';

// Mock data for demonstration
const mockPost = {
  id: '1',
  content: 'Chào mừng đến với Chaotok! 🎉 Đây là bài viết đầu tiên để demo giao diện với layout media linh hoạt. Hôm nay là một ngày tuyệt vời để chia sẻ những khoảnh khắc đẹp với bạn bè. Cảm ơn mọi người đã tham gia cộng đồng này! 💙',
  author: {
    id: 'user-1',
    name: 'Nguyễn Văn A',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  likeCount: 89,
  commentCount: 12,
  shareCount: 5,
  isLiked: false,
  media: [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    },
    {
      type: 'video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    }
  ],
  comments: [
    {
      id: 'comment-1',
      content: 'Bài viết rất hay! Cảm ơn bạn đã chia sẻ 😊',
      author: {
        name: 'Trần Thị B',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      likeCount: 5,
      replies: [
        {
          id: 'reply-1',
          content: 'Tôi cũng thích bài viết này! 👍',
          author: {
            name: 'Nguyễn Văn A',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
          likeCount: 2
        }
      ]
    },
    {
      id: 'comment-2',
      content: 'Giao diện đẹp quá! Chúc mừng ra mắt 🎊',
      author: {
        name: 'Lê Văn C',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      likeCount: 3,
      replies: []
    },
    {
      id: 'comment-3',
      content: 'Tôi cũng muốn tham gia cộng đồng này! Làm thế nào để đăng ký?',
      author: {
        name: 'Phạm Thị D',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      likeCount: 1,
      replies: [
        {
          id: 'reply-2',
          content: 'Bạn có thể đăng ký bằng cách nhấn vào nút "Đăng ký" ở góc trên bên phải!',
          author: {
            name: 'Nguyễn Văn A',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
          likeCount: 0
        }
      ]
    }
  ]
};

function Content() {
  const dispatch = useDispatch();
  
  // Add safety check for undefined posts state
  const postsState = useSelector(state => state.posts) || {};
  const { 
    timelinePosts = [mockPost], // Use mock data as default
    currentPage = 1, 
    totalPages = 1
  } = postsState;

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
        // Temporarily comment out until post module is implemented
        // await dispatch(fetchTimelinePosts({ page: 1, limit: 10 })).unwrap();
        console.log('Post module not yet implemented, using mock data');
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
        // Temporarily comment out until post module is implemented
        // await dispatch(fetchTimelinePosts({ page: currentPage + 1, limit: 10 })).unwrap();
        console.log('Post module not yet implemented');
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
      // Temporarily comment out until post module is implemented
      // await dispatch(fetchTimelinePosts({ page: 1, limit: 10 })).unwrap();
      console.log('Post module not yet implemented, using mock data');
      toast.success('Đã làm mới trang');
    } catch (error) {
      console.error('Failed to refresh posts:', error);
      setError('Không thể làm mới bài viết');
      toast.error('Không thể làm mới bài viết');
    } finally {
      setLoading(false);
    }
  };

  // Post event handlers
  const handleLike = (postId, isLiked) => {
    console.log(`Post ${postId} ${isLiked ? 'liked' : 'unliked'}`);
    toast.success(isLiked ? 'Đã thích bài viết' : 'Đã bỏ thích bài viết');
  };

  const handleComment = (postId, comment, replyToId = null) => {
    if (replyToId) {
      console.log(`Reply to comment ${replyToId} on post ${postId}:`, comment);
      toast.success('Đã trả lời bình luận');
    } else {
      console.log(`Comment on post ${postId}:`, comment);
      toast.success('Đã bình luận bài viết');
    }
  };

  const handleShare = (postId) => {
    console.log(`Share post ${postId}`);
    toast.success('Đã chia sẻ bài viết');
  };

  const handleDelete = (postId) => {
    console.log(`Delete post ${postId}`);
    toast.success('Đã xóa bài viết');
  };

  const handleEdit = (postId) => {
    console.log(`Edit post ${postId}`);
    toast.info('Chức năng chỉnh sửa đang được phát triển');
  };

  return (
    <ContentContainer>
      {/* CreatePost Component */}
      <CreatePost />
      
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
      
      {/* Posts list */}
      <PostsContainer>
        {timelinePosts.map(post => (
          <Post
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
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