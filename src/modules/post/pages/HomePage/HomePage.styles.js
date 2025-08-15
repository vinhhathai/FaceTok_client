import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const HomeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'visible'
})); 