import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

// Styled components cho CreateNavbar
export const CreateIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export const IconAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
}));

export const DropdownContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
})); 