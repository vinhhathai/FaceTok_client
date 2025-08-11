import { styled } from '@mui/material/styles';
import { Box, Avatar, IconButton } from '@mui/material';

export const drawerPaperSx = {
  width: 320,
  backgroundColor: 'background.paper',
};

export const SidebarContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const RowBetween = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const AvatarWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

export const GroupAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: '2rem',
}));

export const AvatarActionButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': { backgroundColor: theme.palette.primary.dark },
}));

export const NameRow = styled(RowBetween)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const MembersSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ActionsColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const OwnerBadgeIconSx = {
  position: 'absolute',
  right: -6,
  bottom: -6,
  bgcolor: 'background.paper',
  borderRadius: '50%',
};


