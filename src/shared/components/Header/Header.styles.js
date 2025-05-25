import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Box } from '@mui/material';

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
  padding: theme.spacing(0, 1),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 2),
  }
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flex: 1,
  }
}));

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center'
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, 2),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(0, 1),
  }
}));

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center'
}));

export const logoStyles = { 
  color: 'primary.main', 
  fontWeight: 'bold', 
  typography: 'h6',
  textDecoration: 'none'
};

export const searchBoxStyles = { 
  bgcolor: '#f5f5f5', 
  borderRadius: 1, 
  p: '4px 12px' 
};

export const iconButtonStyles = { 
  mr: 1 
};

export const iconStyles = { 
  fontSize: 28, 
  color: '#616161' 
};

export const avatarStyles = { 
  width: 40, 
  height: 40, 
  borderRadius: '50%', 
  bgcolor: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
}; 