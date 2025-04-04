import { styled } from '@mui/material/styles';
import { Typography, Box, Button, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';

export const FriendListContainer = styled(Box)(({ theme }) => ({
  width: '100%'
}));

export const TabPanelContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2)
}));

export const EmptyStateText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4)
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  alignItems: 'flex-start'
}));

export const UserLink = styled(Typography)(({ theme }) => ({
  color: 'inherit',
  textDecoration: 'none',
  fontWeight: 'bold',
  '&:hover': { 
    textDecoration: 'underline' 
  }
}));

export const MessageButton = styled(Button)(({ theme }) => ({
  borderColor: '#2196f3',
  color: '#2196f3',
  '&:hover': {
    borderColor: '#1976d2',
    backgroundColor: 'rgba(33, 150, 243, 0.04)'
  }
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(4)
}));

export const ErrorContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'center'
})); 