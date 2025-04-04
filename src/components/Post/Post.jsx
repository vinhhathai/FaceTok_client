import React, { useState, useEffect, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublicIcon from '@mui/icons-material/Public';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Link, useNavigate } from 'react-router-dom';

import {
  PostCard,
  PostCardHeader,
  UserNameLink,
  PostTime,
  PostCardContent,
  PostText,
  PostCardMedia,
  PostCardActions,
  ActionButton,
  ActionText,
  PostMenu,
  PostMenuItem,
  PostMenuItemIcon,
  PostMenuItemText,
  UserAvatar
} from './styles';

import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import EditPostModal from '../EditPostModal/EditPostModal';
import CommentModal from '../CommentModal/CommentModal';
import { deletePost, updatePost, likePost, checkLikeStatus, addComment, getComments, deleteComment } from '../../api/postApi';

function Post({ post, defaultUserImage, defaultPostImage, onPostDeleted, onPostUpdated }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // Add refs to track already loaded data
  const likeStatusChecked = useRef(false);
  const commentsLoaded = useRef(false);
  
  // Add debounce timer ref
  const debounceTimerRef = useRef(null);
  
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  // Sử dụng dữ liệu từ props hoặc dữ liệu mặc định
  const userImage = post?.userImage || defaultUserImage;
  const postImage = post?.image || defaultPostImage;
  const userName = post?.userName || "User Name";
  const postTime = post?.time || "3 hours ago";
  const postContent = post?.content || "No content available";
  
  // Lấy userId để điều hướng đến trang profile
  const authorId = post?.userId || (post?.author && post.author._id);
  
  // Kiểm tra xem post có phải của user hiện tại không
  const isCurrentUserPost = currentUser && currentUser.id && 
    (post?.userId === currentUser.id || post?._id === currentUser.id);

  // Update like count from props
  useEffect(() => {
    if (post) {
      setLikeCount(post.likeCount || post.likesCount || 0);
      setCommentsCount(post.commentCount || post.commentsCount || 0);
    }
  }, [post]);
  
  // Check if the user has liked the post on component mount - optimized to run only once
  useEffect(() => {
    const fetchLikeStatus = async () => {
      // Skip if already checked or missing required data
      if (likeStatusChecked.current || !currentUser || !post) return;
      
      try {
        const postIdToCheck = post.postId || post._id;
        if (!postIdToCheck) return;
        
        // Mark as checked before the API call to prevent duplicate requests
        likeStatusChecked.current = true;
        
        // Add debounce to prevent too many simultaneous requests
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(async () => {
          const response = await checkLikeStatus(postIdToCheck);
          if (response.data.success) {
            setLiked(response.data.isLiked);
            setLikeCount(response.data.likesCount);
          }
        }, 500); // 500ms debounce delay
      } catch (error) {
        console.error("Error checking like status:", error);
        // Silently fail - not showing error to user for this operation
      }
    };
    
    fetchLikeStatus();
    
    // Reset the ref when component unmounts
    return () => {
      likeStatusChecked.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [currentUser, post]);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // Handle comment button click - open modal
  const handleCommentClick = () => {
    setShowCommentModal(true);
    // Always fetch fresh comments when modal opens
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
  
  // Xử lý điều hướng đến trang profile khi click vào avatar hoặc tên người dùng
  const handleProfileNavigate = () => {
    if (authorId) {
      navigate(`/profile/${authorId}`);
    }
  };

  // Function to handle adding new comments
  const handleAddComment = async (text, updatedComments) => {
    // If text is provided and not empty, add a new comment
    if (text && text.trim() !== '') {
      try {
        // Create optimistic comment
        const optimisticComment = {
          _id: `temp-${Date.now()}`,
          text: text,
          userId: {
            _id: currentUser.id,
            fullName: currentUser.fullName,
            profilePicture: currentUser.profilePicture || ''
          },
          createdAt: new Date().toISOString(),
          isOptimistic: true
        };
        
        // Add optimistic comment to the current comments list
        const newComments = [optimisticComment, ...comments];
        setComments(newComments);
        
        // Update the comment count
        handleCommentAdded();
        
        // Make the actual API call
        const response = await addComment(post.postId || post._id, text);
        
        if (response.data?.success && response.data?.comment) {
          // Replace the optimistic comment with the real one from the server
          const realComment = response.data.comment;
          setComments(prevComments => 
            prevComments.map(comment => 
              comment.isOptimistic ? realComment : comment
            )
          );
        }
        
        return response;
      } catch (error) {
        // If there's an error, revert the optimistic update
        setComments(prevComments => prevComments.filter(comment => !comment.isOptimistic));
        handleCommentDeleted(); // Revert the comment count
        
        throw error;
      }
    } 
    // If updatedComments is provided (from CommentModal), update our state
    else if (updatedComments) {
      setComments(updatedComments);
      return Promise.resolve({ data: { success: true } });
    }
    
    return Promise.resolve({ data: { success: false } });
  };
  
  // Fetch comments - optimized
  const fetchComments = async () => {
    if (loadingComments || !post) return;
    
    try {
      setLoadingComments(true);
      const postId = post.postId || post._id;
      
      // Use debounce to prevent multiple API calls
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(async () => {
        const response = await getComments(postId, 1, 10);
        
        const commentsData = response.data?.comments || [];
        setComments(commentsData);
        
        // Update comment count to match the actual total from server
        if (response.data && typeof response.data.totalComments === 'number') {
          setCommentsCount(response.data.totalComments);
        }
        
        // Mark comments as loaded to prevent unnecessary refetching
        commentsLoaded.current = true;
        setLoadingComments(false);
      }, 300); // 300ms debounce
    } catch (error) {
      console.error('Error fetching comments:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Không thể tải bình luận',
        severity: 'error'
      });
      setLoadingComments(false);
    }
  };
  
  // Handle comment removal
  const handleDeleteComment = async (commentId) => {
    try {
      // Delete comment from server
      await deleteComment(commentId);
      
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
  
  // Xử lý xóa bài viết
  const handleDeleteClick = () => {
    handleCloseMenu();
    setShowDeleteModal(true);
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      const postIdToDelete = post.postId || post._id;
      await deletePost(postIdToDelete);
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
        onPostDeleted(postIdToDelete);
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
    handleCloseMenu();
    setShowEditModal(true);
  };
  
  const handleEditCancel = () => {
    setShowEditModal(false);
  };
  
  const handleEditSave = async (newContent) => {
    try {
      setUpdateLoading(true);
      const postIdToUpdate = post.postId || post._id;
      const response = await updatePost(postIdToUpdate, newContent);
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
        onPostUpdated(postIdToUpdate, response.data.post);
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

  // Handle like button click
  const handleLikeToggle = async () => {
    if (likeLoading) return;
    
    try {
      setLikeLoading(true);
      
      // Optimistic UI update - change UI right away for better UX
      const newLikedStatus = !liked;
      const newLikeCount = newLikedStatus ? likeCount + 1 : likeCount - 1;
      setLiked(newLikedStatus);
      setLikeCount(newLikeCount);
      
      // Debounce API call
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(async () => {
        try {
          // Make API call
          const response = await likePost(post.postId || post._id);
          
          // Update UI with server response
          if (response.data.success) {
            // If API successful, keep the updated state
            setLiked(response.data.post.isLiked);
            setLikeCount(response.data.post.likesCount);
          } else {
            // If API error, revert to original state
            setLiked(!newLikedStatus);
            setLikeCount(likeCount);
          }
        } catch (error) {
          // Revert optimistic update on error
          setLiked(!newLikedStatus);
          setLikeCount(newLikedStatus ? newLikeCount - 1 : newLikeCount + 1);
          
          console.error("Error toggling like:", error);
          
          setSnackbar({
            open: true,
            message: error.message || 'Không thể yêu thích bài viết',
            severity: 'error'
          });
        } finally {
          setLikeLoading(false);
        }
      }, 300);
    } catch (error) {
      console.error("Error preparing like toggle:", error);
      
      // Revert optimistic update on error
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      setLikeLoading(false);
      
      setSnackbar({
        open: true,
        message: error.message || 'Không thể yêu thích bài viết',
        severity: 'error'
      });
    }
  };

  // Tạo menu items dựa trên quyền của người dùng
  let menuItems = [];
  
  // Thêm tùy chọn chỉnh sửa và xóa nếu đây là bài viết của người dùng hiện tại
  if (isCurrentUserPost) {
    menuItems.push({ 
      icon: <EditOutlinedIcon fontSize="small" color="primary" />, 
      text: 'Chỉnh sửa bài viết', 
      secondaryText: 'Thay đổi nội dung bài viết',
      onClick: handleEditClick
    });
    
    menuItems.push({ 
      icon: <DeleteOutlineIcon fontSize="small" color="error" />, 
      text: 'Xóa bài viết', 
      secondaryText: 'Xóa vĩnh viễn bài viết này',
      onClick: handleDeleteClick
    });
  }
  
  // Thêm các menu items khác
  menuItems = [
    ...menuItems,
    // { icon: <BookmarkAddOutlinedIcon fontSize="small" />, text: 'Save post', secondaryText: 'Add this to your saved items' },
    // { icon: <VisibilityOffOutlinedIcon fontSize="small" />, text: 'Hide post', secondaryText: 'See fewer posts like this' },
    // { icon: <AccessTimeOutlinedIcon fontSize="small" />, text: `Snooze ${userName} for 30 days`, secondaryText: 'Temporarily stop seeing posts' },
    // { icon: <ReportProblemOutlinedIcon fontSize="small" />, text: 'Report', secondaryText: 'I\'m concerned about this post' },
  ];

  return (
    <PostCard>
      <PostCardHeader
        avatar={
          <Avatar 
            src={userImage} 
            aria-label="user avatar" 
            onClick={handleProfileNavigate}
            sx={{ cursor: 'pointer' }}
          />
        }
        action={
          <IconButton aria-label="settings" onClick={handleClickMenu}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <UserNameLink 
            onClick={handleProfileNavigate}
            sx={{ cursor: 'pointer' }}
          >
            {userName}
          </UserNameLink>
        }
        subheader={
          <PostTime variant="caption">
            {postTime} <PublicIcon sx={{ fontSize: '1rem', ml: 0.5 }} />
          </PostTime>
        }
      />
      <PostMenu
        id="post-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItems.map((item, index) => (
          <PostMenuItem key={index} onClick={item.onClick || handleCloseMenu}>
            <PostMenuItemIcon>{item.icon}</PostMenuItemIcon>
            <PostMenuItemText primary={item.text} secondary={item.secondaryText} />
          </PostMenuItem>
        ))}
      </PostMenu>
      
      <PostCardContent>
        <PostText variant="body1">
          {postContent}
        </PostText>
        {postImage && (
          <PostCardMedia
            component="img"
            image={postImage}
            alt="post image"
          />
        )}
      </PostCardContent>
      
      <PostCardActions disableSpacing>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ActionButton 
            aria-label="like post" 
            onClick={handleLikeToggle}
            disabled={likeLoading}
          >
            {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </ActionButton>
          <ActionText color={liked ? "error" : "inherit"}>{likeCount}</ActionText>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ActionButton aria-label="comment on post" onClick={handleCommentClick}>
            <ChatBubbleOutlineOutlinedIcon />
          </ActionButton>
          <ActionText>{commentsCount}</ActionText>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <ActionButton aria-label="share post">
            <ShareOutlinedIcon />
          </ActionButton>
          <ActionText>Share</ActionText>
        </Box>
      </PostCardActions>
      
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
        post={post}
      />
      
      {/* Comment Modal */}
      <CommentModal 
        open={showCommentModal}
        onClose={handleCloseCommentModal}
        postId={post?.postId || post?._id}
        comments={comments}
        loadingComments={loadingComments}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        postAuthorId={post?.userId || (post?.author && post.author._id)}
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
    </PostCard>
  );
}

// Default props
Post.defaultProps = {
  defaultUserImage: require("../../assets/images/users/user-1.jpg"),
  defaultPostImage: null,
};

export default Post;
