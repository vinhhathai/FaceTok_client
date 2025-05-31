import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const ProfileHeaderBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[1],
  [theme.breakpoints.down('sm')]: {
    borderRadius: 0,
    marginBottom: 0,
    boxShadow: 'none',
  },
})); 