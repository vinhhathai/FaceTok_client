import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const EmailField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  minWidth: '150px',
  padding: theme.spacing(1, 3),
  marginTop: theme.spacing(1),
}));

export const LoaderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  textAlign: 'center',
  marginTop: theme.spacing(2),
})); 