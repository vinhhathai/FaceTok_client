import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    maxWidth: '100vw',
    maxHeight: '100vh',
    width: '100%',
    height: '100%',
    margin: 0,
    borderRadius: 0,
    [theme.breakpoints.up('sm')]: {
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: 'auto',
      height: 'auto',
      borderRadius: theme.spacing(1),
    },
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
}));

const MediaContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  maxHeight: '100vh',
  padding: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    minHeight: '60vh',
    maxHeight: '85vh',
    padding: theme.spacing(2),
  },
}));

const MediaImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  borderRadius: theme.spacing(1),
}));

const MediaVideo = styled('video')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  borderRadius: theme.spacing(1),
}));

const ControlsOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  background: 'transparent',
  transition: 'opacity 0.3s ease',
  '&:hover': {
    '& .nav-button': {
      opacity: 1,
    },
  },
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  opacity: 0.7,
  transition: 'all 0.3s ease',
  padding: theme.spacing(1),
  fontSize: '1.2rem',
  [theme.breakpoints.down('sm')]: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 1,
    padding: theme.spacing(1.5),
    fontSize: '1.5rem',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 1,
  },
  '&:disabled': {
    opacity: 0.3,
  },
}));

const TopControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1),
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
  zIndex: 1,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
  },
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1),
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  zIndex: 1,
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const MediaViewer = ({ 
  open, 
  onClose, 
  mediaList = [], 
  currentIndex = 0, 
  onIndexChange 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoRef, setVideoRef] = useState(null);

  const currentMedia = mediaList[currentIndex];

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!open) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case ' ':
          if (currentMedia?.type === 'video') {
            event.preventDefault();
            handlePlayPause();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [open, currentIndex, isPlaying]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < mediaList.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  const handlePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoRef = (ref) => {
    setVideoRef(ref);
    if (ref) {
      ref.addEventListener('play', () => setIsPlaying(true));
      ref.addEventListener('pause', () => setIsPlaying(false));
      ref.addEventListener('ended', () => setIsPlaying(false));
    }
  };

  if (!currentMedia) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <TopControls>
          <Typography 
            variant={isMobile ? "caption" : "body2"} 
            color="white" 
            sx={{ opacity: 0.8, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            {currentIndex + 1} / {mediaList.length}
          </Typography>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'white',
              padding: { xs: 1, sm: 1.5 },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </TopControls>

        <MediaContainer>
          {currentMedia.type === 'image' ? (
            <MediaImage
              src={currentMedia.url}
              alt="Media content"
              loading="lazy"
            />
          ) : (
            <MediaVideo
              ref={handleVideoRef}
              src={currentMedia.url}
              controls={false}
              muted={isMuted}
              onClick={handlePlayPause}
            />
          )}

          <ControlsOverlay>
            <NavButton
              className="nav-button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              sx={{ opacity: currentIndex === 0 ? 0.3 : 0.7 }}
            >
              <ArrowBackIcon />
            </NavButton>

            <NavButton
              className="nav-button"
              onClick={handleNext}
              disabled={currentIndex === mediaList.length - 1}
              sx={{ opacity: currentIndex === mediaList.length - 1 ? 0.3 : 0.7 }}
            >
              <ArrowForwardIcon />
            </NavButton>
          </ControlsOverlay>

          {currentMedia.type === 'video' && (
            <VideoControls>
              <IconButton 
                onClick={handlePlayPause} 
                sx={{ 
                  color: 'white',
                  padding: { xs: 1, sm: 1.5 },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.5rem', sm: '1.8rem' }
                  }
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              <IconButton 
                onClick={handleMuteToggle} 
                sx={{ 
                  color: 'white',
                  padding: { xs: 1, sm: 1.5 },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.5rem', sm: '1.8rem' }
                  }
                }}
              >
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </VideoControls>
          )}
        </MediaContainer>
      </DialogContent>
    </StyledDialog>
  );
};

export default MediaViewer;