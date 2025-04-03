import React from 'react';
import { 
  Avatar, 
  Typography, 
  IconButton, 
  Box,
  CardMedia,
  CardActions,
  CardContent,
  Divider,
  Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSelector } from 'react-redux';

import {
  PostContainer,
  PostHeader,
  PostAuthorInfo,
  PostAuthorName,
  PostTime,
  PostContent,
  MediaContainer,
  ActionButton,
  ActionCount,
  CommentSection,
  CommentInput
} from './styles';

const PostItem = ({ post }) => {
  const [liked, setLiked] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const currentUser = useSelector((state) => state.user);

  // Format thời gian đăng
  const formatPostTime = (timestamp) => {
    try {
      if (!timestamp) return 'Vừa đăng';
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Vừa đăng';
      
      return formatDistanceToNow(date, { 
        addSuffix: true,
        locale: vi
      });
    } catch (e) {
      return 'Vừa đăng';
    }
  };

  const handleLikeToggle = () => {
    setLiked(prev => !prev);
    // Trong thực tế, cần gọi API để like/unlike
  };

  const handleCommentToggle = () => {
    setShowComments(prev => !prev);
  };

  if (!post) return null;

  // Linh hoạt với cấu trúc dữ liệu từ server
  const postContent = post.content || post.caption || '';
  
  // Xử lý thông tin tác giả
  const authorId = post.author?._id || post.userId || post.user_id || '';
  const authorName = post.author?.fullName || post.userName || 'Người dùng';
  const authorAvatar = post.author?.profilePicture || post.userImage || '';
  
  // Xử lý media
  const hasMedia = !!(post.media?.length || post.filePath);
  
  // Tính toán media URL
  const getMediaUrl = () => {
    if (post.media && post.media.length > 0) {
      return post.media[0].url; 
    } else if (post.filePath) {
      return post.filePath;
    }
    return '';
  };
  
  // Kiểm tra xem post có phải của user hiện tại không
  const isCurrentUserPost = currentUser && (authorId === currentUser.id);

  return (
    <PostContainer elevation={1}>
      <PostHeader>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={authorAvatar} 
            alt={authorName || 'User'}
            component={Link}
            to={`/profile/${authorId}`}
            sx={{ 
              width: 50, 
              height: 50,
              mr: 1.5,
              cursor: 'pointer'
            }}
          />
          <PostAuthorInfo>
            <PostAuthorName 
              component={Link}
              to={`/profile/${authorId}`}
            >
              {authorName}
            </PostAuthorName>
            <PostTime>{formatPostTime(post.createdAt)}</PostTime>
          </PostAuthorInfo>
        </Box>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </PostHeader>

      <PostContent>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: hasMedia ? 2 : 0 }}>
          {postContent}
        </Typography>
        
        {/* Hiển thị media nếu có */}
        {hasMedia && (
          <MediaContainer>
            <CardMedia
              component="img"
              image={getMediaUrl()}
              alt="Post media"
              sx={{ 
                borderRadius: '8px',
                maxHeight: '400px',
                objectFit: 'contain',
                bgcolor: 'black'
              }}
            />
          </MediaContainer>
        )}
      </PostContent>

      <Divider sx={{ my: 1 }} />

      <CardActions sx={{ px: 2, py: 0.5, justifyContent: 'space-between' }}>
        <Box>
          <ActionCount>
            {post.likesCount || 0} lượt thích • {post.commentsCount || 0} bình luận
          </ActionCount>
        </Box>
      </CardActions>

      <Divider sx={{ mb: 0.5 }} />

      <CardActions sx={{ px: 2, py: 0 }}>
        <ActionButton 
          startIcon={liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          onClick={handleLikeToggle}
          color={liked ? "primary" : "inherit"}
        >
          Thích
        </ActionButton>
        
        <ActionButton 
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={handleCommentToggle}
        >
          Bình luận
        </ActionButton>
        
        <ActionButton 
          startIcon={<ShareIcon />}
        >
          Chia sẻ
        </ActionButton>
      </CardActions>

      {showComments && (
        <CommentSection>
          <Divider sx={{ my: 1 }} />
          <CommentInput
            placeholder="Viết bình luận..."
            fullWidth
            size="small"
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Đang phát triển tính năng bình luận...
          </Typography>
        </CommentSection>
      )}
    </PostContainer>
  );
};

export default PostItem; 