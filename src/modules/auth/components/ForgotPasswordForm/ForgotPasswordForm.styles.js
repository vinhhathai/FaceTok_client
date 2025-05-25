import { styled } from '@mui/material/styles';
import { Stepper, Button } from '@mui/material';

// Custom styled components
export const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiStepLabel-root .Mui-completed': {
    color: '#4ECDC4',
  },
  '& .MuiStepLabel-root .Mui-active': {
    color: '#4ECDC4',
  },
  '& .MuiStepConnector-line': {
    borderColor: '#e0e0e0',
  },
  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
    borderColor: '#4ECDC4',
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    borderColor: '#4ECDC4',
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4ECDC4',
  '&:hover': {
    backgroundColor: '#33BBB4',
  },
  height: '48px',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
}));

export const LogoImg = styled('img')({
  width: '60px',
  height: '60px',
  margin: '0 auto 16px auto',
  display: 'block',
}); 