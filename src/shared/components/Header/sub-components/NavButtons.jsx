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
  const notifications = useSelector(state => state.notification.notifications);
  const unreadCount = useSelector(state => state.notification.unreadCount);
  // Lấy số lượng lời mời kết bạn từ Redux
  const friendRequestsCount = useSelector(state => state.friend.receivedRequests.length);
  // Lấy tổng số tin nhắn chưa đọc từ Redux (conversationReducer)
  const unreadMessagesCount = useSelector(state =>
    state.conversations.conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)
  );

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
  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      dispatch(markAsReadNotification(notificationId));
      // Có thể điều hướng hoặc mở chi tiết nếu cần
    } catch (e) {
      // handle error nếu cần
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
          <Badge badgeContent={friendRequestsCount} color="error" sx={badgeStyle(isMobile)}>
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
          <Badge badgeContent={unreadMessagesCount} color="error" sx={badgeStyle(isMobile)}>
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
          <Badge badgeContent={unreadCount} color="error" sx={badgeStyle(isMobile)}>
            <NotificationsOutlinedIcon sx={iconStyles(theme)} />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Right Drawer for notifications */}
      <Drawer anchor="right" open={openNoti} onClose={() => setOpenNoti(false)}>
        <Box sx={{ width: isMobile ? 320 : 380, maxWidth: '100vw' }} role="presentation">
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
              <ListItem key={n._id || n.id} button sx={{ alignItems: 'flex-start', background: !n.isRead ? '#f5f5f5' : 'inherit' }}
                onClick={() => handleNotificationClick(n._id || n.id)}>
                <ListItemAvatar>
                  <Avatar src={n.avatar || '/assets/images/avatar_default.webp'} alt="noti" />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{n.content || n.title}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary">{n.createdAt ? new Date(n.createdAt).toLocaleString() : n.time}</Typography>}
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