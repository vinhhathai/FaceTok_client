import { styled } from '@mui/material/styles';
import { Paper, Typography, Button, Box } from '@mui/material';

export const PostContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  overflow: 'hidden',
}));

export const PostHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export const PostAuthorInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const PostAuthorName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const PostTime = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

export const PostContent = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const MediaContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  marginTop: theme.spacing(1),
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  fontWeight: 500,
  textTransform: 'none',
  flex: 1,
  padding: theme.spacing(1),
  minWidth: '70px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:active': {
    backgroundColor: theme.palette.action.selected,
  },
}));

export const ActionCount = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
}));

export const CommentSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'block',
  width: '100%',
})); 