import { styled } from '@mui/material/styles';
import { Box, Fab } from '@mui/material';

export const ProfileCover = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 250,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    height: 180,
    marginBottom: theme.spacing(7),
  },
}));

export const ProfileCoverImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

export const CoverOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1,
}));

export const UploadButton = styled(Fab)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
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