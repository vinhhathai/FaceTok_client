import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const SpinnerContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullScreen',
})(({ theme, fullScreen }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2.5, 0),
  ...(fullScreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    zIndex: theme.zIndex.modal + 1, // Ensure it's above other modals
  }),
}));

export const SpinnerWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const SpinnerText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1.5),
}));

// Map size prop to MUI CircularProgress size
export const getSize = (size) => {
  switch (size) {
    case 'small':
      return 20;
    case 'large':
      return 60;
    case 'medium':
    default:
      return 40;
  }
}; 