import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export const ProfileHeaderBackground = styled(Box)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
}));

export const ProfileCover = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 220,
  [theme.breakpoints.up('md')]: {
    height: 250,
  },
  [theme.breakpoints.up('lg')]: {
    height: 300,
  },
  '&:hover .cover-overlay': {
    opacity: 1,
  },
}));

export const ProfileCoverImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
}));

export const CoverOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  padding: theme.spacing(2),
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

export const UpdateCoverButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

export const UploadInput = styled('input')({
  display: 'none',
}); 