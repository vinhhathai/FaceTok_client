import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, CircularProgress } from '@mui/material';
import {
  ProfileImageWrapper,
  ProfileImage,
  ProfileImageOverlay,
  AvatarHoverOverlay,
  UploadInput
} from '../ProfileHeader.styles';
const defaultAvatar = '/assets/images/avatar_default.webp';

const ProfileAvatar = ({ 
  avatarSrc, 
  userName, 
  isUploading, 
  uploadProgress, 
  handleAvatarChange, 
  isOwner 
}) => {
  const [imgError, setImgError] = useState(false);
  
  const handleImageError = () => {
    console.log('Không thể tải ảnh đại diện, sử dụng ảnh mặc định');
    setImgError(true);
  };
  
  // Use default avatar if source is empty, null, or had an error
  const displayImage = (!avatarSrc || avatarSrc.trim() === '' || imgError) 
    ? defaultAvatar 
    : avatarSrc;
  
  return (
    <ProfileImageWrapper>
      <ProfileImage 
        src={displayImage}
        alt={userName}
        onError={handleImageError}
        sx={{
          ...(isUploading && { 
            filter: 'blur(2px)',
            transition: 'filter 0.3s ease-in-out' 
          })
        }}
      />
      
      {isUploading && (
        <ProfileImageOverlay>
          <CircularProgress 
            size={40} 
            variant="determinate" 
            value={uploadProgress} 
            sx={{ color: '#fff' }} 
          />
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 1, 
              color: '#fff',
              fontWeight: 'bold' 
            }}
          >
            {uploadProgress}%
          </Typography>
        </ProfileImageOverlay>
      )}
      
      {isOwner && (
        <AvatarHoverOverlay>
          <label 
            htmlFor="upload-avatar" 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Cập nhật
            </Typography>
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              ảnh đại diện
            </Typography>
          </label>
          <UploadInput
            id="upload-avatar"
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleAvatarChange}
            disabled={isUploading}
          />
        </AvatarHoverOverlay>
      )}
    </ProfileImageWrapper>
  );
};

ProfileAvatar.propTypes = {
  avatarSrc: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadProgress: PropTypes.number.isRequired,
  handleAvatarChange: PropTypes.func.isRequired,
  isOwner: PropTypes.bool,
};

ProfileAvatar.defaultProps = {
  isOwner: false,
  uploadProgress: 0
};

export default ProfileAvatar; 