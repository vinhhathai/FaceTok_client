import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const SearchContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
}));

export const SearchResults = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
}));

export const SearchResultCard = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
}));

export const NoResults = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
})); 