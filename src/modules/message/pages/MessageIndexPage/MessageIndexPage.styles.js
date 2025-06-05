import { styled } from '@mui/material/styles';
import { Box, Grid, Paper } from '@mui/material';

// Container chính cho toàn bộ trang
export const PageContainer = styled(Box)({
  height: '100%'
});

// Grid container
export const MessageGridContainer = styled(Grid)({
  height: '100%'
});

// Grid item cho danh sách cuộc hội thoại
export const ConversationsGridItem = styled(Grid)(({ theme }) => ({
  height: '100%',
  borderRight: '1px solid',
  borderColor: theme.palette.divider
}));

// Paper container cho danh sách cuộc hội thoại
export const ConversationsPaper = styled(Paper)({
  height: '100%', 
  borderRadius: 0,
  display: 'flex',
  flexDirection: 'column'
});

// Box tiêu đề cho phần danh sách tin nhắn
export const ConversationsHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2), 
  borderBottom: '1px solid', 
  borderColor: theme.palette.divider,
  fontWeight: 'bold'
}));

// Box chứa danh sách cuộc hội thoại
export const ConversationsListContainer = styled(Box)({
  flexGrow: 1, 
  overflow: 'auto'
});

// Grid item cho khu vực chat
export const ChatAreaGridItem = styled(Grid)({
  height: '100%'
});

// Box cho nút Back trên mobile
export const MobileBackBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1), 
  borderBottom: '1px solid', 
  borderColor: theme.palette.divider,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper
}));

// Box cho màn hình chào mừng khi không có cuộc trò chuyện nào được chọn
export const WelcomeContainer = styled(Box)({
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center',
  height: '100%',
  textAlign: 'center',
  padding: 24
}); 