import { styled } from '@mui/system';
import { DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

export const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#f5f5f5',
});

export const StyledDialogContent = styled(DialogContent)({
  padding: '24px',
  paddingTop: '16px',
});

export const StyledDialogActions = styled(DialogActions)({
  padding: '16px 24px',
  borderTop: '1px solid #e0e0e0',
});

export const FormSectionTitle = styled(Typography)({
  fontSize: '14px',
  color: '#666',
  marginBottom: '8px',
  fontWeight: 500,
}); 