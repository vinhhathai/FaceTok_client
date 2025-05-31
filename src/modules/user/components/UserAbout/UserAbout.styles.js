import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Divider, Button } from '@mui/material';

export const AboutContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

export const AboutPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(3),
}));

export const AboutTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

export const AboutBio = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  wordBreak: 'break-word',
}));

export const ExpandButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.75rem',
  marginBottom: theme.spacing(2),
  padding: '0px 8px',
  minWidth: 'auto',
  display: 'block',
  margin: '0 auto',
}));

export const InfoSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  alignItems: 'flex-start',
}));

export const InfoIcon = styled(Box)(({ theme }) => ({
  minWidth: 36,
  color: theme.palette.primary.main,
}));

export const InfoContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
})); 