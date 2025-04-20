import { styled } from '@mui/material/styles';
import { TextField, Dialog } from '@mui/material';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
  }
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1, 3, 2),
  }
}));

export const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  borderRadius: '8px',
  objectFit: 'contain'
}); 