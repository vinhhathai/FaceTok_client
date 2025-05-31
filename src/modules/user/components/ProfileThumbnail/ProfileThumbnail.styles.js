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
  // Media query to ensure hover works correctly
  [theme.breakpoints.up('sm')]: {
    '&:hover .cover-overlay': {
      opacity: 1,
    },
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
  transition: 'opacity 0.3s ease',
  // Always visible on mobile, hover effect on desktop
  opacity: 1,
  [theme.breakpoints.up('sm')]: {
    opacity: 0,
  },
}));

export const UpdateCoverButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
  // More prominent on mobile
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    padding: theme.spacing(0.75, 1.5),
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export const UploadInput = styled('input')({
  display: 'none',
}); 