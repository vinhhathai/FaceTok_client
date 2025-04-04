import { styled } from '@mui/material/styles';
import { Button, Menu, MenuItem } from '@mui/material';

export const FriendActionButton = styled(Button)(({ theme, color = 'primary' }) => ({
  '&.MuiButton-root': {
    minWidth: color === 'primary' ? '88px' : '120px'
  }
}));

export const FriendActionMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius
  }
}));

export const FriendMenuItem = styled(MenuItem)(({ theme }) => ({
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
})); 