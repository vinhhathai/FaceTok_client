import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';

const AnnouncementViewer = ({ announcements, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
    }
  }, [open]);

  if (!announcements || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];
  const hasMultiple = announcements.length > 1;

  const handleNext = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleClose = () => {
    setCurrentIndex(0);
    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'info':
        return <InfoIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'success':
        return <CheckCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'info':
        return 'Thông tin';
      case 'warning':
        return 'Cảnh báo';
      case 'error':
        return 'Khẩn cấp';
      case 'success':
        return 'Thành công';
      default:
        return 'Thông báo';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        },
      }}
    >
      {/* Header with Gradient */}
      <Box
        sx={{
          background: currentAnnouncement.type === 'error' 
            ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
            : currentAnnouncement.type === 'warning'
            ? 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)'
            : currentAnnouncement.type === 'success'
            ? 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)'
            : 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
          color: 'white',
          p: 3,
          position: 'relative',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getTypeIcon(currentAnnouncement.type)}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
              {getTypeLabel(currentAnnouncement.type)}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.5 }}>
              {currentAnnouncement.title}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        
        {hasMultiple && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 60,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
            }}
          >
            <Typography variant="caption" fontWeight="bold">
              {currentIndex + 1} / {announcements.length}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 4, backgroundColor: '#f8f9fa' }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: 'white',
            borderRadius: 3,
            border: '1px solid',
            borderColor: currentAnnouncement.type === 'error' 
              ? 'rgba(255, 107, 107, 0.3)'
              : currentAnnouncement.type === 'warning'
              ? 'rgba(255, 167, 38, 0.3)'
              : currentAnnouncement.type === 'success'
              ? 'rgba(102, 187, 106, 0.3)'
              : 'rgba(78, 205, 196, 0.3)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.8,
              color: '#333',
              fontSize: '1rem',
            }}
          >
            {currentAnnouncement.message}
          </Typography>
          
          {/* Image if available */}
          {currentAnnouncement.image && (
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={currentAnnouncement.image}
                alt={currentAnnouncement.title}
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            </Box>
          )}
        </Paper>

        {/* Metadata */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              📅 {new Date(currentAnnouncement.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: 3,
          backgroundColor: '#f8f9fa',
          justifyContent: hasMultiple ? 'space-between' : 'center',
          gap: 2,
        }}
      >
        {hasMultiple ? (
          <>
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              startIcon={<NavigateBeforeIcon />}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Trước
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {announcements.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: idx === currentIndex ? 'primary.main' : 'grey.300',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </Box>
            
            <Button
              onClick={handleNext}
              endIcon={currentIndex === announcements.length - 1 ? <CloseIcon /> : <NavigateNextIcon />}
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                background: currentAnnouncement.type === 'error' 
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                  : currentAnnouncement.type === 'warning'
                  ? 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)'
                  : currentAnnouncement.type === 'success'
                  ? 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)'
                  : 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              {currentIndex === announcements.length - 1 ? 'Đóng' : 'Tiếp theo'}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleClose}
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              background: currentAnnouncement.type === 'error' 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                : currentAnnouncement.type === 'warning'
                ? 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)'
                : currentAnnouncement.type === 'success'
                ? 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)'
                : 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              },
            }}
          >
            Đã hiểu
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementViewer;
