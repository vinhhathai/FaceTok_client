import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

// Styled components cho Header
export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.05)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column', // Stack vertically on smallest screens
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
  },
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    justifyContent: 'flex-start',
    marginBottom: 0,
    flex: '0 0 auto',
  },
}));

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    width: 'auto',
    justifyContent: 'flex-end',
  },
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(2),
  },
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    maxWidth: '300px',
    marginBottom: 0,
    marginLeft: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: '400px',
  },
}));

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(2),
  },
}));

export const MenuTitle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const MenuFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
}));

export const IconAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
})); 