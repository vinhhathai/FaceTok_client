import { styled } from '@mui/system';
import { Paper, Typography, ListItem, ListItemIcon } from '@mui/material';

export const SectionContainer = styled(Paper)(({ theme }) => ({
  padding: 20,
  marginBottom: 20,
  borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 16,
  textAlign: 'left'
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: '8px 0',
}));

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: '#65676B',
}));

export const EmptyMessage = styled(Typography)(({ theme }) => ({
  color: '#65676B',
  fontStyle: 'italic',
  textAlign: 'left',
  padding: '20px 0',
})); 