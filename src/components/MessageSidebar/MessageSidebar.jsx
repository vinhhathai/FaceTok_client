import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchConversations } from '../../redux/features/messageSlice';
import { formatTime } from '../../utils/dateFormatter';

// Material UI components
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// Styled components
import {
  SidebarHeader,
  SidebarTitle,
  SidebarContent,
  SidebarFooter,
  StyledListItem,
  MessagePreview,
  UnreadCount,
  TabContainer,
  TabButton
} from './styles';

const MessageSidebar = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Lấy dữ liệu conversations từ Redux store
  const { conversations, loading, error } = useSelector(state => state.messages);
  const onlineUsers = useSelector(state => state.messages.onlineUsers || []);
  
  // Fetch conversations khi component mount hoặc khi drawer mở
  useEffect(() => {
    if (open) {
      dispatch(fetchConversations());
    }
  }, [dispatch, open]);
  
  // Navigate đến trang tin nhắn và đóng sidebar
  const handleConversationClick = (conversationId) => {
    navigate(`/messages?conversationId=${conversationId}`);
    onClose();
  };
  
  // Kiểm tra xem người dùng có online không
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 350 },
          boxSizing: 'border-box',
        },
      }}
    >
      <SidebarHeader>
        <SidebarTitle variant="h6">Tin nhắn</SidebarTitle>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* <IconButton 
            aria-label="đánh dấu đã đọc tất cả" 
            size="small"
            color="primary"
          >
            <MarkChatReadIcon />
          </IconButton> */}
          <IconButton 
            aria-label="đóng" 
            onClick={onClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </SidebarHeader>
      
      <Divider />
      
      <SidebarContent>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        
        {error && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error" variant="body2">
              {error.message || 'Không thể tải tin nhắn'}
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ mt: 1 }}
              onClick={() => dispatch(fetchConversations())}
            >
              Thử lại
            </Button>
          </Box>
        )}
        
        {!loading && !error && conversations.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary" variant="body1">
              Bạn chưa có cuộc trò chuyện nào
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
              Bắt đầu nhắn tin với bạn bè để kết nối
            </Typography>
          </Box>
        )}
        
        <List sx={{ p: 0 }}>
          {conversations.map((conversation) => (
            <StyledListItem 
              key={conversation.id} 
              onClick={() => handleConversationClick(conversation.id)}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  color="success"
                  invisible={!isUserOnline(conversation.user._id)}
                >
                  <Avatar 
                    alt={conversation.user.fullName} 
                    src={conversation.user.profilePicture} 
                  />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" noWrap sx={{ maxWidth: '150px' }}>
                      {conversation.user.fullName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatTime(conversation.timestamp)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <MessagePreview 
                    variant="body2" 
                    color="textSecondary" 
                    noWrap
                    isUnread={conversation.unread > 0}
                  >
                    {conversation.lastMessage}
                  </MessagePreview>
                }
              />
              {conversation.unread > 0 && (
                <UnreadCount>
                  {conversation.unread}
                </UnreadCount>
              )}
            </StyledListItem>
          ))}
        </List>
      </SidebarContent>
      
      <Divider />
      
      <SidebarFooter>
        <Button 
          variant="text" 
          fullWidth
          onClick={() => {
            navigate('/messages');
            onClose();
          }}
        >
          Xem tất cả tin nhắn
        </Button>
      </SidebarFooter>
    </Drawer>
  );
};

export default MessageSidebar; 