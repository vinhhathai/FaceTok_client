import { styled } from '@mui/material/styles';
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%'
  }
}));

export const SidebarCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    borderRadius: theme.spacing(1),
    boxShadow: 'none',
    border: 'none',
    padding: theme.spacing(1)
  }
}));

export const SidebarList = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.5)
  }
}));

export const ItemListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  '&:last-child': {
    marginBottom: 0
  }
}));

export const ItemListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(4px)'
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.75, 1)
  }
}));

export const ItemListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  marginRight: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    minWidth: 36,
    marginRight: theme.spacing(0.75)
  }
}));

export const StyledBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.25, 0.75),
  fontSize: '0.75rem',
  fontWeight: 'bold',
  minWidth: 20,
  textAlign: 'center',
  lineHeight: 1.2
}));

export const comingSoonBadgeStyles = {
  fontSize: '0.6rem',
  color: 'white',
  fontWeight: 'bold',
  padding: '2px 6px',
  backgroundColor: '#e74c3c',
  borderRadius: '12px',
  position: 'relative',
  animation: 'pulse 0.8s ease-in-out infinite', // nhanh hơn
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
      transform: 'scale(1)'
    },
    '50%': {
      opacity: 0.85,
      transform: 'scale(1.04)' // nhẹ nhàng hơn
    }
  }
};
