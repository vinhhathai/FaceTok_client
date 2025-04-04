import { styled } from '@mui/material/styles';
import { Box, List, Typography, ListItem } from '@mui/material';

export const ConversationSidebar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}));

export const ConversationHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

export const ConversationList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: '6px'
  }
}));

export const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  padding: theme.spacing(1.5, 2),
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
})); 