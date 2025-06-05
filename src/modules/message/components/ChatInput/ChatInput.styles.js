import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Form container cho input chat
export const ChatInputForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
})); 