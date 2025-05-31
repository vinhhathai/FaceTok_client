import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const ProfileContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  position: "relative",
  width: "100%",
  [theme.breakpoints.down('sm')]: {
    marginTop: -56,
    zIndex: 20,
  }
}));

export const ProfileImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 120,
  height: 120,
  borderRadius: '50%',
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    margin: '0 auto',
    marginBottom: theme.spacing(1),
  }
}));

export const ProfileImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '50%',
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
}));

export const ProfileImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderRadius: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const UploadInput = styled('input')({
  display: 'none'
});

export const ProfileFullName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: {
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
  }
}));

export const AvatarHoverOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.7,
  },
  zIndex: 1
}));

export const NameContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'row', 
    marginTop: theme.spacing(1),
  }
}));

export const EditNameButton = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  color: theme.palette.primary.main,
  padding: '4px'
})); 