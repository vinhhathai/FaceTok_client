import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';

export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`, // Use theme for header height
  position: 'sticky',
  top: `${theme.mixins.toolbar.minHeight}px`, // Use theme for header height
  [theme.breakpoints.up('sm')]: {
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    top: `${theme.mixins.toolbar.minHeight}px`,
  },
  // Adjust based on MUI AppBar default heights if needed
}));

export const SidebarCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: 'none',
  borderRight: `1px solid ${theme.palette.divider}`,
}));

export const SidebarList = styled(List)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

export const HomeListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

export const HomeTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
}));

export const ItemListItem = styled(ListItem)(({ theme }) => ({
  display: 'block',
  padding: 0, // Reset padding as ListItemButton has padding
}));

export const ItemListItemButton = styled(ListItemButton)(({ theme }) => ({
  minHeight: 48,
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const ItemListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 0,
  marginRight: theme.spacing(3),
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: 24,
  }
}));

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText || '#fff',
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
})); 