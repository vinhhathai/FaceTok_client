import { styled } from '@mui/material/styles';
import { Box, Button, Chip, TextField } from '@mui/material';

export const PostContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiCard-root': {
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      boxShadow: theme.shadows[4],
      transition: 'box-shadow 0.3s ease-in-out'
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: theme.spacing(1),
      margin: theme.spacing(0, 1, 2, 1)
    }
  }
}));

export const PostHeader = styled(Box)(({ theme }) => ({
  '& .MuiCardHeader-root': {
    padding: theme.spacing(2, 2, 1, 2),
    '& .MuiCardHeader-avatar': {
      marginRight: theme.spacing(1.5)
    },
    '& .MuiCardHeader-action': {
      margin: 0
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5, 1.5, 0.5, 1.5),
      '& .MuiCardHeader-avatar': {
        marginRight: theme.spacing(1)
      },
      '& .MuiCardHeader-content': {
        '& .MuiTypography-root': {
          fontSize: '0.875rem'
        }
      }
    }
  }
}));

export const PostContent = styled(Box)(({ theme }) => ({
  '& .MuiCardContent-root': {
    padding: theme.spacing(0, 2, 1, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1.5, 0.5, 1.5)
    }
  }
}));

export const PostStats = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`
}));

export const PostFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2)
}));

export const PostActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  padding: theme.spacing(0.5, 0),
  '& > *': {
    flex: 1
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.25, 0),
    '& .MuiButton-root': {
      padding: theme.spacing(0.75),
      '& .MuiTypography-root': {
        fontSize: '0.75rem'
      }
    }
  }
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary
  },
  '& .MuiTypography-root': {
    fontSize: '0.75rem',
    fontWeight: 500
  }
}));

export const LikeButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'liked'
})(({ theme, liked }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  transition: 'all 0.2s ease-in-out',
  ...(liked && {
    animation: 'likeAnimation 0.3s ease-in-out'
  }),
  '@keyframes likeAnimation': {
    '0%': {
      transform: 'scale(1)'
    },
    '50%': {
      transform: 'scale(1.2)'
    },
    '100%': {
      transform: 'scale(1)'
    }
  }
}));

export const CommentButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  transition: 'all 0.2s ease-in-out'
}));

export const ShareButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  transition: 'all 0.2s ease-in-out'
}));

export const MoreButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  transition: 'all 0.2s ease-in-out'
}));

export const CommentSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    '& .MuiBox-root': {
      padding: theme.spacing(1.5)
    }
  }
}));

export const CommentInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    minHeight: '32px',
    '& fieldset': {
      borderColor: theme.palette.divider
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main
    }
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 2),
    fontSize: '0.875rem',
    lineHeight: 1.2
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(2),
      minHeight: '28px'
    },
    '& .MuiInputBase-input': {
      padding: theme.spacing(0.375, 1.5),
      fontSize: '0.8rem'
    }
  }
}));

export const CommentItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none'
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1.5),
    '& .MuiTypography-root': {
      fontSize: '0.8rem'
    },
    '& .MuiTypography-caption': {
      fontSize: '0.7rem'
    }
  }
}));

export const TimeChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.secondary,
  '& .MuiChip-icon': {
    color: 'inherit'
  }
}));



export const ImageGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2)
}));

export const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  '&.last-image': {
    position: 'relative',
    '& .more-overlay': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }
}));

export const SingleImage = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  marginTop: theme.spacing(2),
  '& img': {
    width: '100%',
    maxHeight: 400,
    objectFit: 'cover',
    display: 'block'
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.spacing(0.5),
    marginTop: theme.spacing(1.5),
    '& img': {
      maxHeight: 300
    }
  }
}));

export const MultipleImageGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mediaCount'
})(({ theme, mediaCount }) => {
  const getGridLayout = (count) => {
    switch (count) {
      case 2:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr',
          aspectRatio: '2/1'
        };
      case 3:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          '& > *:first-child': {
            gridColumn: '1 / 3',
            gridRow: '1 / 2'
          }
        };
      case 4:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          aspectRatio: '1/1'
        };
      case 5:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          '& > *:nth-child(3)': {
            gridColumn: '1 / 2',
            gridRow: '2 / 3'
          },
          '& > *:nth-child(4)': {
            gridColumn: '2 / 3',
            gridRow: '2 / 3'
          }
        };
      default:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr'
        };
    }
  };

  return {
    display: 'grid',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    ...getGridLayout(mediaCount),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.5),
      marginTop: theme.spacing(1.5),
      borderRadius: theme.spacing(0.5)
    }
  };
});

export const PostImage = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  marginTop: theme.spacing(2),
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block'
  }
}));
