import { styled } from '@mui/material/styles';
import { Paper, TextField, Box, Button } from '@mui/material';

export const CreatePostWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
}));

export const CreatePostInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
}));

export const CreatePostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const MediaButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  textTransform: 'none',
  '& img': {
    width: 24,
    height: 24,
    marginRight: theme.spacing(1),
  },
}));

export const PublishButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  textTransform: 'none',
  padding: '6px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

export const PreviewContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  position: 'relative',
  '& img': {
    width: '100%',
    maxHeight: '250px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export const RemovePreviewButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  minWidth: 'auto',
  padding: theme.spacing(0.5),
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
})); 