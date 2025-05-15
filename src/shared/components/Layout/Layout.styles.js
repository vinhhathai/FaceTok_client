import { Box, AppBar, Toolbar, Drawer } from '@mui/material';

export const rootBoxStyles = {
  display: 'flex',
  minHeight: '100vh',
};

export const appBarStyles = {
  zIndex: (theme) => theme.zIndex.drawer + 1,
};

export const toolbarStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const drawerStyles = {
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
  },
};

export const mainContentStyles = {
  flexGrow: 1,
  p: 3,
  width: '100%',
  maxWidth: '1200px',
  mx: 'auto',
}; 