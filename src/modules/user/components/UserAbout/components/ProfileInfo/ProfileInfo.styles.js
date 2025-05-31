import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const InfoSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1),
  },
}));

export const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  alignItems: 'flex-start',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5),
  },
}));

export const InfoIcon = styled(Box)(({ theme }) => ({
  minWidth: 36,
  color: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    minWidth: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  },
}));

export const InfoContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    flex: 1,
  },
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
    wordBreak: 'break-word',
  },
})); 