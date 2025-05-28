import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const ProfileContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const TabsContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[1],
}));

export const TabContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const TabPanelStyles = {
  marginTop: 2,
}; 