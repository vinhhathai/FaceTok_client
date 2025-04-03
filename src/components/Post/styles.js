import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius * 2, // Softer corners
}));

export const PostCardHeader = styled(CardHeader)({
  paddingBottom: 0, // Remove bottom padding to bring content closer
  '& .MuiCardHeader-avatar': {
    marginRight: 12, // Adjust spacing
  },
  '& .MuiCardHeader-content': {
    textAlign: 'left', // Căn lề trái
  },
  '& .MuiCardHeader-action': {
    alignSelf: 'flex-start', // Căn đầu nút action
  },
});

export const UserNameLink = styled(Link)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const PostTime = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.8rem',
}));

export const PostCardContent = styled(CardContent)({
  paddingTop: 8, // Reduce top padding
  paddingBottom: '8px !important', // Ensure bottom padding is reduced
});

export const PostText = styled(Typography)({
  textAlign: 'start', // Căn lề trái nội dung post
  marginBottom: 8, // Add space before image if exists
});

export const PostCardMedia = styled(CardMedia)({
  borderRadius: '8px', // Rounded corners for the image
  marginTop: 8,
});

export const PostCardActions = styled(CardActions)({
  justifyContent: 'space-between',
  padding: '4px 16px',
});

export const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export const ActionText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(0.5),
}));

export const PostMenu = styled(Menu)({
  '& .MuiPaper-root': {
    minWidth: 220,
    marginTop: '4px',
  },
});

export const PostMenuItem = styled(MenuItem)({
  paddingTop: 12,
  paddingBottom: 12,
});

export const PostMenuItemIcon = styled(ListItemIcon)({
  minWidth: 36,
});

export const PostMenuItemText = styled(ListItemText)({
  '& .MuiTypography-body1': {
    fontSize: '0.9rem',
  },
  '& .MuiTypography-body2': {
    fontSize: '0.75rem',
  },
}); 