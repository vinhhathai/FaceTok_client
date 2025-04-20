import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

export const ProfileInfoContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  position: 'sticky',
  top: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(3)})`,
  height: 'fit-content',
}));

export const ProfileImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 120,
  height: 120,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  borderRadius: '50%',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
  '&:hover .image-caption': {
    opacity: 1,
  },
}));

export const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: '100%',
  height: '100%',
  border: `3px solid ${theme.palette.background.paper}`,
}));

export const ProfileImageCaption = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: alpha(theme.palette.common.black, 0.6),
  color: theme.palette.common.white,
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    opacity: 1,
    backgroundColor: alpha(theme.palette.common.black, 0.5),
    padding: '2px 6px',
  },
  [`${ProfileImageWrapper}:hover &`]: {
    opacity: 1,
  },
}));

export const ProfileFullName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
}));

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
  },
}));

export const AddFriendButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const MessageButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
}));

export const MoreButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.primary,
  minWidth: 'auto',
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
}));

export const IntroContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

export const IntroHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export const IntroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
}));

export const IntroItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

export const IntroItemText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  '& a': {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    marginLeft: theme.spacing(0.5),
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export const EditButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  borderColor: theme.palette.divider,
}));

export const OnlineStatus = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  display: 'inline-block',
  marginLeft: theme.spacing(0.5),
}));

export const UploadInput = styled('input')({
  display: 'none',
}); 