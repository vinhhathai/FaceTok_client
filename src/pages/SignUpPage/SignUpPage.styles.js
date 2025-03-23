import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// Styled components cho trang SignUp
export const SignUpContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f7f9fc',
}));

export const BackgroundSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1a237e, #283593, #3949ab, #3f51b5)',
  backgroundSize: '400% 400%',
  animation: 'gradient 15s ease infinite',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  '& h1': {
    fontSize: '2.5rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  '& p': {
    fontSize: '1.25rem',
  },
  '@keyframes gradient': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}));

export const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  maxWidth: '450px',
  width: '100%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('md')]: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  }
}));

export const LogoImg = styled('img')(({ theme }) => ({
  width: '64px',
  height: 'auto',
  borderRadius: theme.spacing(1),
}));

export const MobileLogo = styled(Box)(({ theme }) => ({
  display: 'none',
  backgroundColor: '#fff',
  padding: theme.spacing(2),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

export const LogoMobileImg = styled('img')(({ theme }) => ({
  height: '60px',
  width: 'auto',
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    '& > *': {
      width: '100%',
      textAlign: 'center',
    },
  },
}));

export const PrivacyText = styled(Box)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
})); 