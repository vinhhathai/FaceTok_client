import { styled } from '@mui/material/styles';
import { Box, ImageList } from '@mui/material';

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  minHeight: '200px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    minHeight: '150px',
  }
}));

export const EmptyContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

export const GalleryContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1),
  }
}));

export const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    gap: theme.spacing(0.5),
  }
}));

export const StyledImageList = styled(ImageList)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  margin: 0,
  // Desktop: 4 columns
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr) !important',
    gap: '16px !important',
  },
  // Tablet landscape: 3 columns
  [theme.breakpoints.between('md', 'lg')]: {
    gridTemplateColumns: 'repeat(3, 1fr) !important',
    gap: '12px !important',
  },
  // Tablet portrait: 2 columns
  [theme.breakpoints.between('sm', 'md')]: {
    gridTemplateColumns: 'repeat(2, 1fr) !important',
    gap: '10px !important',
  },
  // Mobile: 2 columns with smaller gap
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr) !important',
    gap: '8px !important',
  },
  // Very small mobile: 1 column
  [theme.breakpoints.down(400)]: {
    gridTemplateColumns: 'repeat(1, 1fr) !important',
    gap: '8px !important',
  }
}));

export const ImageItemContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  aspectRatio: '1 / 1',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  
  '& img, & video': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4],
    '& .MuiImageListItemBar-root': {
      opacity: 1
    }
  },
  
  // Mobile hover effects (touch devices)
  [theme.breakpoints.down('sm')]: {
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
    },
    '&:active': {
      transform: 'scale(0.98)',
    }
  }
}));

export const LoadMoreContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  }
}));

export const VideoOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderRadius: '50%',
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease-in-out',
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
  }
}));