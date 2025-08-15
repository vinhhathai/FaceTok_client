import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, CircularProgress, Box } from '@mui/material';
import { toast } from 'react-toastify';

// Import Post component and API
import Post from '@post/components/Post';
import postAPI from '@post/api/postAPI';

// Styles
import {
  LoadingContainer,
  EmptyContainer,
  PostsContainer
} from './UserPosts.styles';

// Default image
const DEFAULT_AVATAR = '/assets/images/avatar_default.jpg';

const UserPosts = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Fetch posts from API
  const fetchUserPosts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching posts for userId:', userId);
      const response = await postAPI.getPostsByAuthor(userId, { page, limit: 10 });
      
      console.log('📡 API Response:', response);
      console.log('📊 Response structure:', {
        success: response.success,
        hasData: !!response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        dataLength: response.data?.length,
        firstPost: response.data?.[0],
        firstPostAuthor: response.data?.[0]?.author
      });
      
      if (response.success) {
        console.log('✅ Posts fetched successfully:', response.data);
        console.log('📊 Pagination:', response.pagination);
        setPosts(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('❌ Error fetching user posts:', error);
      setError(error.message);
      toast.error('Không thể tải bài viết');
      
      // Set empty posts array instead of mock data
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchUserPosts(1);
    }
  }, [userId]);
  
  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }
  
  if (posts.length === 0) {
    return (
      <EmptyContainer>
        <Typography variant="body1" color="text.secondary">
          Người dùng chưa có bài viết nào.
        </Typography>
      </EmptyContainer>
    );
  }
  
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
    <PostsContainer>
      {posts.map(post => (
        <Post
          key={post._id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </PostsContainer>
  );
};

UserPosts.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserPosts; 