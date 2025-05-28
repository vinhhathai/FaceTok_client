import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: 700,
  margin: '0 auto',
  paddingBottom: theme.spacing(4)
}));

export const PostsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2)
})); 