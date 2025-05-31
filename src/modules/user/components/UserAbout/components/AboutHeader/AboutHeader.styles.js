import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

export const AboutTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
    textAlign: 'center',
  },
}));

export const AboutBio = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  wordBreak: 'break-word',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
    textAlign: 'center',
  },
})); 