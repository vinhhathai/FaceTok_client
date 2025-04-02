import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

// Styled components cho MessageItem
export const MessageMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

export const UnreadIndicator = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

export const MessageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
})); 