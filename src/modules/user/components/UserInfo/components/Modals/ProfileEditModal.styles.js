import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: '600px',
  maxHeight: '80vh',
  overflow: 'auto',
  backgroundColor: theme.palette.background.paper,
  boxShadow: 24,
  borderRadius: 8,
  padding: theme.spacing(2, 3),
  [theme.breakpoints.down('sm')]: {
    width: '95%',
    maxHeight: '80vh',
    padding: theme.spacing(2),
  }
}));

export const ModalTitle = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  }
}));

export const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  marginTop: theme.spacing(3),
}));

export const ButtonContainerMobile = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginTop: theme.spacing(3),
}));

export const CancelButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'isMobile',
})(({ theme, isMobile }) => ({
  marginBottom: isMobile ? theme.spacing(1) : 0,
})); 