import { styled } from '@mui/material/styles';
import { Paper, Box } from '@mui/material';

export const FriendsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3)
}));

export const FriendsHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
})); 