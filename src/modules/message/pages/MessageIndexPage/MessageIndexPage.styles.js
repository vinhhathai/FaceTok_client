import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Fab } from '@mui/material';

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
  fontWeight: 'bold',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5),
  }
}));

// Box chứa danh sách cuộc hội thoại
export const ConversationsListContainer = styled(Box)({
  flexGrow: 1, 
  overflow: 'auto'
});

// Grid item cho khu vực chat
export const ChatAreaGridItem = styled(Grid)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
});

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

// Wrapper cố định chiều cao chứa FAB trong danh sách hội thoại
export const FabContainer = styled(Box)({
  position: 'relative',
  height: 80,
});

// Nút tạo nhóm dùng lại giữa desktop và mobile
export const CreateGroupFab = styled(Fab)(({ theme }) => ({
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.05)',
    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
  },
  // Responsive tweak
  [theme.breakpoints.down('sm')]: {
    width: 48,
    height: 48,
    '& .MuiSvgIcon-root': { fontSize: 20 }
  },
  [theme.breakpoints.between('sm','md')]: {
    width: 52,
    height: 52,
    '& .MuiSvgIcon-root': { fontSize: 22 }
  }
}));

// Wrapper cho FAB nổi ở mobile
export const MobileFabWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 1000,
  display: { xs: 'block', sm: 'block', md: 'none' }
}));