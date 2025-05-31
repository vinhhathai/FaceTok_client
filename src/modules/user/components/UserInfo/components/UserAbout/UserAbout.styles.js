import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const IntroContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  width: '100%',
}));

export const IntroHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const IntroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const IntroItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  gap: theme.spacing(1),
}));

export const IntroItemText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: '0.9rem',
})); 