import { styled } from '@mui/material/styles';
import { Button, Fab } from '@mui/material';

export const UpdateCoverButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
}));

export const MobileUpdateButton = styled(Fab)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  color: theme.palette.primary.main,
  size: 'small',
  width: 36,
  height: 36,
  zIndex: 50,
  boxShadow: theme.shadows[3],
  border: '1px solid white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
}));

export const UploadInput = styled('input')({
  display: 'none',
}); 