import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublicIcon from '@mui/icons-material/Public';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

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
  PostMenuItemText
} from './styles';

function Post({ post, defaultUserImage, defaultPostImage }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Sử dụng dữ liệu từ props hoặc dữ liệu mặc định
  const userImage = post?.userImage || defaultUserImage;
  const postImage = post?.image || defaultPostImage;
  const userName = post?.userName || "User Name";
  const postTime = post?.time || "3 hours ago";
  const postContent = post?.content || "No content available";
  const likeCount = post?.likeCount || 0;
  const commentCount = post?.commentCount || 0;

  const menuItems = [
    { icon: <BookmarkAddOutlinedIcon fontSize="small" />, text: 'Save post', secondaryText: 'Add this to your saved items' },
    { icon: <VisibilityOffOutlinedIcon fontSize="small" />, text: 'Hide post', secondaryText: 'See fewer posts like this' },
    { icon: <AccessTimeOutlinedIcon fontSize="small" />, text: `Snooze ${userName} for 30 days`, secondaryText: 'Temporarily stop seeing posts' },
    { icon: <ReportProblemOutlinedIcon fontSize="small" />, text: 'Report', secondaryText: 'I\'m concerned about this post' },
  ];

  return (
    <PostCard>
      <PostCardHeader
        avatar={
          <Avatar src={userImage} aria-label="user avatar" />
        }
        action={
          <IconButton aria-label="settings" onClick={handleClickMenu}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <UserNameLink href="#" underline="hover">
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
          <PostMenuItem key={index} onClick={handleCloseMenu}>
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
          <ActionButton aria-label="like post">
            <ThumbUpAltOutlinedIcon />
          </ActionButton>
          <ActionText>{likeCount}</ActionText>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ActionButton aria-label="comment on post">
            <ChatBubbleOutlineOutlinedIcon />
          </ActionButton>
          <ActionText>{commentCount}</ActionText>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <ActionButton aria-label="share post">
            <ShareOutlinedIcon />
          </ActionButton>
          <ActionText>Share</ActionText>
        </Box>
      </PostCardActions>
    </PostCard>
  );
}

// Default props
Post.defaultProps = {
  defaultUserImage: require("../../assets/images/users/user-1.jpg"),
  defaultPostImage: null,
};

export default Post;
