import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Page container styles
export const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  maxHeight: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  paddingTop: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  maxHeight: 'calc(100vh - 70px)',
  marginTop: '6px'
}));

// Remove styles that have been moved to component-specific style files:
// ConversationSidebar, ConversationList, ConversationHeader, StyledListItem
// MessageArea, ConversationHeader2, MessagesContainer, MessageBubble,
// MessageInputContainer, EmptyStateContainer 