import { Box } from '@mui/material';

export const logoContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const logoImageStyles = {
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
};

export const logoSmallStyles = {
  width: 24,
  height: 24,
};

export const logoMediumStyles = {
  width: 32,
  height: 32,
};

export const logoLargeStyles = {
  width: 48,
  height: 48,
};

export const logoTextStyles = {
  fontWeight: 600,
};

export const logoTextSmallStyles = {
  fontSize: '1rem',
};

export const logoTextMediumStyles = {
  fontSize: '1.25rem',
};

export const logoTextLargeStyles = {
  fontSize: '1.5rem',
}; 