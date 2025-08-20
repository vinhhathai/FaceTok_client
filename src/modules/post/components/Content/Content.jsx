import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import { ContentContainer, PostsContainer } from './Content.styles';
import Post from '../Post';
import CreatePost from '../CreatePost';
import { toast } from 'react-toastify';
import { fetchTimelinePosts } from '../../redux/slices/postSlice';
import postAPI from '@post/api/postAPI';

const Content = () => {
  const dispatch = useDispatch();
  const { timelinePosts, loading, error } = useSelector((state) => state.posts);
  const currentUser = useSelector((state) => state.auth.user);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    // Fetch timeline posts when component mounts
    dispatch(fetchTimelinePosts({ page: 1, limit: 10 }));
  }, [dispatch]);

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

  const handleRequestDelete = (postId) => {
    setSelectedPostId(postId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPostId) return;
    try {
      setDeleting(true);
      await postAPI.deletePost(selectedPostId);
      setConfirmOpen(false);
      setSelectedPostId(null);
      dispatch(fetchTimelinePosts({ page: 1, limit: 10 }));
      toast.success('Đã xóa bài viết');
    } catch (e) {
      toast.error('Xóa bài viết thất bại');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {};

  if (loading && timelinePosts.length === 0) {
    return (
      <ContentContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </ContentContainer>
    );
  }

  if (error && timelinePosts.length === 0) {
    return (
      <ContentContainer>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => dispatch(fetchTimelinePosts({ page: 1, limit: 10 }))}
          >
            Thử lại
          </Button>
        </Box>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <CreatePost />
      <PostsContainer>
        {timelinePosts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
            </Typography>
          </Box>
        ) : (
          timelinePosts.map(post => (
            <Post
              key={post._id || post.tempId}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onDelete={handleRequestDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </PostsContainer>

      {/* Confirm delete dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={deleting}>
            {deleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </ContentContainer>
  );
};

export default Content; 