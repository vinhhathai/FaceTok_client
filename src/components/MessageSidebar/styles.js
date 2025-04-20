import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

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

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

export const MessagePreview = styled(Typography)(({ theme, isUnread }) => ({
  fontWeight: isUnread ? 600 : 400,
  color: isUnread ? theme.palette.text.primary : theme.palette.text.secondary
}));

export const UnreadCount = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '20px',
  height: '20px',
  borderRadius: '10px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: '0 6px'
}));

export const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderBottom: `1px solid ${theme.palette.divider}`
}));

export const TabButton = styled(Button)(({ theme }) => ({
  flex: 1,
  borderRadius: 0,
  padding: theme.spacing(1.5),
  fontWeight: 600
})); 