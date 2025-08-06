import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Avatar } from '@mui/material';

// Container cho một tin nhắn
export const MessageContainer = styled(Box)(({ isOwn }) => ({
  display: 'flex',
  flexDirection: isOwn ? 'row-reverse' : 'row',
  marginBottom: '12px',
  alignItems: 'flex-end'
}));

// Avatar của người gửi
export const SenderAvatar = styled(Avatar)({
  width: 36, 
  height: 36, 
  marginRight: 8
});

// Box chứa nội dung tin nhắn
export const MessageContentWrapper = styled(Box)({
  maxWidth: '75%'
});

// Paper chứa text của tin nhắn
export const MessageBubble = styled(Paper)(({ theme, isOwn }) => ({
  padding: '12px',
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.background.paper,
  color: isOwn ? 'white' : theme.palette.text.primary,
  borderRadius: 16,
  ...(isOwn
    ? { borderBottomRightRadius: 0 }
    : { borderBottomLeftRadius: 0 }),
  boxShadow: theme.shadows[1]
}));

// Container cho thời gian và trạng thái đã đọc
export const MessageInfoContainer = styled(Box)(({ isOwn }) => ({
  display: 'flex',
  marginTop: 4,
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  alignItems: 'center'
}));

// Typography cho thời gian
export const TimeText = styled(Typography)(({ theme }) => ({
  fontSize: '0.65rem',
  color: theme.palette.text.secondary
}));

// Container cho icon trạng thái đã đọc
export const ReadStatusContainer = styled(Box)({
  display: 'flex', 
  alignItems: 'center', 
  marginLeft: 4
});

// Container cho nút thu hồi tin nhắn
export const RecallButtonContainer = styled(Box)({
  position: 'absolute',
  top: '4px',
  right: '4px',
  zIndex: 1
}); 