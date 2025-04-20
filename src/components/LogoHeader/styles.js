import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// Styled components cho LogoHeader
export const LogoImage = styled('img')(({ theme }) => ({
  width: '40px',
  height: '40px',
  marginRight: theme.spacing(1.5),
  borderRadius: '10%',
}));

export const LogoLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(3),
  textDecoration: 'none',
})); 