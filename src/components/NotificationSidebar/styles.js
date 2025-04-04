import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';

export const SidebarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

export const SidebarTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600
}));

export const SidebarContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  height: 'calc(100vh - 130px)',
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: '6px'
  }
}));

export const SidebarFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.divider}`
}));

export const StyledListItem = styled(ListItem)(({ theme, unread }) => ({
  padding: theme.spacing(1.5, 2),
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  backgroundColor: unread ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

export const NotificationText = styled(Typography)(({ theme, isRead }) => ({
  fontWeight: isRead ? 400 : 600,
  color: isRead ? theme.palette.text.secondary : theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
  display: 'block'
}));

export const NotificationTime = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  display: 'block'
}));

export const NotificationDot = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'inline-block',
  marginLeft: theme.spacing(1)
})); 