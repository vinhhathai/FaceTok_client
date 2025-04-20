import React, { useState, useEffect } from 'react';
import { 
  Avatar, 
  Typography, 
  IconButton, 
  Box,
  CardMedia,
  CardActions,
  Divider,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  ActionCount
} from './styles';

import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import EditPostModal from '../EditPostModal/EditPostModal';
import CommentModal from '../CommentModal/CommentModal';
import { deletePost, updatePost, likePost, checkLikeStatus, addComment, getComments, deleteComment } from '../../api/postApi';

const PostItem = ({ post, onPostDeleted, onPostUpdated }) => {
  const [liked, setLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const currentUser = useSelector((state) => state.user);

  // Update like count from props
  useEffect(() => {
    if (post) {
      setLikeCount(post.likesCount || 0);
      setCommentsCount(post.commentsCount || 0);
    }
  }, [post]);
  
  // Check if the user has liked the post on component mount
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!currentUser || !post) return;
      
      try {
        const postIdToCheck = post._id;
        if (!postIdToCheck) return;
        
        const response = await checkLikeStatus(postIdToCheck);
        if (response.data.success) {
          setLiked(response.data.isLiked);
          setLikeCount(response.data.likesCount);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
        // Silently fail - not showing error to user for this operation
      }
    };
    
    fetchLikeStatus();
  }, [currentUser, post]);

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

  // Handle like button click
  const handleLikeToggle = async () => {
    if (likeLoading) return;
    
    try {
      setLikeLoading(true);
      
      // Optimistic UI update
      const newLikedStatus = !liked;
      const newLikeCount = newLikedStatus ? likeCount + 1 : likeCount - 1;
      setLiked(newLikedStatus);
      setLikeCount(newLikeCount);
      
      // Make API call
      const response = await likePost(post._id);
      
      if (response.data.success) {
        // Update with actual data from server
        setLiked(response.data.post.isLiked);
        setLikeCount(response.data.post.likesCount);
      } else {
        // Revert optimistic update on error
        setLiked(!newLikedStatus);
        setLikeCount(likeCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update on error
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      
      setSnackbar({
        open: true,
        message: error.message || 'Không thể yêu thích bài viết',
        severity: 'error'
      });
    } finally {
      setLikeLoading(false);
    }
  };

  // Function to handle comment button click - open modal
  const handleCommentClick = () => {
    setShowCommentModal(true);
    // Load comments when modal opens
    fetchComments();
  };
  
  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
  };
  
  // Handle comment add/delete callbacks
  const handleCommentAdded = () => {
    setCommentsCount(prev => prev + 1);
  };
  
  const handleCommentDeleted = () => {
    setCommentsCount(prev => Math.max(0, prev - 1));
  };
  
  // Fetch comments
  const fetchComments = async () => {
    if (loadingComments || !post?._id) return;
    
    try {
      setLoadingComments(true);
      
      const response = await getComments(post._id, 1, 10);
      
      const commentsData = response.data?.comments || [];
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Không thể tải bình luận',
        severity: 'error'
      });
    } finally {
      setLoadingComments(false);
    }
  };
  
  // Menu xử lý
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Xử lý xóa bài viết
  const handleDeleteClick = () => {
    handleMenuClose();
    setShowDeleteModal(true);
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await deletePost(post._id);
      setDeleteLoading(false);
      setShowDeleteModal(false);
      
      // Hiển thị thông báo thành công
      setSnackbar({
        open: true,
        message: 'Đã xóa bài viết thành công',
        severity: 'success'
      });
      
      // Gọi callback để cập nhật UI (nếu có)
      if (typeof onPostDeleted === 'function') {
        onPostDeleted(post._id);
      }
    } catch (error) {
      setDeleteLoading(false);
      setSnackbar({
        open: true,
        message: error.message || 'Không thể xóa bài viết',
        severity: 'error'
      });
    }
  };
  
  // Xử lý chỉnh sửa bài viết
  const handleEditClick = () => {
    handleMenuClose();
    setShowEditModal(true);
  };
  
  const handleEditCancel = () => {
    setShowEditModal(false);
  };
  
  const handleEditSave = async (newContent) => {
    try {
      setUpdateLoading(true);
      const response = await updatePost(post._id, newContent);
      setUpdateLoading(false);
      setShowEditModal(false);
      
      // Hiển thị thông báo thành công
      setSnackbar({
        open: true,
        message: 'Đã cập nhật bài viết thành công',
        severity: 'success'
      });
      
      // Gọi callback để cập nhật UI (nếu có)
      if (typeof onPostUpdated === 'function') {
        onPostUpdated(post._id, response.data.post);
      }
    } catch (error) {
      setUpdateLoading(false);
      setSnackbar({
        open: true,
        message: error.message || 'Không thể cập nhật bài viết',
        severity: 'error'
      });
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Handle comment removal
  const handleDeleteComment = async (commentId) => {
    try {
      // Delete comment from server
      await deleteComment(post._id, commentId);
      
      // Update UI after successful deletion
      setComments(prev => prev.filter(c => c._id !== commentId));
      handleCommentDeleted();
      
      setSnackbar({
        open: true,
        message: 'Bình luận đã được xóa thành công',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Không thể xóa bình luận',
        severity: 'error'
      });
    }
  };

  // Function to update comments after reply operations
  const updateComments = (text, updatedComments) => {
    // Case 1: If updatedComments is provided, just update the state
    // This is used for optimistic updates and comment maintenance
    if (updatedComments) {
      setComments(updatedComments);
      return Promise.resolve({ data: { success: true } });
    }
    
    // Case 2: If text is provided but no updatedComments, make an API call
    // This is a new comment being added
    if (text && text.trim() !== '') {
      // Create optimistic comment with temporary ID
      const optimisticComment = {
        _id: `temp-${Date.now()}`,
        text: text,
        userId: {
          _id: currentUser.id,
          fullName: currentUser.fullName,
          profilePicture: currentUser.profilePicture
        },
        createdAt: new Date().toISOString(),
        isOptimistic: true
      };
      
      // Add optimistic comment to UI immediately
      setComments(prev => [optimisticComment, ...prev]);
      
      // Increment comments count optimistically
      setCommentsCount(prev => prev + 1);
      handleCommentAdded();
      
      // Make the actual API call
      return addComment(post._id, text)
        .then(response => {
          const newComment = response.data?.comment || {};
          if (newComment && newComment._id) {
            // Replace optimistic comment with actual comment from server
            setComments(prev => prev.map(comment => 
              comment.isOptimistic ? newComment : comment
            ));
          }
          return response;
        })
        .catch(error => {
          // If the comment fails, remove the optimistic comment
          setComments(prev => prev.filter(comment => !comment.isOptimistic));
          // Revert the comment count
          setCommentsCount(prev => prev - 1);
          
          // Show error
          setSnackbar({
            open: true,
            message: error.message || 'Không thể thêm bình luận',
            severity: 'error'
          });
          
          throw error;
        });
    }
    
    // Default case: neither text nor updatedComments provided
    return Promise.resolve({ data: { success: false } });
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
  const isCurrentUserPost = currentUser && (
    authorId === currentUser.id || 
    post.userId === currentUser.id || 
    post.user_id === currentUser.id
  );

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
        {isCurrentUserPost && (
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreHorizIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditClick}>
                <EditIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                Chỉnh sửa bài viết
              </MenuItem>
              <MenuItem onClick={handleDeleteClick}>
                <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                Xóa bài viết
              </MenuItem>
            </Menu>
          </>
        )}
        {!isCurrentUserPost && (
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        )}
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
            {likeCount} lượt yêu thích • {commentsCount} bình luận
          </ActionCount>
        </Box>
      </CardActions>

      <Divider sx={{ mb: 0.5 }} />

      <CardActions sx={{ px: 2, py: 0 }}>
        <ActionButton 
          startIcon={liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          onClick={handleLikeToggle}
          color={liked ? "error" : "inherit"}
          disabled={likeLoading}
        >
          Yêu thích
        </ActionButton>
        
        <ActionButton
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={handleCommentClick}
          color="inherit"
        >
          Bình luận ({commentsCount})
        </ActionButton>
        
        <ActionButton 
          startIcon={<ShareIcon />}
        >
          Chia sẻ
        </ActionButton>
      </CardActions>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
      
      {/* Edit Post Modal */}
      <EditPostModal
        open={showEditModal}
        onClose={handleEditCancel}
        onSave={handleEditSave}
        loading={updateLoading}
        post={{
          content: postContent,
          image: hasMedia ? getMediaUrl() : null
        }}
      />
      
      {/* Comment Modal */}
      <CommentModal
        open={showCommentModal}
        onClose={handleCloseCommentModal}
        postId={post._id}
        comments={comments}
        onAddComment={updateComments}
        onDeleteComment={handleDeleteComment}
        loading={loadingComments}
        currentUser={currentUser}
      />
      
      {/* Snackbar thông báo */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PostContainer>
  );
};

export default PostItem; 