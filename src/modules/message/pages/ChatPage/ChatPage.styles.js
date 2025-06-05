import { styled } from '@mui/material/styles';
import { Box, Grid, Paper } from '@mui/material';

// Container chính của toàn bộ trang
export const ChatPageContainer = styled(Box)({
  height: '100%', 
  display: 'flex', 
  flexDirection: 'column'
});

// Loading overlay khi đang tạo phòng chat
export const LoadingOverlay = styled(Box)({
  position: 'absolute', 
  top: 0, 
  left: 0, 
  right: 0, 
  bottom: 0, 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.7)',
  zIndex: 10
});

// Grid container chính
export const ChatGridContainer = styled(Grid)({
  flexGrow: 1, 
  height: '100%'
});

// Grid item cho danh sách cuộc hội thoại
export const ConversationsGridItem = styled(Grid)(({ theme, showChat }) => ({
  height: '100%',
  borderRight: '1px solid',
  borderColor: theme.palette.divider,
  [theme.breakpoints.down('md')]: {
    display: showChat ? 'none' : 'block'
  },
  [theme.breakpoints.up('md')]: {
    display: 'block'
  }
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
export const ChatAreaGridItem = styled(Grid)(({ theme, showConversations }) => ({
  height: '100%',
  [theme.breakpoints.down('md')]: {
    display: showConversations ? 'none' : 'block'
  },
  [theme.breakpoints.up('md')]: {
    display: 'block'
  }
}));

// Box chứa nút Back trên mobile
export const MobileBackButtonBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1), 
  borderBottom: '1px solid', 
  borderColor: theme.palette.divider,
  display: 'flex',
  alignItems: 'center'
})); 