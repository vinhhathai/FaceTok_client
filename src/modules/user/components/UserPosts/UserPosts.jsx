import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, CircularProgress, Box } from '@mui/material';
import { toast } from 'react-toastify';

// Import Post component
import Post from '@post/components/Post';

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
  
  useEffect(() => {
    // Giả lập việc tải bài viết
    const timer = setTimeout(() => {
      // Dữ liệu mẫu với cấu trúc giống Post component
      setPosts([
        {
          id: '1',
          content: 'Chào mừng đến với profile của tôi! 🎉 Đây là bài viết đầu tiên để demo giao diện với layout media linh hoạt. Hôm nay là một ngày tuyệt vời để chia sẻ những khoảnh khắc đẹp với bạn bè. Cảm ơn mọi người đã ghé thăm profile! 💙',
          author: {
            id: userId,
            name: 'Nguyễn Văn A',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          likeCount: 45,
          commentCount: 12,
          shareCount: 5,
          isLiked: false,
          media: [
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
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
              createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              likeCount: 5,
              replies: []
            }
          ]
        },
        {
          id: '2',
          content: 'Đây là bài viết thứ hai với nhiều nội dung hơn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          author: {
            id: userId,
            name: 'Nguyễn Văn A',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Một ngày trước
          likeCount: 23,
          commentCount: 5,
          shareCount: 2,
          isLiked: true,
          media: [
            {
              type: 'video',
              url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
            }
          ],
          comments: []
        },
      ]);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
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
  );
};

UserPosts.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserPosts; 