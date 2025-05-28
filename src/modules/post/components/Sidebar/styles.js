import { styled } from '@mui/material/styles';
import { 
  Box, 
  Card, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  Typography,
  Badge
} from '@mui/material';

export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%'
}));

export const SidebarCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  backgroundColor: theme.palette.background.paper
}));

export const SidebarList = styled(List)(({ theme }) => ({
  padding: 0
}));

export const HomeListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

export const HomeTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold'
}));

export const ItemListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1)
}));

export const ItemListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

export const ItemListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40
}));

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -10,
    top: 13,
    padding: '0 4px',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  }
})); 