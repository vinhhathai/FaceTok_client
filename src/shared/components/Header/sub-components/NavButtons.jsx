import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  iconButtonStyles,
  iconStyles,
  badgeStyle
} from '../Header.styles';
import { useSelector, useDispatch } from 'react-redux';
import { setNotifications } from '@notification/redux';
import { getNotifications } from '@notification/api/notificationAPI';
import { markNotificationAsRead } from '@notification/api/notificationAPI';
import { markAsReadNotification } from '@notification/redux';
import { markAllNotificationsAsRead } from '@notification/api/notificationAPI';
import { markAllAsReadNotification } from '@notification/redux';

const NavButtons = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openNoti, setOpenNoti] = useState(false);
  const dispatch = useDispatch();

  // Lấy notification từ Redux
  const notifications = useSelector(state => state.notification.notifications || []);
  const unreadCount = useSelector(state => state.notification.unreadCount || 0);
  // Lấy số lượng lời mời kết bạn từ Redux
  const friendRequestsCount = useSelector(state => state.friend.receivedRequests?.length || 0);
  // Lấy tổng số tin nhắn chưa đọc từ Redux (conversationReducer)
  const unreadMessagesCount = useSelector(state => {
    const conversations = state.conversations?.conversations || [];
    return conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  });

  // Khi mở popup notification, fetch danh sách notification từ API
  const handleOpenNoti = async () => {
    setOpenNoti(true);
    try {
      const res = await getNotifications();
      dispatch(setNotifications(res.data));
    } catch (e) {
      // Có thể show toast lỗi nếu cần
    }
  };

  // Xử lý click vào notification
  const handleNotificationClick = async (notificationId, notification) => {
    try {
      await markNotificationAsRead(notificationId);
      dispatch(markAsReadNotification(notificationId));
      
      // Điều hướng dựa trên loại notification
      if (notification.type === 'friend_request' || notification.type === 'friend_accept') {
        navigate('/friends');
      } else if (notification.type === 'post_like' || notification.type === 'post_comment') {
        // Điều hướng đến post detail page nếu có postId
        if (notification.data?.postId) {
          navigate(`/post/${notification.data.postId}`);
        } else {
          navigate('/home');
        }
      }
      
      setOpenNoti(false);
    } catch (e) {
      // handle error nếu cần
    }
  };

  // Helper function để lấy icon cho notification
  const getNotificationIcon = (type) => {
    const iconStyle = { fontSize: 12, fontWeight: 'bold' };
    
    switch (type) {
      case 'post_like':
        return <FavoriteIcon sx={{ ...iconStyle, color: '#e91e63' }} />;
      case 'post_comment':
        return <CommentIcon sx={{ ...iconStyle, color: '#2196f3' }} />;
      case 'friend_request':
        return <PersonAddIcon sx={{ ...iconStyle, color: '#ff9800' }} />;
      case 'friend_accept':
        return <CheckIcon sx={{ ...iconStyle, color: '#4caf50' }} />;
      case 'friend_reject':
        return <CloseIcon sx={{ ...iconStyle, color: '#f44336' }} />;
      default:
        return null;
    }
  };

  // Xử lý đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      dispatch(markAllAsReadNotification());
    } catch (e) {
      // handle error nếu cần
    }
  };

  return (
    <>
      <Tooltip title="Trang chủ">
        <IconButton
          onClick={() => navigate('/home')}
          sx={iconButtonStyles(theme)}
          aria-label="Trang chủ"
        >
          <HomeOutlinedIcon sx={iconStyles(theme)} />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Bạn bè">
        <IconButton
          onClick={() => navigate('/friends')}
          sx={iconButtonStyles(theme)}
          aria-label="Bạn bè"
        >
          <Badge 
            badgeContent={friendRequestsCount > 0 ? friendRequestsCount : null} 
            color="error" 
            sx={badgeStyle(isMobile)}
          >
            <PeopleAltOutlinedIcon sx={iconStyles(theme)} />
          </Badge>
        </IconButton>
      </Tooltip>
      
      
      
      <Tooltip title="Tin nhắn">
        <IconButton 
          onClick={() => navigate('/messages')}
          sx={iconButtonStyles(theme)}
          aria-label="Tin nhắn"
        >
          <Badge 
            badgeContent={unreadMessagesCount > 0 ? unreadMessagesCount : null} 
            color="error" 
            sx={badgeStyle(isMobile)}
          >
            <ChatOutlinedIcon sx={iconStyles(theme)} />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Thông báo">
        <IconButton 
          sx={iconButtonStyles(theme)}
          aria-label="Thông báo"
          onClick={handleOpenNoti}
        >
          <Badge 
            badgeContent={unreadCount > 0 ? unreadCount : null} 
            color="error" 
            sx={badgeStyle(isMobile)}
          >
            <NotificationsOutlinedIcon sx={iconStyles(theme)} />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Right Drawer for notifications */}
      <Drawer anchor="right" open={openNoti} onClose={() => setOpenNoti(false)}>
        <Box sx={{ 
          width: isMobile ? 320 : 380, 
          maxWidth: '100vw',
          bgcolor: 'background.paper',
          height: '100%'
        }} role="presentation">
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Thông báo</Typography>
            <Box>
              <IconButton size="small" onClick={handleMarkAllAsRead} aria-label="Đánh dấu tất cả đã đọc">
                <DoneAllIcon />
              </IconButton>
              <IconButton size="small" onClick={() => setOpenNoti(false)} aria-label="Đóng">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <List>
            {notifications.length === 0 && (
              <ListItem>
                <ListItemText primary="Không có thông báo mới" />
              </ListItem>
            )}
            {notifications.map((n) => (
              <ListItem 
                key={n._id || n.id} 
                button 
                sx={{ 
                  alignItems: 'flex-start', 
                  background: !n.isRead ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  py: 1.5,
                  px: 2,
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&:hover': {
                    background: !n.isRead ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleNotificationClick(n._id || n.id, n)}
              >
                <ListItemAvatar sx={{ minWidth: 56 }}>
                  <Box sx={{ position: 'relative', mr: 1 }}>
                    <Avatar 
                      src={n.data?.fromUserAvatar || n.data?.senderAvatar || n.avatar || '/assets/images/avatar_default.webp'} 
                      alt="noti"
                      sx={{ width: 40, height: 40 }}
                    />
                    {/* Icon overlay để chỉ loại notification */}
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: -2, 
                      right: -2, 
                      backgroundColor: 'white', 
                      borderRadius: '50%', 
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      border: '1.5px solid white'
                    }}>
                      {getNotificationIcon(n.type)}
                    </Box>
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: !n.isRead ? 600 : 500 }}>
                      {n.content || n.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {/* Chỉ hiển thị nội dung post cho post_like, không hiển thị cho comment */}
                      {n.type === 'post_like' && n.data?.postContent && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', mt: 0.5 }}>
                          "{n.data.postContent}"
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : n.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavButtons; 