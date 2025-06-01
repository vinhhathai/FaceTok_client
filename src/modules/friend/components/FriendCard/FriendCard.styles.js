import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

export const FriendCardStyled = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  borderRadius: theme.spacing(1),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
  overflow: 'hidden'
}));

export const FriendCardHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%'
});

export const CardMediaContainer = styled('div')(({ theme }) => ({
  width: 60,
  height: 60,
  margin: theme.spacing(1, 0, 1, 1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: '50%',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
}));

export const FriendNameWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
  '& .MuiTypography-h6': {
    fontSize: '1rem',
    fontWeight: 600,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    }
  },
  '& .MuiTypography-body2': {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.7rem',
    }
  }
}));

export const FriendCardActions = styled('div')(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(0, 1, 1, 1),
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  '& button': {
    minWidth: 'auto'
  }
})); 