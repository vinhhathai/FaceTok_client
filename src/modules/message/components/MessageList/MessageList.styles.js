import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Container chứa tất cả tin nhắn
export const MessageListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  paddingTop: theme.spacing(2),
  overflowY: 'auto',
  flexGrow: 1,
  gap: theme.spacing(0.5),
  height: '100%',
  maxHeight: `calc(100vh - ${theme.spacing(7)} - ${theme.spacing(10)})`, // Giảm chiều cao header và input
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(1), // Giảm padding vì đã có spacer
    maxHeight: `calc(100vh - ${theme.spacing(7)} - ${theme.spacing(8)})`, // Giảm thêm cho mobile
    scrollPaddingTop: '50px' // Thêm scroll-padding để đảm bảo khi scroll không bị che
  }
}));

// Container cho mỗi ngày
export const DateGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column'
});

// Container cho tiêu đề ngày
export const DateHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: '12px 0',
  [theme.breakpoints.down('md')]: {
    margin: '8px 0',
  }
}));

// Box hiển thị ngày
export const DateDisplay = styled(Box)(({ theme }) => ({
  padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
  borderRadius: 16,
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary
}));

// Container khi không có tin nhắn
export const EmptyMessageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 200,
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  textAlign: 'center',
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  margin: '10px 0',
  padding: 20,
  [theme.breakpoints.down('md')]: {
    height: 160,
    margin: '5px 0',
    padding: 15
  }
})); 