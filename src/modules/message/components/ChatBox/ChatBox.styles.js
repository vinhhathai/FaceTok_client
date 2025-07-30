import { styled } from '@mui/material/styles';
import { Box, Paper, Avatar } from '@mui/material';

// Container chính cho khung chat
export const ChatBoxContainer = styled(Paper)({
  display: 'flex', 
  flexDirection: 'column', 
  height: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  borderRadius: 0
});

// Container cho placeholder khi không có cuộc trò chuyện
export const PlaceholderContainer = styled(Box)({
  display: 'flex', 
  flexDirection: 'column',
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100%',
  padding: 24
});

// Header của khung chat
export const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5), 
  display: 'flex', 
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  flexShrink: 0
}));

// Container thông tin người dùng
export const UserInfoContainer = styled(Box)({
  display: 'flex', 
  alignItems: 'center'
});

// Avatar người dùng
export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40, 
  height: 40, 
  marginRight: theme.spacing(2)
}));

// Container cho loading
export const LoadingContainer = styled(Box)({
  display: 'flex', 
  justifyContent: 'center', 
  padding: 32,
  flexGrow: 1
});

// Container cho khung nhập tin nhắn
export const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5), 
  borderTop: '1px solid', 
  borderColor: theme.palette.divider,
  flexShrink: 0,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
    '& .MuiInputBase-root': {
      minHeight: '40px',
      padding: theme.spacing(0.5, 1)
    }
  }
})); 