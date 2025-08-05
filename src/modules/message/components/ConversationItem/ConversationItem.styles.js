import { styled } from '@mui/material/styles';
import { ListItem, Typography, Box } from '@mui/material';

// Styled ListItem cho mỗi cuộc hội thoại
export const StyledConversationItem = styled(ListItem)(({ theme, isActive }) => ({
  padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
  backgroundColor: isActive ? theme.palette.action.selected : 'inherit',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  '&:hover': {
    backgroundColor: isActive ? theme.palette.action.selected : theme.palette.action.hover,
    '& .delete-button-container .MuiIconButton-root': {
      opacity: 1,
    },
  },
}));

// Box bọc tiêu đề và thời gian
export const ConversationHeader = styled(Box)({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center'
});

// Box bọc tin nhắn và số lượng chưa đọc
export const ConversationInfo = styled(Box)({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginTop: '4px'
});

// Typography cho nội dung tin nhắn
export const MessagePreview = styled(Typography)(({ theme, hasUnread }) => ({
  maxWidth: '80%',
  fontWeight: hasUnread ? 500 : 400,
  color: hasUnread ? theme.palette.text.primary : theme.palette.text.secondary
}));

// Container cho nút xóa
export const DeleteButtonContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '& .MuiIconButton-root': {
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
  },
}); 