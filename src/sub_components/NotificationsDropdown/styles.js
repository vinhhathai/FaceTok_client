import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Styled components cho NotificationsDropdown
export const NotificationContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
}));

export const MenuTitle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const MenuFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
}));

export const ActionText = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.primary.main,
})); 