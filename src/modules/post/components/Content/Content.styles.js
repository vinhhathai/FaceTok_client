import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: 700,
  margin: '0 auto',
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    padding: theme.spacing(0, 1)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 0.5)
  }
}));

export const PostsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1)
  }
})); 