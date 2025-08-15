import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(4)
}));

export const EmptyContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4)
}));

export const PostsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
})); 