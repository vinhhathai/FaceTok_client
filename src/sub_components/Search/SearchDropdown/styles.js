import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

// Styled components cho SearchDropdown
export const DropdownPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 1000,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(0.5),
  width: '100%',
  boxShadow: theme.shadows[3],
  maxHeight: 400,
  overflow: 'auto',
}));

export const DropdownHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const ResultCount = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: '0.75rem',
  height: 24,
}));

export const CategoryHeader = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  fontSize: '0.8rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const ProfileLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
}));

export const AddFriendButton = styled(Button)(({ theme, requested }) => ({
  minWidth: 'auto',
  fontSize: '0.7rem',
  padding: theme.spacing(0.5, 1.5),
  backgroundColor: requested ? theme.palette.grey[300] : theme.palette.primary.main,
  color: requested ? theme.palette.text.secondary : theme.palette.common.white,
  '&:hover': {
    backgroundColor: requested ? theme.palette.grey[400] : theme.palette.primary.dark,
  },
}));

export const FooterLink = styled(Link)(({ theme }) => ({
  display: 'block',
  textAlign: 'center',
  padding: theme.spacing(1.5),
  color: theme.palette.primary.main,
  textDecoration: 'none',
  borderTop: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
})); 