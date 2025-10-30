import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, CircularProgress, Box } from '@mui/material';
import { toast } from 'react-toastify';

// Import Post component and Redux actions
import Post from '@post/components/Post';
import { fetchUserPosts } from '@post/redux/slices/postSlice';

// Styles
import {
  LoadingContainer,
  EmptyContainer,
  PostsContainer
} from './UserPosts.styles';

const UserPosts = ({ userId }) => {
  const dispatch = useDispatch();
  const { userPosts, loading, error } = useSelector((state) => state.posts);
  const posts = userPosts[userId] || [];
  
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPosts({ userId, params: { page: 1, limit: 10 } }));
    }
  }, [userId, dispatch]);
  
  if (loading && posts.length === 0) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }
  
  if (error && posts.length === 0) {
    return (
      <EmptyContainer>
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Không thể tải bài viết. Vui lòng thử lại.
        </Typography>
      </EmptyContainer>
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