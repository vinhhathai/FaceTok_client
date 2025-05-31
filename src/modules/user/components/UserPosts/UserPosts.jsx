import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, CircularProgress, Grid } from '@mui/material';

// Styles
import {
  LoadingContainer,
  EmptyContainer,
  PostsContainer,
  PostItem,
  PostContent,
  PostTimestamp,
  PostStats
} from './UserPosts.styles';

// Default image
const DEFAULT_AVATAR = '/assets/images/avatar_default.jpg';

// Component này sẽ sử dụng PostCard từ module post
// Tạm thời chỉ giữ chỗ cho component này

const UserPosts = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    // Giả lập việc tải bài viết
    const timer = setTimeout(() => {
      // Dữ liệu mẫu
      setPosts([
        {
          id: '1',
          content: 'Đây là bài viết đầu tiên',
          createdAt: new Date().toISOString(),
          likes: 45,
          comments: 12,
          user: {
            id: userId,
            name: 'Nguyễn Văn A',
            avatar: DEFAULT_AVATAR,
          }
        },
        {
          id: '2',
          content: 'Đây là bài viết thứ hai với nhiều nội dung hơn. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Một ngày trước
          likes: 23,
          comments: 5,
          user: {
            id: userId,
            name: 'Nguyễn Văn A',
            avatar: DEFAULT_AVATAR,
          }
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
  
  return (
    <PostsContainer>
      <Grid container spacing={3} direction="column">
        {posts.map(post => (
          <Grid item key={post.id}>
            <PostItem>
              <PostContent>
                <Typography variant="body1">{post.content}</Typography>
              </PostContent>
              <PostTimestamp>
                <Typography variant="caption" color="text.secondary">
                  Đăng lúc: {new Date(post.createdAt).toLocaleString('vi-VN')}
                </Typography>
              </PostTimestamp>
              <PostStats>
                <Typography variant="body2" color="text.secondary">
                  {post.likes} lượt thích
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.comments} bình luận
                </Typography>
              </PostStats>
            </PostItem>
          </Grid>
        ))}
      </Grid>
    </PostsContainer>
  );
};

UserPosts.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserPosts; 