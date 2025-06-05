import { styled } from '@mui/material/styles';
import { Box, List } from '@mui/material';

// Container cho trạng thái loading, lỗi hoặc rỗng
export const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center',
  height: '100%', 
  padding: theme.spacing(3)
}));

// List chứa các cuộc hội thoại
export const ConversationsListWrapper = styled(List)({
  overflow: 'auto'
}); 