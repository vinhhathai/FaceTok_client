import React, { useState, useEffect, useCallback } from 'react';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { deleteComment, addComment } from '../../api/postApi';

import { 
  StyledDialog, 
  CommentsList, 
  CommentItem, 
  CommentContent,
  CommentForm
} from './styles';

const CommentModal = ({ 
  open, 
  onClose, 
  postId, 
  comments = [],
  onAddComment,
  onDeleteComment,
  loading = false,
  currentUser = null 
}) => {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [localComments, setLocalComments] = useState([]);

  // Sync with the parent's comments when they change
  useEffect(() => {
    if (comments) {
      setLocalComments(comments);
    }
  }, [comments]);

  // Reset comment text when modal closes
  useEffect(() => {
    if (!open) {
      setCommentText('');
      setError(null);
    }
  }, [open]);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  // Memoize the update function to avoid unnecessary re-renders
  const updateParentComments = useCallback((updatedComments) => {
    // Update local state immediately
    setLocalComments(updatedComments);
    
    // Then update parent state
    if (typeof onAddComment === 'function') {
      onAddComment('', updatedComments);
    }
  }, [onAddComment]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    const text = commentText.trim();
    if (!text || submitting || !postId) return;
    
    // Save the comment text for potential rollback
    const originalText = text;
    
    // Create optimistic comment
    const optimisticComment = {
      _id: `temp-comment-${Date.now()}`,
      text: text,
      userId: {
        _id: currentUser.id,
        fullName: currentUser.fullName,
        profilePicture: currentUser.profilePicture
      },
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };
    
    // Add comment to local state immediately
    const updatedComments = [optimisticComment, ...localComments];
    updateParentComments(updatedComments);
    
    // Clear input right away for better UX
    setCommentText('');
    
    // Set submitting state
    setSubmitting(true);
    setError(null);
    
    try {
      // Make actual API call
      const response = await addComment(postId, originalText);
      
      // If successful, replace the optimistic comment with the real one
      if (response.data?.success && response.data?.comment) {
        const realComment = response.data.comment;
        
        // Create new comments array with the real comment replacing the optimistic one
        const updatedWithRealComment = localComments.map(comment => 
          comment.isOptimistic ? realComment : comment
        );
        
        // Be sure to include the real comment if it's not in the array
        if (!updatedWithRealComment.some(c => c._id === realComment._id)) {
          updatedWithRealComment.unshift(realComment);
        }
        
        // Update both local and parent state
        updateParentComments(updatedWithRealComment);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(error.message || 'Có lỗi khi gửi bình luận');
      
      // Restore the input if there's an error
      setCommentText(originalText);
      
      // Remove optimistic comment on failure
      const rollbackComments = localComments.filter(comment => !comment.isOptimistic);
      updateParentComments(rollbackComments);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCommentTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: vi
      });
    } catch (e) {
      return 'Vừa xong';
    }
  };

  const canDeleteComment = (comment) => {
    if (!currentUser || !comment || !comment.userId) return false;
    
    // Allow deletion if the user is the comment author
    return currentUser.id === comment.userId._id;
  };

  return (
    <StyledDialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Bình luận</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <CommentForm onSubmit={handleSubmitComment}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Viết bình luận..."
            value={commentText}
            onChange={handleCommentChange}
            variant="outlined"
            size="small"
            disabled={submitting}
          />
          <IconButton 
            color="primary" 
            type="submit"
            disabled={!commentText.trim() || submitting}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </CommentForm>
      </Box>
      
      <DialogContent sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Box sx={{ my: 1, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography variant="body2" color="error">{error}</Typography>
              </Box>
            )}
            
            <CommentsList>
              {localComments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                  </Typography>
                </Box>
              ) : (
                localComments.map((comment) => (
                  <CommentItem key={comment._id}>
                    <Avatar 
                      src={comment.userId?.profilePicture} 
                      alt={comment.userId?.fullName || 'User'}
                      sx={{ width: 36, height: 36 }}
                    />
                    <Box sx={{ flex: 1, ml: 1 }}>
                      <CommentContent>
                        <Typography variant="subtitle2" component="span">
                          {comment.userId?.fullName || 'Người dùng'}
                        </Typography>
                        <Typography variant="body2" component="p">
                          {comment.text}
                        </Typography>
                      </CommentContent>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, ml: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          {formatCommentTime(comment.createdAt)}
                        </Typography>
                        
                        {canDeleteComment(comment) && (
                          <Button 
                            variant="text" 
                            size="small" 
                            sx={{ ml: 1, minWidth: 'auto', color: 'text.secondary', fontSize: '0.7rem' }}
                            onClick={() => onDeleteComment && onDeleteComment(comment._id)}
                          >
                            Xóa
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </CommentItem>
                ))
              )}
            </CommentsList>
          </>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default CommentModal; 