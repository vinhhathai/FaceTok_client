import { styled } from '@mui/material/styles';
import { Dialog, Box, Paper } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export const CommentsList = styled(Box)(({ theme }) => ({
  maxHeight: '400px',
  overflowY: 'auto',
  padding: theme.spacing(1, 0),
}));

export const CommentItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1, 0),
}));

export const CommentContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: 12,
  boxShadow: 'none',
  '& .MuiTypography-subtitle2': {
    marginBottom: theme.spacing(0.5),
  },
}));

export const CommentForm = styled('form')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
  gap: theme.spacing(1)
})); 