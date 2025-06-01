import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Fab } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import {
  ProfileCover,
  ProfileCoverImage,
  CoverOverlay,
  UploadButton,
  UploadInput
} from './CoverPhoto.styles';

// Default cover image path
const DEFAULT_COVER_IMAGE = '/assets/images/cover_default.webp';

const CoverPhoto = ({
  imageRef,
  currentImageSrc,
  imageVersion,
  isUploading,
  uploadProgress,
  onImageError,
  isOwner,
  isMobile,
  onFileChange
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Handle image load error
  const handleImageError = (e) => {
    console.log('Cover photo load error:', e);
    setImgError(true);
    if (onImageError) {
      onImageError(e);
    }
  };

  // Determine which image to display
  // 1. Use currentImageSrc if it exists and hasn't failed to load
  // 2. Otherwise use default image
  const displayImage = (!currentImageSrc || imgError || currentImageSrc.trim() === '') 
    ? DEFAULT_COVER_IMAGE 
    : currentImageSrc;

  return (
    <ProfileCover>
      <ProfileCoverImage
        ref={imageRef}
        src={displayImage}
        alt="Cover Photo"
        key={`thumbnail-${imageVersion}`} // Force re-render when image changes
        onError={handleImageError}
        style={{
          filter: isUploading ? 'blur(2px)' : 'none',
          transition: 'filter 0.3s ease-in-out',
          backgroundColor: '#f0f2f5', // Light gray background for empty state
        }}
      />
      
      {isUploading && (
        <CoverOverlay>
          <CircularProgress 
            variant="determinate" 
            value={uploadProgress} 
            color="primary" 
            size={60}
            thickness={4}
          />
          <span 
            style={{ 
              position: 'absolute', 
              color: 'white', 
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {`${Math.round(uploadProgress)}%`}
          </span>
        </CoverOverlay>
      )}

      {/* Upload button for both mobile and desktop */}
      {isOwner && !isUploading && (
        <UploadButton
          component="label"
          disabled={isUploading}
          aria-label="Cập nhật ảnh bìa"
        >
          <CameraAltIcon sx={{ fontSize: 16 }} />
          <UploadInput
            accept="image/*"
            type="file"
            onChange={onFileChange}
            disabled={isUploading}
          />
        </UploadButton>
      )}
    </ProfileCover>
  );
};

CoverPhoto.propTypes = {
  imageRef: PropTypes.object,
  currentImageSrc: PropTypes.string,
  imageVersion: PropTypes.number.isRequired,
  isUploading: PropTypes.bool,
  uploadProgress: PropTypes.number,
  onImageError: PropTypes.func,
  isOwner: PropTypes.bool,
  isMobile: PropTypes.bool,
  onFileChange: PropTypes.func
};

CoverPhoto.defaultProps = {
  isUploading: false,
  uploadProgress: 0,
  isOwner: false,
  isMobile: false
};

export default CoverPhoto; 