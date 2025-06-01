import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Paper, Avatar } from '@mui/material';

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
  marginBottom: theme.spacing(2),
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: 'none',
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginTop: -50,
    background: theme.palette.background.paper,
    width: '100%',
    overflow: 'visible',
    zIndex: 5,
    boxShadow: theme.shadows[1],
  },
}));

export const ProfileImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 150,
  height: 150,
  margin: "0 auto",
  borderRadius: "50%",
  overflow: "hidden",
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    width: 130,
    height: 130,
    margin: "0 auto",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    display: "block",
    left: "auto",
    right: "auto",
    border: `4px solid white`,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
}));

export const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

// ProfileImageOverlay for uploading state
export const ProfileImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '50%',
  zIndex: 2,
}));

// Hidden input for file upload
export const UploadInput = styled('input')({
  display: 'none',
});

export const ProfileFullName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: theme.spacing(1),
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.4rem",
    fontWeight: 700,
    margin: theme.spacing(0.5, 0),
  },
}));

export const IntroContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 1),
  },
}));

export const IntroHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

export const IntroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.1rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
}));

export const IntroItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(1.2),
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  },
}));

export const IntroItemText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: "0.9rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.85rem",
    lineHeight: 1.4,
  },
}));

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(1.5),
  },
}));

export const AddFriendButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const MessageButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
})); 