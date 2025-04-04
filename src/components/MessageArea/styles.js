import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const MessageArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.default
}));

export const ConversationHeader2 = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
  zIndex: 5
}));

export const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  maxHeight: 'calc(100vh - 190px)',
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: '6px'
  }
}));

export const MessageBubble = styled(Box)(({ theme, isSender }) => ({
  backgroundColor: isSender ? theme.palette.primary.light : theme.palette.grey[100],
  color: isSender ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: '18px',
  padding: theme.spacing(1.5, 2),
  maxWidth: '70%',
  wordBreak: 'break-word'
}));

export const MessageInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  position: 'sticky',
  bottom: 0,
  zIndex: 5
}));

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: theme.spacing(3),
  textAlign: 'center'
})); 