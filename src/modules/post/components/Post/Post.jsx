import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import postAPI from "@post/api/postAPI";
import { updatePost as updatePostInStore } from "../../redux/slices/postSlice";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
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
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  MoreVert,
  Edit,
  Delete,
  DeleteForever,
  Flag,
  AccessTime,
  Send,
  EmojiEmotions,
  AttachFile,
  Reply,
  Favorite as HeartIcon,
  FavoriteBorder as HeartBorderIcon,
  Close,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  PostContainer,
  PostActionsContainer,
  CommentSection,
  CommentInput,
  CommentItem,
  PostStats,
  PostHeader,
  PostContent,
  ActionButton,
  LikeButton,
  CommentButton,
  ShareButton,
  TimeChip,
  ImageContainer,
  SingleImage,
  MultipleImageGrid,
} from "./Post.styles";

const Post = ({ post, onLike, onComment, onShare, onDelete, onEdit }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id || currentUser?.id;
  const currentUserIdStr =
    currentUserId && currentUserId.toString
      ? currentUserId.toString()
      : String(currentUserId || "");
  const isPostOwnerUser =
    String(post.author?._id || post.author?.id || "") === currentUserIdStr;
  const isOwner =
    (post.author?._id && post.author._id === currentUserId) ||
    (post.author?.id && post.author.id === currentUserId);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(
    (typeof post.likesCount === "number" ? post.likesCount : post.likeCount) ||
      0
  );
  const [commentCount, setCommentCount] = useState(
    (typeof post.commentsCount === "number"
      ? post.commentsCount
      : post.commentCount) || 0
  );
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(
    Array.isArray(post.comments) ? post.comments : []
  );
  const [loadingComments, setLoadingComments] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [likedComments, setLikedComments] = useState(new Set());
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [editPrivacy, setEditPrivacy] = useState(post.privacy || "public");
  const [editMedia, setEditMedia] = useState(
    Array.isArray(post.media) ? [...post.media] : []
  );
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [mediaRemoveKeys, setMediaRemoveKeys] = useState(new Set());
  const getCommentId = (c) =>
    c && (c._id || c.id) ? String(c._id || c.id) : undefined;

  // Debug logs for owner checks
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('[DBG] owner check', {
        postId: post?._id,
        postAuthor: post?.author,
        currentUserIdStr,
        isPostOwnerUser,
      });
    } catch (_) {}
  }, [post?._id, post?.author, currentUserIdStr, isPostOwnerUser]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => {
      const next = liked ? prev - 1 : prev + 1;
      return next < 0 ? 0 : next;
    });
    onLike?.(post._id, !liked);
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
      // Lazy load comments when the section is first opened
      if (!loadingComments && comments.length === 0) {
        (async () => {
          try {
            setLoadingComments(true);
            const res = await postAPI.getComments(post._id, {
              page: 1,
              limit: 50,
            });
            const items = res?.data || res;
            if (Array.isArray(items)) {
              setComments(items);
            }
          } finally {
            setLoadingComments(false);
          }
        })();
      }
    }
  };

  const handleShare = () => {
    onShare?.(post._id);
  };

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete?.(post._id);
    handleMoreClose();
  };

  const handleEdit = () => {
    setEditContent(post.content || "");
    setEditPrivacy(post.privacy || "public");
    setEditMedia(Array.isArray(post.media) ? [...post.media] : []);
    setNewMediaFiles([]);
    setMediaRemoveKeys(new Set());
    setEditOpen(true);
    handleMoreClose();
  };

  const handleSaveEdit = async () => {
    if (!isOwner) return;
    try {
      setEditSaving(true);
      const payload = { content: editContent, privacy: editPrivacy };
      const mediaRemove = Array.from(mediaRemoveKeys);
      const files = newMediaFiles.map((m) => m.file).filter(Boolean);
      const res = await postAPI.updatePost(post._id, payload, {
        mediaFiles: files,
        mediaRemove,
      });
      const updated = res?.data || res; // handle either wrapped or direct
      dispatch(
        updatePostInStore({
          postId: post._id,
          updates: {
            content: updated?.content ?? editContent,
            privacy: updated?.privacy ?? editPrivacy,
            media: Array.isArray(updated?.media) ? updated.media : editMedia,
          },
        })
      );
      setEditOpen(false);
    } catch (e) {
      // simple fallback: close but do not update
    } finally {
      setEditSaving(false);
    }
  };

  const getMediaKey = (m) => m.publicId || m.url;

  const handleRemoveExistingMedia = (m) => {
    const key = getMediaKey(m);
    const next = new Set(mediaRemoveKeys);
    next.add(key);
    setMediaRemoveKeys(next);
    setEditMedia((prev) => prev.filter((x) => getMediaKey(x) !== key));
  };

  const handleAddNewMedia = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const items = files.map((file) => ({
      id: `${Date.now()}_${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
    }));
    setNewMediaFiles((prev) => [...prev, ...items]);
    // reset input value to allow re-uploading same file
    e.target.value = "";
  };

  const handleRemoveNewMedia = (id) => {
    setNewMediaFiles((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item?.url) URL.revokeObjectURL(item.url);
      return prev.filter((x) => x.id !== id);
    });
  };

  const handleSubmitComment = async () => {
    if (commentText.trim()) {
      try {
        const res = await postAPI.createComment(post._id, {
          content: commentText,
        });
        const created = res?.data || res;
        if (created) {
          setComments((prev) => [created, ...prev]);
        }
        setCommentText("");
        setCommentCount((c) => c + 1);
        onComment?.(post._id, commentText);
      } catch (_) {}
    }
  };

  const handleReplyComment = async (commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
    // Lazy load replies for this comment if not present
    const found = comments.find((c) => getCommentId(c) === String(commentId));
    if (found && !Array.isArray(found.replies)) {
      try {
        const res = await postAPI.getReplies(String(commentId), {
          page: 1,
          limit: 20,
        });
        const items = res?.data || res;
        setComments((prev) =>
          prev.map((c) =>
            getCommentId(c) === String(commentId)
              ? { ...c, replies: Array.isArray(items) ? items : [] }
              : c
          )
        );
      } catch (_) {}
    }
    setExpandedReplies((prev) => new Set(prev).add(String(commentId)));
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSubmitReply = async (commentId) => {
    if (replyText.trim()) {
      try {
        const res = await postAPI.createComment(post._id, {
          content: replyText,
          parentId: String(commentId),
        });
        const created = res?.data || res;
        if (created) {
          setComments((prev) =>
            prev.map((c) => {
              if (getCommentId(c) === String(commentId)) {
                const nextReplies = [created, ...(c.replies || [])];
                const nextReplyCount =
                  (typeof c.replyCount === "number"
                    ? c.replyCount
                    : c.replies?.length || 0) + 1;
                return {
                  ...c,
                  replies: nextReplies,
                  replyCount: nextReplyCount,
                };
              }
              return c;
            })
          );
          // ensure expanded to show new reply
          setExpandedReplies((prev) => new Set(prev).add(String(commentId)));
        }
        setReplyText("");
        setReplyingTo(null);
        setCommentCount((c) => c + 1);
        onComment?.(post._id, replyText, commentId);
      } catch (_) {}
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
          {item.type === "video" ? (
            <video
              src={item.url}
              controls
              style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
            />
          ) : (
            <img
              src={item.url}
              alt="Post content"
              style={{ cursor: "pointer" }}
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
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Post content ${index + 1}`}
                  style={{ cursor: "pointer" }}
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
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Post content ${index + 1}`}
                  style={{ cursor: "pointer" }}
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
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Post content ${index + 1}`}
                  style={{ cursor: "pointer" }}
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
            <ImageContainer
              key={index}
              className={index === 3 ? "last-image" : ""}
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Post content ${index + 1}`}
                  style={{ cursor: "pointer" }}
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
          <ImageContainer
            key={index}
            className={index === 3 ? "last-image" : ""}
          >
            {item.type === "video" ? (
              <video
                src={item.url}
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <img
                src={item.url}
                alt={`Post content ${index + 1}`}
                style={{ cursor: "pointer" }}
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
              <Avatar
                src={post.author?.profilePicture}
                alt={post.author?.fullName || "User"}
              >
                {(post.author?.fullName || "U").charAt(0)}
              </Avatar>
            }
            action={
              <IconButton onClick={handleMoreClick}>
                <MoreVert />
              </IconButton>
            }
            title={
              <Typography variant="subtitle1" fontWeight="bold">
                {post.author?.fullName || "Unknown User"}
              </Typography>
            }
            subheader={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <TimeChip
                  icon={<AccessTime />}
                  label={formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: vi,
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              flexWrap: "wrap",
              [(theme) => theme.breakpoints.down("sm")]: {
                px: 1.5,
                py: 0.75,
                gap: 0.5,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: "primary.main",
                  [(theme) => theme.breakpoints.down("sm")]: {
                    width: 16,
                    height: 16,
                  },
                }}
              >
                <Favorite
                  sx={{
                    fontSize: 12,
                    [(theme) => theme.breakpoints.down("sm")]: {
                      fontSize: 10,
                    },
                  }}
                />
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  [(theme) => theme.breakpoints.down("sm")]: {
                    fontSize: "0.75rem",
                    ml: 0.5,
                  },
                }}
              >
                {likeCount} lượt thích
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                [(theme) => theme.breakpoints.down("sm")]: {
                  fontSize: "0.75rem",
                },
              }}
            >
              •
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                [(theme) => theme.breakpoints.down("sm")]: {
                  fontSize: "0.75rem",
                },
              }}
            >
              {commentCount} bình luận
            </Typography>
            {(post.sharesCount ?? post.shareCount ?? 0) > 0 && (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    [(theme) => theme.breakpoints.down("sm")]: {
                      fontSize: "0.75rem",
                    },
                  }}
                >
                  •
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    [(theme) => theme.breakpoints.down("sm")]: {
                      fontSize: "0.75rem",
                    },
                  }}
                >
                  {post.sharesCount ?? post.shareCount ?? 0} lượt chia sẻ
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
              <Box
                sx={{
                  p: 2,
                  [(theme) => theme.breakpoints.down("sm")]: {
                    p: 1.5,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    [(theme) => theme.breakpoints.down("sm")]: {
                      gap: 0.5,
                    },
                  }}
                >
                  <Avatar
                    src={currentUser?.profilePicture}
                    alt={currentUser?.fullName || "User"}
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      [(theme) => theme.breakpoints.down("sm")]: {
                        width: 28,
                        height: 28,
                        mr: 0.5,
                      },
                    }}
                  >
                    {(currentUser?.fullName || "U").charAt(0)}
                  </Avatar>
                  <CommentInput
                    fullWidth
                    multiline
                    maxRows={2}
                    placeholder="Viết bình luận..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        minHeight: "32px",
                        maxHeight: "64px",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            [(theme) => theme.breakpoints.down("sm")]: {
                              gap: 0.25,
                            },
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              [(theme) => theme.breakpoints.down("sm")]: {
                                width: 28,
                                height: 28,
                              },
                            }}
                          >
                            <EmojiEmotions />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              [(theme) => theme.breakpoints.down("sm")]: {
                                width: 28,
                                height: 28,
                              },
                            }}
                          >
                            <AttachFile />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={handleSubmitComment}
                            disabled={!commentText.trim()}
                            sx={{
                              [(theme) => theme.breakpoints.down("sm")]: {
                                width: 28,
                                height: 28,
                              },
                            }}
                          >
                            <Send />
                          </IconButton>
                        </Box>
                      ),
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Comments List */}
            {comments && comments.length > 0 && (
              <Box
                sx={{
                  maxHeight: 300,
                  overflow: "auto",
                  [(theme) => theme.breakpoints.down("sm")]: {
                    maxHeight: 250,
                  },
                }}
              >
                {comments.map((comment, index) => (
                  <Box key={index}>
                    <CommentItem>
                      <Avatar
                        src={comment.author?.profilePicture}
                        alt={
                          comment.author?.fullName ||
                          comment.author?.name ||
                          "User"
                        }
                        sx={{
                          width: 28,
                          height: 28,
                          mr: 1,
                          [(theme) => theme.breakpoints.down("sm")]: {
                            width: 24,
                            height: 24,
                            mr: 0.5,
                          },
                        }}
                      >
                        {(
                          comment.author?.fullName ||
                          comment.author?.name ||
                          "U"
                        ).charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                            flexWrap: "wrap",
                            [(theme) => theme.breakpoints.down("sm")]: {
                              gap: 0.5,
                            },
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {comment.author?.fullName ||
                              comment.author?.name ||
                              "Unknown User"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {comment.content}
                        </Typography>

                        {/* Comment Actions */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            [(theme) => theme.breakpoints.down("sm")]: {
                              gap: 1,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              cursor: "pointer",
                              color: likedComments.has(comment.id)
                                ? "error.main"
                                : "text.secondary",
                              "&:hover": { color: "error.main" },
                            }}
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            {likedComments.has(comment.id) ? (
                              <HeartIcon
                                sx={{
                                  fontSize: 16,
                                  [(theme) => theme.breakpoints.down("sm")]: {
                                    fontSize: 14,
                                  },
                                }}
                              />
                            ) : (
                              <HeartBorderIcon
                                sx={{
                                  fontSize: 16,
                                  [(theme) => theme.breakpoints.down("sm")]: {
                                    fontSize: 14,
                                  },
                                }}
                              />
                            )}
                            <Typography variant="caption">
                              {comment.likeCount || 0}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              cursor: "pointer",
                              color: "text.secondary",
                              "&:hover": { color: "primary.main" },
                            }}
                            onClick={() =>
                              handleReplyComment(getCommentId(comment))
                            }
                          >
                            <Reply
                              sx={{
                                fontSize: 16,
                                [(theme) => theme.breakpoints.down("sm")]: {
                                  fontSize: 14,
                                },
                              }}
                            />
                            <Typography variant="caption">Trả lời</Typography>
                          </Box>
                          {(String(comment.author?._id || comment.author?.id || "") === currentUserIdStr || isPostOwnerUser) && (
                            <IconButton
                              size="small"
                              color="error"
                              aria-label="delete comment"
                              onClick={async () => {
                                try {
                                  await postAPI.deleteComment(getCommentId(comment));
                                  setComments((prev) => prev.filter((c) => getCommentId(c) !== getCommentId(comment)));
                                  setCommentCount((c) => Math.max(0, c - 1));
                                } catch (_) {}
                              }}
                            >
                              <DeleteForever fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </CommentItem>

                    {/* Reply Input */}
                    {replyingTo === getCommentId(comment) && (
                      <Box sx={{ pl: 4, pr: 2, pb: 2, pt: 1 }}>
                        <Box
                          sx={{ display: "flex", gap: 1, alignItems: "center" }}
                        >
                          <Avatar
                            sx={{ width: 24, height: 24, mr: 1, flexShrink: 0 }}
                          >
                            U
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <CommentInput
                              fullWidth
                              multiline
                              maxRows={1}
                              placeholder={`Trả lời ${
                                comment.author?.fullName ||
                                comment.author?.name ||
                                "Unknown User"
                              }...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              size="small"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  fontSize: "0.875rem",
                                  minHeight: "24px",
                                  maxHeight: "32px",
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 0.5,
                                      alignItems: "center",
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        handleSubmitReply(getCommentId(comment))
                                      }
                                      disabled={!replyText.trim()}
                                      sx={{ width: 24, height: 24 }}
                                    >
                                      <Send sx={{ fontSize: 14 }} />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={handleCancelReply}
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        color: "text.secondary",
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{ fontSize: "0.7rem" }}
                                      >
                                        Hủy
                                      </Typography>
                                    </IconButton>
                                  </Box>
                                ),
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Replies */}
                    {(comment.replyCount > 0 ||
                      (comment.replies && comment.replies.length > 0)) && (
                      <Box sx={{ pl: 4 }}>
                        {/* Toggle show/hide replies */}
                        {!expandedReplies.has(getCommentId(comment)) ? (
                          <Button
                            size="small"
                            sx={{ textTransform: "none", mb: 1, pl: 0 }}
                            onClick={() =>
                              setExpandedReplies((prev) =>
                                new Set(prev).add(getCommentId(comment))
                              )
                            }
                          >
                            Xem{" "}
                            {comment.replyCount || comment.replies?.length || 0}{" "}
                            trả lời
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            sx={{ textTransform: "none", mb: 1, pl: 0 }}
                            onClick={() =>
                              setExpandedReplies((prev) => {
                                const s = new Set(prev);
                                s.delete(getCommentId(comment));
                                return s;
                              })
                            }
                          >
                            Ẩn trả lời
                          </Button>
                        )}

                        {expandedReplies.has(getCommentId(comment)) &&
                          (comment.replies || []).map((reply, replyIndex) => (
                            <CommentItem key={replyIndex} sx={{ py: 0.5 }}>
                              <Avatar
                                src={reply.author?.profilePicture}
                                alt={
                                  reply.author?.fullName ||
                                  reply.author?.name ||
                                  "User"
                                }
                                sx={{ width: 24, height: 24, mr: 1 }}
                              >
                                {(
                                  reply.author?.fullName ||
                                  reply.author?.name ||
                                  "U"
                                ).charAt(0)}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <Typography variant="body2" fontWeight="bold">
                                    {reply.author?.fullName ||
                                      reply.author?.name ||
                                      "Unknown User"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatDistanceToNow(
                                      new Date(reply.createdAt),
                                      {
                                        addSuffix: true,
                                        locale: vi,
                                      }
                                    )}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {reply.content}
                                </Typography>

                                {/* Reply Actions */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                      cursor: "pointer",
                                      color: likedComments.has(reply.id)
                                        ? "error.main"
                                        : "text.secondary",
                                      "&:hover": { color: "error.main" },
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
            sx: { minWidth: 200 },
          }}
        >
          {isOwner ? (
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
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            boxShadow: "none",
            borderRadius: 0,
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative", minHeight: "80vh" }}>
          {/* Close Button */}
          <IconButton
            onClick={handleCloseMediaViewer}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
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
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                  },
                }}
              >
                <NavigateBefore />
              </IconButton>
              <IconButton
                onClick={handleNextMedia}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                  },
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: "80vh",
              }}
            >
              {post.media[currentMediaIndex].type === "video" ? (
                <video
                  src={post.media[currentMediaIndex].url}
                  controls
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <img
                  src={post.media[currentMediaIndex].url}
                  alt={`Post content ${currentMediaIndex + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </Box>
          )}

          {/* Media Counter */}
          {post.media && post.media.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                px: 2,
                py: 1,
                borderRadius: 1,
                fontSize: "0.875rem",
              }}
            >
              {currentMediaIndex + 1} / {post.media.length}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Chỉnh sửa bài viết
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Chip
              label="Công khai"
              color={editPrivacy === "public" ? "primary" : "default"}
              onClick={() => setEditPrivacy("public")}
              size="small"
            />
            <Chip
              label="Bạn bè"
              color={editPrivacy === "friends" ? "primary" : "default"}
              onClick={() => setEditPrivacy("friends")}
              size="small"
            />
            <Chip
              label="Riêng tư"
              color={editPrivacy === "private" ? "primary" : "default"}
              onClick={() => setEditPrivacy("private")}
              size="small"
            />
          </Box>

          {/* Existing media */}
          {editMedia.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
              }}
            >
              {editMedia.map((m) => (
                <Box key={getMediaKey(m)} sx={{ position: "relative" }}>
                  {m.type === "video" ? (
                    <video
                      src={m.url}
                      style={{ width: "100%", borderRadius: 8 }}
                      controls
                    />
                  ) : (
                    <img
                      src={m.url}
                      alt="media"
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveExistingMedia(m)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {/* New media */}
          {newMediaFiles.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
              }}
            >
              {newMediaFiles.map((m) => (
                <Box key={m.id} sx={{ position: "relative" }}>
                  {m.type === "video" ? (
                    <video
                      src={m.url}
                      style={{ width: "100%", borderRadius: 8 }}
                      controls
                    />
                  ) : (
                    <img
                      src={m.url}
                      alt="new"
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveNewMedia(m.id)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {/* Add media */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              sx={{ textTransform: "none" }}
            >
              Thêm ảnh/video
              <input
                type="file"
                hidden
                multiple
                accept="image/*,video/*"
                onChange={handleAddNewMedia}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Hủy</Button>
          <Button
            onClick={handleSaveEdit}
            disabled={editSaving}
            variant="contained"
          >
            {editSaving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Lưu"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Modal - Mobile Only */}
      <Dialog
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: "white",
            borderRadius: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Bình luận ({commentCount})
            </Typography>
            <IconButton onClick={() => setCommentModalOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          {/* Comment Input */}
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Avatar
                src={currentUser?.profilePicture}
                alt={currentUser?.fullName || "User"}
                sx={{ width: 40, height: 40, mr: 1 }}
              >
                {(currentUser?.fullName || "U").charAt(0)}
              </Avatar>
              <CommentInput
                fullWidth
                multiline
                maxRows={3}
                placeholder="Viết bình luận..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    minHeight: "48px",
                    maxHeight: "96px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <Box
                      sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                    >
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
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Comments List */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box key={index}>
                  <CommentItem>
                    <Avatar
                      src={comment.author?.profilePicture}
                      alt={
                        comment.author?.fullName ||
                        comment.author?.name ||
                        "User"
                      }
                      sx={{ width: 32, height: 32, mr: 1 }}
                    >
                      {(
                        comment.author?.fullName ||
                        comment.author?.name ||
                        "U"
                      ).charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {comment.author?.fullName ||
                            comment.author?.name ||
                            "Unknown User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {comment.content}
                      </Typography>

                      {/* Comment Actions */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: "pointer",
                            color: likedComments.has(comment.id)
                              ? "error.main"
                              : "text.secondary",
                            "&:hover": { color: "error.main" },
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
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: "pointer",
                            color: "text.secondary",
                            "&:hover": { color: "primary.main" },
                          }}
                          onClick={() => handleReplyComment(comment.id)}
                        >
                          <Reply sx={{ fontSize: 16 }} />
                          <Typography variant="caption">Trả lời</Typography>
                        </Box>
                        {(String(
                          comment.author?._id || comment.author?.id || ""
                        ) === currentUserIdStr ||
                          isPostOwnerUser) && (
                          <IconButton
                            size="small"
                            color="error"
                            aria-label="delete comment"
                            onClick={async () => {
                              try {
                                await postAPI.deleteComment(
                                  getCommentId(comment)
                                );
                                setComments((prev) =>
                                  prev.filter(
                                    (c) =>
                                      getCommentId(c) !== getCommentId(comment)
                                  )
                                );
                                setCommentCount((c) => Math.max(0, c - 1));
                              } catch (_) {}
                            }}
                          >
                            <DeleteForever fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </CommentItem>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <Box sx={{ pl: 4, pr: 2, pb: 2, pt: 1 }}>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Avatar
                          src={currentUser?.profilePicture}
                          alt={currentUser?.fullName || "User"}
                          sx={{ width: 28, height: 28, mr: 1, flexShrink: 0 }}
                        >
                          {(currentUser?.fullName || "U").charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <CommentInput
                            fullWidth
                            multiline
                            maxRows={2}
                            placeholder={`Trả lời ${
                              comment.author?.fullName ||
                              comment.author?.name ||
                              "Unknown User"
                            }...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                fontSize: "0.875rem",
                                minHeight: "32px",
                                maxHeight: "64px",
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 0.5,
                                    alignItems: "center",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      handleSubmitReply(comment.id)
                                    }
                                    disabled={!replyText.trim()}
                                    sx={{ width: 24, height: 24 }}
                                  >
                                    <Send sx={{ fontSize: 14 }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={handleCancelReply}
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      color: "text.secondary",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{ fontSize: "0.7rem" }}
                                    >
                                      Hủy
                                    </Typography>
                                  </IconButton>
                                </Box>
                              ),
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
                            {(
                              reply.author?.fullName ||
                              reply.author?.name ||
                              "U"
                            ).charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                {reply.author?.fullName ||
                                  reply.author?.name ||
                                  "Unknown User"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDistanceToNow(
                                  new Date(reply.createdAt),
                                  {
                                    addSuffix: true,
                                    locale: vi,
                                  }
                                )}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {reply.content}
                            </Typography>

                            {/* Reply Actions */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  cursor: "pointer",
                                  color: likedComments.has(reply.id)
                                    ? "error.main"
                                    : "text.secondary",
                                  "&:hover": { color: "error.main" },
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
              <Box sx={{ p: 3, textAlign: "center" }}>
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
      avatar: PropTypes.string,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    likeCount: PropTypes.number,
    commentCount: PropTypes.number,
    shareCount: PropTypes.number,
    isLiked: PropTypes.bool,
    media: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(["image", "video"]).isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        content: PropTypes.string,
        author: PropTypes.shape({
          name: PropTypes.string,
          avatar: PropTypes.string,
        }),
        createdAt: PropTypes.string,
        likeCount: PropTypes.number,
        replies: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            content: PropTypes.string,
            author: PropTypes.shape({
              name: PropTypes.string,
              avatar: PropTypes.string,
            }),
            createdAt: PropTypes.string,
            likeCount: PropTypes.number,
          })
        ),
      })
    ),
  }).isRequired,
  onLike: PropTypes.func,
  onComment: PropTypes.func,
  onShare: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default Post;
