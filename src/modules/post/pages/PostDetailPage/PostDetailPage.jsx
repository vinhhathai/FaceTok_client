import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import postAPI from '@post/api/postAPI';
import Post from '@post/components/Post';
import Header from '@components/Header/Header';
import Sidebar from '@post/components/Sidebar/Sidebar';
import WeatherBar from '@components/WeatherBar';
import MainLayout from '@components/MainLayout/MainLayout';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await postAPI.getPostById(postId);
        const data = res?.data || res;
        if (isMounted) setPost(data);
      } catch (e) {
        if (isMounted) setError(e?.response?.data?.message || e?.message || 'Không thể tải bài viết');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPost();
    return () => { isMounted = false; };
  }, [postId]);

  // Handlers to enable full functionality like on Home
  const handleLike = async (postId, isLiked) => {
    try {
      await postAPI.toggleLike(postId);
    } catch (_) {}
  };

  const handleComment = async (postId, comment, replyToId = null) => {
    try {
      await postAPI.createComment(postId, { content: comment, parentId: replyToId || undefined });
    } catch (_) {}
  };

  const handleShare = async (postId) => {
    try {
      const res = await postAPI.toggleShare(postId);
      return res?.data || res;
    } catch (_) { return null; }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ maxWidth: 720, mx: 'auto', p: 2 }}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/home')}>Quay về trang chủ</Button>
        </Box>
      );
    }
    if (!post) {
      return (
        <Box sx={{ maxWidth: 720, mx: 'auto', p: 2 }}>
          <Typography>Bài viết không tồn tại hoặc đã bị xóa.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/home')}>Quay về trang chủ</Button>
        </Box>
      );
    }
    return (
      <Box sx={{ maxWidth: 720, mx: 'auto', p: 2 }}>
        <Post post={post} onLike={handleLike} onComment={handleComment} onShare={handleShare} />
      </Box>
    );
  };

  return (
    <Box>
      <Header />
      <MainLayout leftSidebar={<Sidebar/>} content={renderContent()} rightSidebar={<WeatherBar/>} />
    </Box>
  );
};

export default PostDetailPage;


