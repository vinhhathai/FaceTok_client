import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

// Styled components cho UserDropdown
export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.3)',
  },
}));

export const UserButton = styled(IconButton)(({ theme }) => ({
  padding: 1,
})); 