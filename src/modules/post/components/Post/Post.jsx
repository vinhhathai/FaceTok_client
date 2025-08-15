import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
  Collapse,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  MoreVert,
  Edit,
  Delete,
  Flag,
  AccessTime,
  Send,
  EmojiEmotions,
  AttachFile,
  Image,
  Reply,
  Favorite as HeartIcon,
  FavoriteBorder as HeartBorderIcon,
  Close,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  PostContainer,
  PostImage,
  PostActionsContainer,
  CommentSection,
  CommentInput,
  CommentItem,
  PostStats,
  PostHeader,
  PostContent,
  PostFooter,
  ActionButton,
  LikeButton,
  CommentButton,
  ShareButton,
  MoreButton,
  TimeChip,
  ImageGrid,
  ImageContainer,
  SingleImage,
  MultipleImageGrid
} from './Post.styles';

const Post = ({ post, onLike, onComment, onShare, onDelete, onEdit }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [likedComments, setLikedComments] = useState(new Set());
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.(post.id, !liked);
  };

  const handleComment = () => {
    // Trên mobile, mở modal comment
    if (window.innerWidth <= 768) {
      setCommentModalOpen(true);
      setShowCommentInput(true);
    } else {
      // Trên desktop, giữ nguyên behavior cũ
      setShowCommentInput(!showCommentInput);
      if (!showComments) {
        setShowComments(true);
      }
    }
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete?.(post.id);
    handleMoreClose();
  };

  const handleEdit = () => {
    onEdit?.(post.id);
    handleMoreClose();
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment?.(post.id, commentText);
      setCommentText('');
      setCommentCount(commentCount + 1);
    }
  };

  const handleReplyComment = (commentId) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleSubmitReply = (commentId) => {
    if (replyText.trim()) {
      onComment?.(post.id, replyText, commentId);
      setReplyText('');
      setReplyingTo(null);
      setCommentCount(commentCount + 1);
    }
  };

  const handleLikeComment = (commentId) => {
    const newLikedComments = new Set(likedComments);
    if (newLikedComments.has(commentId)) {
      newLikedComments.delete(commentId);
    } else {
      newLikedComments.add(commentId);
    }
    setLikedComments(newLikedComments);
  };

  const handleMediaClick = (index) => {
    setCurrentMediaIndex(index);
    setMediaViewerOpen(true);
  };

  const handleCloseMediaViewer = () => {
    setMediaViewerOpen(false);
  };

  const handlePreviousMedia = () => {
    const media = post.media || [];
    setCurrentMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    const media = post.media || [];
    setCurrentMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const renderMedia = () => {
    const media = post.media || [];
    const mediaCount = media.length;
    
    if (mediaCount === 0) return null;

    // Nếu chỉ có 1 media
    if (mediaCount === 1) {
      const item = media[0];
      return (
        <SingleImage>
          {item.type === 'video' ? (
            <video 
              src={item.url} 
              controls 
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
            />
          ) : (
            <img 
              src={item.url} 
              alt="Post content" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleMediaClick(0)}
            />
          )}
        </SingleImage>
      );
    }

    // Nếu có 2 media
    if (mediaCount === 2) {
      return (
        <MultipleImageGrid mediaCount={2}>
          {media.map((item, index) => (
            <ImageContainer key={index}>
              {item.type === 'video' ? (
                <video 
                  src={item.url} 
                  controls 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img 
                  src={item.url} 
                  alt={`Post content ${index + 1}`} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMediaClick(index)}
                />
              )}
            </ImageContainer>
          ))}
        </MultipleImageGrid>
      );
    }

    // Nếu có 3 media
    if (mediaCount === 3) {
      return (
        <MultipleImageGrid mediaCount={3}>
          {media.map((item, index) => (
            <ImageContainer key={index}>
              {item.type === 'video' ? (
                <video 
                  src={item.url} 
                  controls 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img 
                  src={item.url} 
                  alt={`Post content ${index + 1}`} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMediaClick(index)}
                />
              )}
            </ImageContainer>
          ))}
        </MultipleImageGrid>
      );
    }

    // Nếu có 4 media
    if (mediaCount === 4) {
      return (
        <MultipleImageGrid mediaCount={4}>
          {media.map((item, index) => (
            <ImageContainer key={index}>
              {item.type === 'video' ? (
                <video 
                  src={item.url} 
                  controls 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img 
                  src={item.url} 
                  alt={`Post content ${index + 1}`} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMediaClick(index)}
                />
              )}
            </ImageContainer>
          ))}
        </MultipleImageGrid>
      );
    }

    // Nếu có 5 media (tối đa)
    if (mediaCount === 5) {
      return (
        <MultipleImageGrid mediaCount={5}>
          {media.slice(0, 4).map((item, index) => (
            <ImageContainer key={index} className={index === 3 ? 'last-image' : ''}>
              {item.type === 'video' ? (
                <video 
                  src={item.url} 
                  controls 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img 
                  src={item.url} 
                  alt={`Post content ${index + 1}`} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMediaClick(index)}
                />
              )}
              {index === 3 && mediaCount > 5 && (
                <Box className="more-overlay">
                  <Typography variant="h6" color="white">
                    +{mediaCount - 4}
                  </Typography>
                </Box>
              )}
            </ImageContainer>
          ))}
        </MultipleImageGrid>
      );
    }

    // Nếu có hơn 5 media (hiển thị 4 + overlay)
    return (
      <MultipleImageGrid mediaCount={5}>
        {media.slice(0, 4).map((item, index) => (
          <ImageContainer key={index} className={index === 3 ? 'last-image' : ''}>
            {item.type === 'video' ? (
              <video 
                src={item.url} 
                controls 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img 
                src={item.url} 
                alt={`Post content ${index + 1}`} 
                style={{ cursor: 'pointer' }}
                onClick={() => handleMediaClick(index)}
              />
            )}
            {index === 3 && (
              <Box className="more-overlay">
                <Typography variant="h6" color="white">
                  +{mediaCount - 4}
                </Typography>
              </Box>
            )}
          </ImageContainer>
        ))}
      </MultipleImageGrid>
    );
  };



  return (
    <PostContainer>
      <Card elevation={1}>
        {/* Post Header */}
        <PostHeader>
          <CardHeader
            avatar={
              <Avatar src={post.author.avatar} alt={post.author.name}>
                {post.author.name.charAt(0)}
              </Avatar>
            }
            action={
              <IconButton onClick={handleMoreClick}>
                <MoreVert />
              </IconButton>
            }
                         title={
               <Typography variant="subtitle1" fontWeight="bold">
                 {post.author.name}
               </Typography>
             }
                         subheader={
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                 <TimeChip
                   icon={<AccessTime />}
                   label={formatDistanceToNow(new Date(post.createdAt), { 
                     addSuffix: true, 
                     locale: vi 
                   })}
                   size="small"
                 />
               </Box>
             }
          />
        </PostHeader>

        {/* Post Content */}
        <PostContent>
          <CardContent sx={{ pb: 1 }}>
                         <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
               {post.content}
             </Typography>
             {renderMedia()}
          </CardContent>
        </PostContent>

                 {/* Post Stats */}
         <PostStats>
           <Box sx={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: 1, 
             px: 2, 
             py: 1,
             flexWrap: 'wrap',
             [theme => theme.breakpoints.down('sm')]: {
               px: 1.5,
               py: 0.75,
               gap: 0.5
             }
           }}>
             <Box sx={{ display: 'flex', alignItems: 'center' }}>
               <Avatar sx={{ 
                 width: 20, 
                 height: 20, 
                 bgcolor: 'primary.main',
                 [theme => theme.breakpoints.down('sm')]: {
                   width: 16,
                   height: 16
                 }
               }}>
                 <Favorite sx={{ 
                   fontSize: 12,
                   [theme => theme.breakpoints.down('sm')]: {
                     fontSize: 10
                   }
                 }} />
               </Avatar>
               <Typography variant="body2" sx={{ 
                 ml: 1,
                 [theme => theme.breakpoints.down('sm')]: {
                   fontSize: '0.75rem',
                   ml: 0.5
                 }
               }}>
                 {likeCount} lượt thích
               </Typography>
             </Box>
             <Typography variant="body2" color="text.secondary" sx={{
               [theme => theme.breakpoints.down('sm')]: {
                 fontSize: '0.75rem'
               }
             }}>
               •
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{
               [theme => theme.breakpoints.down('sm')]: {
                 fontSize: '0.75rem'
               }
             }}>
               {commentCount} bình luận
             </Typography>
             {post.shareCount > 0 && (
               <>
                 <Typography variant="body2" color="text.secondary" sx={{
                   [theme => theme.breakpoints.down('sm')]: {
                     fontSize: '0.75rem'
                   }
                 }}>
                   •
                 </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{
                   [theme => theme.breakpoints.down('sm')]: {
                     fontSize: '0.75rem'
                   }
                 }}>
                   {post.shareCount} lượt chia sẻ
                 </Typography>
               </>
             )}
           </Box>
         </PostStats>

        <Divider />

        {/* Post Actions */}
        <PostActionsContainer>
          <ActionButton onClick={handleLike}>
            <LikeButton liked={liked}>
              {liked ? <Favorite color="error" /> : <FavoriteBorder />}
            </LikeButton>
            <Typography variant="body2">Thích</Typography>
          </ActionButton>

          <ActionButton onClick={handleComment}>
            <CommentButton>
              <ChatBubbleOutline />
            </CommentButton>
            <Typography variant="body2">Bình luận</Typography>
          </ActionButton>

          <ActionButton onClick={handleShare}>
            <ShareButton>
              <Share />
            </ShareButton>
            <Typography variant="body2">Chia sẻ</Typography>
          </ActionButton>
        </PostActionsContainer>

                 {/* Comments Section - Desktop Only */}
         <Collapse in={showComments}>
           <CommentSection>
             <Divider />
             
             {/* Comment Input */}
             {showCommentInput && (
               <Box sx={{ 
                 p: 2,
                 [theme => theme.breakpoints.down('sm')]: {
                   p: 1.5
                 }
               }}>
                 <Box sx={{ 
                   display: 'flex', 
                   gap: 1, 
                   alignItems: 'center',
                   [theme => theme.breakpoints.down('sm')]: {
                     gap: 0.5
                   }
                 }}>
                   <Avatar sx={{ 
                     width: 32, 
                     height: 32, 
                     mr: 1,
                     [theme => theme.breakpoints.down('sm')]: {
                       width: 28,
                       height: 28,
                       mr: 0.5
                     }
                   }}>
                     U
                   </Avatar>
                   <CommentInput
                     fullWidth
                     multiline
                     maxRows={2}
                     placeholder="Viết bình luận..."
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     sx={{
                       '& .MuiOutlinedInput-root': {
                         minHeight: '32px',
                         maxHeight: '64px'
                       }
                     }}
                     InputProps={{
                       endAdornment: (
                         <Box sx={{ 
                           display: 'flex', 
                           gap: 0.5,
                           [theme => theme.breakpoints.down('sm')]: {
                             gap: 0.25
                           }
                         }}>
                           <IconButton size="small" sx={{
                             [theme => theme.breakpoints.down('sm')]: {
                               width: 28,
                               height: 28
                             }
                           }}>
                             <EmojiEmotions />
                           </IconButton>
                           <IconButton size="small" sx={{
                             [theme => theme.breakpoints.down('sm')]: {
                               width: 28,
                               height: 28
                             }
                           }}>
                             <AttachFile />
                           </IconButton>
                           <IconButton 
                             size="small" 
                             color="primary"
                             onClick={handleSubmitComment}
                             disabled={!commentText.trim()}
                             sx={{
                               [theme => theme.breakpoints.down('sm')]: {
                                 width: 28,
                                 height: 28
                               }
                             }}
                           >
                             <Send />
                           </IconButton>
                         </Box>
                       )
                     }}
                   />
                 </Box>
               </Box>
             )}

             {/* Comments List */}
             {post.comments && post.comments.length > 0 && (
               <Box sx={{ 
                 maxHeight: 300, 
                 overflow: 'auto',
                 [theme => theme.breakpoints.down('sm')]: {
                   maxHeight: 250
                 }
               }}>
                 {post.comments.map((comment, index) => (
                   <Box key={index}>
                     <CommentItem>
                       <Avatar sx={{ 
                         width: 28, 
                         height: 28, 
                         mr: 1,
                         [theme => theme.breakpoints.down('sm')]: {
                           width: 24,
                           height: 24,
                           mr: 0.5
                         }
                       }}>
                         {comment.author.name.charAt(0)}
                       </Avatar>
                       <Box sx={{ flex: 1 }}>
                         <Box sx={{ 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: 1, 
                           mb: 0.5,
                           flexWrap: 'wrap',
                           [theme => theme.breakpoints.down('sm')]: {
                             gap: 0.5
                           }
                         }}>
                           <Typography variant="body2" fontWeight="bold">
                             {comment.author.name}
                           </Typography>
                           <Typography variant="caption" color="text.secondary">
                             {formatDistanceToNow(new Date(comment.createdAt), { 
                               addSuffix: true, 
                               locale: vi 
                             })}
                           </Typography>
                         </Box>
                         <Typography variant="body2" sx={{ mb: 1 }}>
                           {comment.content}
                         </Typography>
                         
                         {/* Comment Actions */}
                         <Box sx={{ 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: 2,
                           [theme => theme.breakpoints.down('sm')]: {
                             gap: 1
                           }
                         }}>
                           <Box 
                             sx={{ 
                               display: 'flex', 
                               alignItems: 'center', 
                               gap: 0.5, 
                               cursor: 'pointer',
                               color: likedComments.has(comment.id) ? 'error.main' : 'text.secondary',
                               '&:hover': { color: 'error.main' }
                             }}
                             onClick={() => handleLikeComment(comment.id)}
                           >
                             {likedComments.has(comment.id) ? (
                               <HeartIcon sx={{ 
                                 fontSize: 16,
                                 [theme => theme.breakpoints.down('sm')]: {
                                   fontSize: 14
                                 }
                               }} />
                             ) : (
                               <HeartBorderIcon sx={{ 
                                 fontSize: 16,
                                 [theme => theme.breakpoints.down('sm')]: {
                                   fontSize: 14
                                 }
                               }} />
                             )}
                             <Typography variant="caption">
                               {comment.likeCount || 0}
                             </Typography>
                           </Box>
                           
                           <Box 
                             sx={{ 
                               display: 'flex', 
                               alignItems: 'center', 
                               gap: 0.5, 
                               cursor: 'pointer',
                               color: 'text.secondary',
                               '&:hover': { color: 'primary.main' }
                             }}
                             onClick={() => handleReplyComment(comment.id)}
                           >
                             <Reply sx={{ 
                               fontSize: 16,
                               [theme => theme.breakpoints.down('sm')]: {
                                 fontSize: 14
                               }
                             }} />
                             <Typography variant="caption">Trả lời</Typography>
                           </Box>
                         </Box>
                       </Box>
                     </CommentItem>
                     
                     {/* Reply Input */}
                     {replyingTo === comment.id && (
                       <Box sx={{ pl: 4, pr: 2, pb: 2, pt: 1 }}>
                         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                           <Avatar sx={{ width: 24, height: 24, mr: 1, flexShrink: 0 }}>
                             U
                           </Avatar>
                           <Box sx={{ flex: 1 }}>
                             <CommentInput
                               fullWidth
                               multiline
                               maxRows={1}
                               placeholder={`Trả lời ${comment.author.name}...`}
                               value={replyText}
                               onChange={(e) => setReplyText(e.target.value)}
                               size="small"
                               sx={{
                                 '& .MuiOutlinedInput-root': {
                                   fontSize: '0.875rem',
                                   minHeight: '24px',
                                   maxHeight: '32px'
                                 }
                               }}
                               InputProps={{
                                 endAdornment: (
                                   <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                     <IconButton 
                                       size="small" 
                                       color="primary"
                                       onClick={() => handleSubmitReply(comment.id)}
                                       disabled={!replyText.trim()}
                                       sx={{ 
                                         width: 24, 
                                         height: 24,
                                         '& .MuiSvgIcon-root': { fontSize: 14 }
                                       }}
                                     >
                                       <Send />
                                     </IconButton>
                                     <IconButton 
                                       size="small"
                                       onClick={handleCancelReply}
                                       sx={{ 
                                         width: 24, 
                                         height: 24,
                                         color: 'text.secondary'
                                       }}
                                     >
                                       <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                         Hủy
                                       </Typography>
                                     </IconButton>
                                   </Box>
                                 )
                               }}
                             />
                           </Box>
                         </Box>
                       </Box>
                     )}
                     
                     {/* Replies */}
                     {comment.replies && comment.replies.length > 0 && (
                       <Box sx={{ pl: 4 }}>
                         {comment.replies.map((reply, replyIndex) => (
                           <CommentItem key={replyIndex} sx={{ py: 0.5 }}>
                             <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                               {reply.author.name.charAt(0)}
                             </Avatar>
                             <Box sx={{ flex: 1 }}>
                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                 <Typography variant="body2" fontWeight="bold">
                                   {reply.author.name}
                                 </Typography>
                                 <Typography variant="caption" color="text.secondary">
                                   {formatDistanceToNow(new Date(reply.createdAt), { 
                                     addSuffix: true, 
                                     locale: vi 
                                   })}
                                 </Typography>
                               </Box>
                               <Typography variant="body2" sx={{ mb: 1 }}>
                                 {reply.content}
                               </Typography>
                               
                               {/* Reply Actions */}
                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                 <Box 
                                   sx={{ 
                                     display: 'flex', 
                                     alignItems: 'center', 
                                     gap: 0.5, 
                                     cursor: 'pointer',
                                     color: likedComments.has(reply.id) ? 'error.main' : 'text.secondary',
                                     '&:hover': { color: 'error.main' }
                                   }}
                                   onClick={() => handleLikeComment(reply.id)}
                                 >
                                   {likedComments.has(reply.id) ? (
                                     <HeartIcon sx={{ fontSize: 14 }} />
                                   ) : (
                                     <HeartBorderIcon sx={{ fontSize: 14 }} />
                                   )}
                                   <Typography variant="caption">
                                     {reply.likeCount || 0}
                                   </Typography>
                                 </Box>
                               </Box>
                             </Box>
                           </CommentItem>
                         ))}
                       </Box>
                     )}
                   </Box>
                 ))}
               </Box>
             )}
           </CommentSection>
         </Collapse>

        {/* More Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMoreClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 200 }
          }}
        >
          {post.author.id === 'current-user-id' ? (
            <>
              <MenuItem onClick={handleEdit}>
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText>Chỉnh sửa</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <Delete fontSize="small" />
                </ListItemIcon>
                <ListItemText>Xóa bài viết</ListItemText>
              </MenuItem>
            </>
          ) : (
            <MenuItem>
              <ListItemIcon>
                <Flag fontSize="small" />
              </ListItemIcon>
              <ListItemText>Báo cáo</ListItemText>
            </MenuItem>
          )}
                 </Menu>
       </Card>

       {/* Media Viewer Modal */}
       <Dialog
         open={mediaViewerOpen}
         onClose={handleCloseMediaViewer}
         maxWidth="lg"
         fullWidth
         PaperProps={{
           sx: {
             backgroundColor: 'rgba(0, 0, 0, 0.9)',
             boxShadow: 'none',
             borderRadius: 0
           }
         }}
       >
         <DialogContent sx={{ p: 0, position: 'relative', minHeight: '80vh' }}>
           {/* Close Button */}
           <IconButton
             onClick={handleCloseMediaViewer}
             sx={{
               position: 'absolute',
               top: 16,
               right: 16,
               zIndex: 10,
               color: 'white',
               backgroundColor: 'rgba(0, 0, 0, 0.5)',
               '&:hover': {
                 backgroundColor: 'rgba(0, 0, 0, 0.7)'
               }
             }}
           >
             <Close />
           </IconButton>

           {/* Navigation Buttons */}
           {post.media && post.media.length > 1 && (
             <>
               <IconButton
                 onClick={handlePreviousMedia}
                 sx={{
                   position: 'absolute',
                   left: 16,
                   top: '50%',
                   transform: 'translateY(-50%)',
                   zIndex: 10,
                   color: 'white',
                   backgroundColor: 'rgba(0, 0, 0, 0.5)',
                   '&:hover': {
                     backgroundColor: 'rgba(0, 0, 0, 0.7)'
                   }
                 }}
               >
                 <NavigateBefore />
               </IconButton>
               <IconButton
                 onClick={handleNextMedia}
                 sx={{
                   position: 'absolute',
                   right: 16,
                   top: '50%',
                   transform: 'translateY(-50%)',
                   zIndex: 10,
                   color: 'white',
                   backgroundColor: 'rgba(0, 0, 0, 0.5)',
                   '&:hover': {
                     backgroundColor: 'rgba(0, 0, 0, 0.7)'
                   }
                 }}
               >
                 <NavigateNext />
               </IconButton>
             </>
           )}

           {/* Media Display */}
           {post.media && post.media[currentMediaIndex] && (
             <Box
               sx={{
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 height: '100%',
                 minHeight: '80vh'
               }}
             >
               {post.media[currentMediaIndex].type === 'video' ? (
                 <video
                   src={post.media[currentMediaIndex].url}
                   controls
                   style={{
                     maxWidth: '100%',
                     maxHeight: '100%',
                     objectFit: 'contain'
                   }}
                 />
               ) : (
                 <img
                   src={post.media[currentMediaIndex].url}
                   alt={`Post content ${currentMediaIndex + 1}`}
                   style={{
                     maxWidth: '100%',
                     maxHeight: '100%',
                     objectFit: 'contain'
                   }}
                 />
               )}
             </Box>
           )}

           {/* Media Counter */}
           {post.media && post.media.length > 1 && (
             <Box
               sx={{
                 position: 'absolute',
                 bottom: 16,
                 left: '50%',
                 transform: 'translateX(-50%)',
                 color: 'white',
                 backgroundColor: 'rgba(0, 0, 0, 0.5)',
                 px: 2,
                 py: 1,
                 borderRadius: 1,
                 fontSize: '0.875rem'
               }}
             >
               {currentMediaIndex + 1} / {post.media.length}
             </Box>
           )}
         </DialogContent>
                </Dialog>

         {/* Comment Modal - Mobile Only */}
         <Dialog
           open={commentModalOpen}
           onClose={() => setCommentModalOpen(false)}
           fullScreen
           PaperProps={{
             sx: {
               backgroundColor: 'white',
               borderRadius: 0
             }
           }}
         >
           <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
             {/* Header */}
             <Box sx={{ 
               p: 2, 
               borderBottom: '1px solid', 
               borderColor: 'divider',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between'
             }}>
               <Typography variant="h6" fontWeight="bold">
                 Bình luận ({commentCount})
               </Typography>
               <IconButton onClick={() => setCommentModalOpen(false)}>
                 <Close />
               </IconButton>
             </Box>

             {/* Comment Input */}
             <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
               <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                 <Avatar sx={{ width: 40, height: 40, mr: 1 }}>
                   U
                 </Avatar>
                 <CommentInput
                   fullWidth
                   multiline
                   maxRows={3}
                   placeholder="Viết bình luận..."
                   value={commentText}
                   onChange={(e) => setCommentText(e.target.value)}
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       minHeight: '48px',
                       maxHeight: '96px'
                     }
                   }}
                   InputProps={{
                     endAdornment: (
                       <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                         <IconButton size="small">
                           <EmojiEmotions />
                         </IconButton>
                         <IconButton size="small">
                           <AttachFile />
                         </IconButton>
                         <IconButton 
                           size="small" 
                           color="primary"
                           onClick={handleSubmitComment}
                           disabled={!commentText.trim()}
                         >
                           <Send />
                         </IconButton>
                       </Box>
                     )
                   }}
                 />
               </Box>
             </Box>

             {/* Comments List */}
             <Box sx={{ flex: 1, overflow: 'auto' }}>
               {post.comments && post.comments.length > 0 ? (
                 post.comments.map((comment, index) => (
                   <Box key={index}>
                     <CommentItem>
                       <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                         {comment.author.name.charAt(0)}
                       </Avatar>
                       <Box sx={{ flex: 1 }}>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                           <Typography variant="body2" fontWeight="bold">
                             {comment.author.name}
                           </Typography>
                           <Typography variant="caption" color="text.secondary">
                             {formatDistanceToNow(new Date(comment.createdAt), { 
                               addSuffix: true, 
                               locale: vi 
                             })}
                           </Typography>
                         </Box>
                         <Typography variant="body2" sx={{ mb: 1 }}>
                           {comment.content}
                         </Typography>
                         
                         {/* Comment Actions */}
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                           <Box 
                             sx={{ 
                               display: 'flex', 
                               alignItems: 'center', 
                               gap: 0.5, 
                               cursor: 'pointer',
                               color: likedComments.has(comment.id) ? 'error.main' : 'text.secondary',
                               '&:hover': { color: 'error.main' }
                             }}
                             onClick={() => handleLikeComment(comment.id)}
                           >
                             {likedComments.has(comment.id) ? (
                               <HeartIcon sx={{ fontSize: 16 }} />
                             ) : (
                               <HeartBorderIcon sx={{ fontSize: 16 }} />
                             )}
                             <Typography variant="caption">
                               {comment.likeCount || 0}
                             </Typography>
                           </Box>
                           
                           <Box 
                             sx={{ 
                               display: 'flex', 
                               alignItems: 'center', 
                               gap: 0.5, 
                               cursor: 'pointer',
                               color: 'text.secondary',
                               '&:hover': { color: 'primary.main' }
                             }}
                             onClick={() => handleReplyComment(comment.id)}
                           >
                             <Reply sx={{ fontSize: 16 }} />
                             <Typography variant="caption">Trả lời</Typography>
                           </Box>
                         </Box>
                       </Box>
                     </CommentItem>
                     
                     {/* Reply Input */}
                     {replyingTo === comment.id && (
                       <Box sx={{ pl: 4, pr: 2, pb: 2, pt: 1 }}>
                         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                           <Avatar sx={{ width: 28, height: 28, mr: 1, flexShrink: 0 }}>
                             U
                           </Avatar>
                           <Box sx={{ flex: 1 }}>
                             <CommentInput
                               fullWidth
                               multiline
                               maxRows={2}
                               placeholder={`Trả lời ${comment.author.name}...`}
                               value={replyText}
                               onChange={(e) => setReplyText(e.target.value)}
                               size="small"
                               sx={{
                                 '& .MuiOutlinedInput-root': {
                                   fontSize: '0.875rem',
                                   minHeight: '32px',
                                   maxHeight: '64px'
                                 }
                               }}
                               InputProps={{
                                 endAdornment: (
                                   <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                     <IconButton 
                                       size="small" 
                                       color="primary"
                                       onClick={() => handleSubmitReply(comment.id)}
                                       disabled={!replyText.trim()}
                                       sx={{ width: 24, height: 24 }}
                                     >
                                       <Send sx={{ fontSize: 14 }} />
                                     </IconButton>
                                     <IconButton 
                                       size="small"
                                       onClick={handleCancelReply}
                                       sx={{ width: 24, height: 24, color: 'text.secondary' }}
                                     >
                                       <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                         Hủy
                                       </Typography>
                                     </IconButton>
                                   </Box>
                                 )
                               }}
                             />
                           </Box>
                         </Box>
                       </Box>
                     )}
                     
                     {/* Replies */}
                     {comment.replies && comment.replies.length > 0 && (
                       <Box sx={{ pl: 4 }}>
                         {comment.replies.map((reply, replyIndex) => (
                           <CommentItem key={replyIndex} sx={{ py: 0.5 }}>
                             <Avatar sx={{ width: 28, height: 24, mr: 1 }}>
                               {reply.author.name.charAt(0)}
                             </Avatar>
                             <Box sx={{ flex: 1 }}>
                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                 <Typography variant="body2" fontWeight="bold">
                                   {reply.author.name}
                                 </Typography>
                                 <Typography variant="caption" color="text.secondary">
                                   {formatDistanceToNow(new Date(reply.createdAt), { 
                                     addSuffix: true, 
                                     locale: vi 
                                   })}
                                 </Typography>
                               </Box>
                               <Typography variant="body2" sx={{ mb: 1 }}>
                                 {reply.content}
                               </Typography>
                               
                               {/* Reply Actions */}
                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                 <Box 
                                   sx={{ 
                                     display: 'flex', 
                                     alignItems: 'center', 
                                     gap: 0.5, 
                                     cursor: 'pointer',
                                     color: likedComments.has(reply.id) ? 'error.main' : 'text.secondary',
                                     '&:hover': { color: 'error.main' }
                                   }}
                                   onClick={() => handleLikeComment(reply.id)}
                                 >
                                   {likedComments.has(reply.id) ? (
                                     <HeartIcon sx={{ fontSize: 14 }} />
                                   ) : (
                                     <HeartBorderIcon sx={{ fontSize: 14 }} />
                                   )}
                                   <Typography variant="caption">
                                     {reply.likeCount || 0}
                                   </Typography>
                                 </Box>
                               </Box>
                             </Box>
                           </CommentItem>
                         ))}
                       </Box>
                     )}
                   </Box>
                 ))
               ) : (
                 <Box sx={{ p: 3, textAlign: 'center' }}>
                   <Typography variant="body2" color="text.secondary">
                     Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                   </Typography>
                 </Box>
               )}
             </Box>
           </DialogContent>
         </Dialog>
       </PostContainer>
     );
   };

  Post.propTypes = {
    post: PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
      likeCount: PropTypes.number,
      commentCount: PropTypes.number,
      shareCount: PropTypes.number,
      isLiked: PropTypes.bool,
      media: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf(['image', 'video']).isRequired,
        url: PropTypes.string.isRequired,
      })),
      comments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        content: PropTypes.string,
        author: PropTypes.shape({
          name: PropTypes.string,
          avatar: PropTypes.string
        }),
        createdAt: PropTypes.string,
        likeCount: PropTypes.number,
        replies: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          content: PropTypes.string,
          author: PropTypes.shape({
            name: PropTypes.string,
            avatar: PropTypes.string
          }),
          createdAt: PropTypes.string,
          likeCount: PropTypes.number
        }))
      }))
    }).isRequired,
    onLike: PropTypes.func,
    onComment: PropTypes.func,
    onShare: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func
  };

export default Post;
