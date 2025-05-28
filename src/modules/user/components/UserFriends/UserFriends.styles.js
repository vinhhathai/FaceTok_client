import { styled } from '@mui/material/styles';
import { Box, Grid, Card } from '@mui/material';

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(4)
}));

export const EmptyContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4)
}));

export const FriendsContainer = styled(Box)(({ theme }) => ({
  width: '100%'
}));

export const StyledGrid = styled(Grid)(({ theme }) => ({
  width: '100%'
}));

export const FriendCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

export const FriendCardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column'
}));

export const FriendCardMedia = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 0,
  paddingTop: '100%', // 1:1 Aspect Ratio
  position: 'relative'
}));

export const FriendCardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2, 2)
})); 