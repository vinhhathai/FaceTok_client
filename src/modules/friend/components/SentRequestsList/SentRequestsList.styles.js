import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const CancelRequestButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem',
  padding: theme.spacing(0.5, 1),
  minWidth: '20px',
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.5)
  },
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
    padding: theme.spacing(0.4, 0.8),
  },
})); 