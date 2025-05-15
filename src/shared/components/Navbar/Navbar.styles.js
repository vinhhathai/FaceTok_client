import { AppBar, Toolbar, Button, Box } from '@mui/material';

export const appBarStyles = {
  backgroundColor: 'white',
  color: 'black',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
};

export const toolbarStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 2,
};

export const logoBoxStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const navButtonsBoxStyles = {
  display: 'flex',
  gap: 2,
};

export const loginButtonStyles = {
  color: 'primary.main',
  borderColor: 'primary.main',
  '&:hover': {
    backgroundColor: 'primary.light',
    color: 'white',
  },
};

export const registerButtonStyles = {
  backgroundColor: 'primary.main',
  color: 'white',
  '&:hover': {
    backgroundColor: 'primary.dark',
  },
}; 