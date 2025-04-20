import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

export const HomeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
}));

export const ContentWrapper = styled(Container)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2)
})); 