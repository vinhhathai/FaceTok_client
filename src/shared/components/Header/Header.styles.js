import { styled, alpha } from '@mui/material/styles';
import { AppBar, Toolbar, Box, InputBase } from '@mui/material';

// Styled components
export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1]
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5),
  minHeight: '56px',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 2),
    minHeight: '64px',
    flexDirection: 'row',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1, 0.5),
    gap: theme.spacing(1),
  }
}));

export const LeftSectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '0 1 auto',
  [theme.breakpoints.up('sm')]: {
    minWidth: '300px',
    maxWidth: '600px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  marginRight: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    marginRight: 0,
    justifyContent: 'center',
  }
}));

export const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  width: '100%',
  flexGrow: 1,
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '90%',
  }
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.75, 0.75, 0.75, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
    }
  },
}));

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginLeft: 'auto',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    width: '100%',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
  }
}));

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between',
  }
}));

export const logoStyles = { 
  color: 'primary.main', 
  fontWeight: 'bold', 
  typography: 'h6',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center'
};

export const iconButtonStyles = theme => ({ 
  mr: { xs: 0, sm: 1 },
  p: { xs: 0.5, sm: 1 }
});

export const iconStyles = theme => ({ 
  fontSize: { xs: 20, sm: 24, md: 28 }, 
  color: '#616161' 
});

export const avatarStyles = { 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%', 
  bgcolor: 'primary.main',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'all 0.2s ease',
  ml: { xs: 0.5, sm: 1 }
}; 