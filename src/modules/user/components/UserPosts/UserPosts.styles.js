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
  width: '100%'
}));

export const PostItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  border: '1px solid #e0e0e0',
  borderRadius: theme.shape.borderRadius * 1,
  backgroundColor: theme.palette.background.paper
}));

export const PostContent = styled(Box)(({ theme }) => ({
}));

export const PostTimestamp = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'block'
}));

export const PostStats = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  gap: theme.spacing(2)
})); 