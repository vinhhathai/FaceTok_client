import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import CreatePost from '../CreatingPost/CreatingPost';
import RightSidebar from '../RightSidebar/RightSidebar';
import PostItem from '../PostItem/PostItem';
import { fetchTimelinePosts } from '../../redux/features/postSlice';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

function HomePage() {
  const dispatch = useDispatch();
  const { timelinePosts, isLoading, error } = useSelector(state => state.posts);
  
  useEffect(() => {
    // Fetch bài viết khi component mount
    dispatch(fetchTimelinePosts({ page: 1, limit: 10 }));
  }, [dispatch]);
  
  // Xử lý khi xóa bài viết
  const handlePostDeleted = (postId) => {
    // Cập nhật UI ngay lập tức bằng cách lọc bỏ bài viết đã xóa (Optimistic UI update)
    const updatedPosts = timelinePosts.filter(post => post._id !== postId);
    
    // Dispatch action để cập nhật redux store và sau đó tải lại dữ liệu
    dispatch({ 
      type: 'posts/setTimelinePosts', 
      payload: updatedPosts 
    });
    
    // Tải lại dữ liệu từ server sau một khoảng thời gian ngắn
    setTimeout(() => {
      dispatch(fetchTimelinePosts({ page: 1, limit: 10 }));
    }, 500);
  };
  
  // Xử lý khi cập nhật bài viết
  const handlePostUpdated = (postId, updatedPost) => {
    // Cập nhật UI bằng cách thay thế bài viết đã cập nhật trong danh sách
    const updatedPosts = timelinePosts.map(post => 
      post._id === postId ? { ...post, caption: updatedPost.caption } : post
    );
    
    // Dispatch action để cập nhật redux store
    dispatch({ 
      type: 'posts/setTimelinePosts', 
      payload: updatedPosts 
    });
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: { xs: 1, md: 2 },
          marginTop: '64px', // Chiều cao của Header
          backgroundColor: '#f0f2f5',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Sidebar />
            </Grid>
            
            <Grid item xs={12} md={6}>
              {/* Phần tạo bài viết */}
              <CreatePost />
              
              {/* Hiển thị danh sách bài viết */}
              <Box sx={{ mt: 2 }}>
                {isLoading ? (
                  <LoadingSpinner text="Đang tải bài viết..." />
                ) : error ? (
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography color="error">
                      {error || 'Đã xảy ra lỗi khi tải bài viết'}
                    </Typography>
                  </Paper>
                ) : timelinePosts.length > 0 ? (
                  timelinePosts.map(post => (
                    <PostItem 
                      key={post._id} 
                      post={post} 
                      onPostDeleted={handlePostDeleted}
                      onPostUpdated={handlePostUpdated}
                    />
                  ))
                ) : (
                  <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1">
                      Chưa có bài viết nào. Hãy là người đầu tiên đăng bài!
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <RightSidebar />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage; 