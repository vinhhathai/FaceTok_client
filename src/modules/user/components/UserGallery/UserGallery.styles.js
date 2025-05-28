import { styled } from '@mui/material/styles';
import { Box, ImageList } from '@mui/material';

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(4)
}));

export const EmptyContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4)
}));

export const GalleryContainer = styled(Box)(({ theme }) => ({
  width: '100%'
}));

export const StyledImageList = styled(ImageList)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr) !important',
  },
  [theme.breakpoints.between('sm', 'md')]: {
    gridTemplateColumns: 'repeat(3, 1fr) !important',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr) !important',
  }
}));

export const ImageItemContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    '& .MuiImageListItemBar-root': {
      opacity: 1
    }
  }
})); 