import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

export const AddFriendButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const MessageButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    backgroundColor: 'rgba(63, 81, 181, 0.04)',
  },
})); 