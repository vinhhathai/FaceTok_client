import { styled } from '@mui/material/styles';
import { Dialog, DialogContent, DialogActions } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 8,
  }
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2, 3),
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1, 3, 2),
  '& .MuiButton-root': {
    borderRadius: 8,
  }
})); 