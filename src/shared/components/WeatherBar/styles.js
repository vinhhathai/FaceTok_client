import { styled } from '@mui/material/styles';
import { Box, Typography, Paper, Button } from '@mui/material';

export const WeatherBarContainer = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
}));

export const WeatherHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(2)
}));

export const WeatherTime = styled(Typography)(({ theme }) => ({
  fontSize: '2.2rem',
  fontWeight: 400,
  lineHeight: 1.2
}));

export const LocationButton = styled(Button)(({ theme }) => ({
  textTransform: 'uppercase',
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0, 1),
  minHeight: 0,
  fontSize: '0.75rem',
  display: 'flex',
  alignItems: 'center'
}));

export const WeatherContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}));

export const TemperatureContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

export const WeatherIcon = styled('img')(({ theme }) => ({
  width: 80,
  height: 80
}));

export const Temperature = styled(Typography)(({ theme }) => ({
  fontSize: '2.4rem',
  fontWeight: 400,
  lineHeight: 1,
  '& .degree': {
    verticalAlign: 'super',
    fontSize: '1.3rem'
  }
}));

export const WeatherDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));

export const WeatherDetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
})); 