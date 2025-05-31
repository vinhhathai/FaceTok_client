import React from 'react';
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

const DEFAULT_COVER_IMAGE = '/assets/images/cover_default.jpg';

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
  // Display image with priority: current image > default
  const displayImage = currentImageSrc || DEFAULT_COVER_IMAGE;

  return (
    <ProfileCover>
      <ProfileCoverImage
        ref={imageRef}
        src={displayImage}
        alt="Cover Photo"
        key={`thumbnail-${imageVersion}`} // Force re-render when image changes
        onError={onImageError}
        style={{
          filter: isUploading ? 'blur(2px)' : 'none',
          transition: 'filter 0.3s ease-in-out',
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

      {/* Mobile update button directly on the cover photo */}
      {isOwner && !isUploading && isMobile && (
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