import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Paper } from '@mui/material';

// Container cho toàn bộ profile
export const ProfileContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

// Container cho ảnh bìa
export const CoverPhotoContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: { xs: 150, sm: 200, md: 250 },
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  marginBottom: theme.spacing(8),

  [theme.breakpoints.down('sm')]: {
    height: 150,
    marginBottom: theme.spacing(6),
  },
}));

// Container cho avatar
export const AvatarContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -75,
  left: theme.spacing(3),
  
  [theme.breakpoints.down('sm')]: {
    top: -60,
    left: theme.spacing(2),
  }
}));

// Container cho thông tin người dùng
export const UserInfoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(8),
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(6),
  }
}));

// Container cho các thông tin chi tiết
export const UserDetailsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

// Container cho thống kê người dùng
export const UserStatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

// Item trong thống kê
export const StatsItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

// Container cho các nút hành động
export const UserActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const ProfileInfoContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
}));

export const ProfileImage = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  objectFit: 'cover',
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(1),
}));

export const ProfileFullName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  textAlign: 'center',
}));

export const IntroContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

export const IntroHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

export const IntroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1rem',
}));

export const IntroItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

export const IntroItemText = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
}));

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const AddFriendButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const MessageButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
    backgroundColor: 'rgba(0, 149, 246, 0.1)',
  },
})); 