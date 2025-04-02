import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export const WeatherBarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  height: '100%',
  minHeight: 220,
}));

export const WeatherHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

export const WeatherTime = styled(Typography)(({ theme }) => ({
  fontSize: '2.2rem',
  fontWeight: 500,
  margin: 0,
}));

export const LocationButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  cursor: 'pointer',
  textDecoration: 'none',
  '& .MuiTypography-root': {
    fontSize: '1.1rem',
    fontWeight: 500,
  },
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const WeatherContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
}));

export const TemperatureContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

export const WeatherIcon = styled('img')(({ theme }) => ({
  width: 60,
  height: 60,
  marginRight: theme.spacing(1.5),
}));

export const Temperature = styled(Typography)(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 500,
  lineHeight: 1,
  marginLeft: theme.spacing(1),
  display: 'flex',
  alignItems: 'flex-start',
  '& .degree': {
    color: theme.palette.text.secondary,
    fontSize: '2rem',
    marginTop: '0.5rem',
  },
}));

export const WeatherDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const WeatherDetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: '1.1rem',
  '& svg': {
    color: theme.palette.text.secondary,
    fontSize: '1.2rem',
  },
  '& .MuiTypography-root': {
    fontSize: '1.1rem',
  },
})); 