import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Container chứa tất cả tin nhắn
export const MessageListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  overflowY: 'auto',
  flexGrow: 1,
  gap: theme.spacing(0.5)
}));

// Container cho mỗi ngày
export const DateGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column'
});

// Container cho tiêu đề ngày
export const DateHeaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  margin: '16px 0'
});

// Box hiển thị ngày
export const DateDisplay = styled(Box)(({ theme }) => ({
  padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
  borderRadius: 16,
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary
})); 