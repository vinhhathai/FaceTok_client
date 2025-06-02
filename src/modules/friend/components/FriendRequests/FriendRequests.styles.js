import { styled } from '@mui/material/styles';
import { Box, Paper, Button } from '@mui/material';

export const RequestContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
}));

export const RequestCard = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
}));

export const RequestActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
}));

export const RequestActionButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem',
  padding: theme.spacing(0.5, 1),
  minWidth: '20px',
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.5),
  },
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
    padding: theme.spacing(0.4, 0.8),
  },
})); 