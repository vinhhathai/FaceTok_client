import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const AboutContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

export const AboutPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(7), // To avoid being covered by the Fab button
  },
})); 