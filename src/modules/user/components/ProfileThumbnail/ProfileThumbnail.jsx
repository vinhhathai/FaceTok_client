import React, { useState } from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {
  ProfileHeaderBackground,
  ProfileCover,
  ProfileCoverImage,
  CoverOverlay,
  UpdateCoverButton,
  UploadInput
} from './ProfileThumbnail.styles';

import { showSuccess, showWarning } from '../../../../shared/utils/toastMessageUtils';

function ProfileThumbnail({ user }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Xác định xem user có phải là user hiện tại không
  const isOwnProfile = user?.isCurrentUser || false;
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Giả lập tiến trình upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      // Sau 3 giây, kết thúc quá trình upload
      setTimeout(() => {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        showSuccess("Ảnh bìa đã được cập nhật thành công!");
      }, 3000);
      
    } catch (error) {
      showWarning("Lỗi khi cập nhật ảnh bìa!");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <ProfileHeaderBackground>
      <ProfileCover>
        <ProfileCoverImage
          src={user?.coverPhoto || "https://via.placeholder.com/1200x300"}
          alt="Profile Cover"
          onError={(e) => {
            e.target.onerror = null; // Avoid infinite loop
            e.target.src = "https://via.placeholder.com/1200x300";
          }}
        />
        {isOwnProfile && (
          <CoverOverlay className="cover-overlay">
            <label htmlFor="upload-cover-photo">
              <UpdateCoverButton
                variant="contained"
                component="span"
                disabled={isUploading}
                startIcon={isUploading ? 
                  <CircularProgress size={16} color="inherit" variant={uploadProgress > 0 ? "determinate" : "indeterminate"} value={uploadProgress} /> : 
                  <CameraAltIcon />
                }
              >
                {isUploading ? `Đang tải lên... ${uploadProgress}%` : "Cập nhật ảnh bìa"}
              </UpdateCoverButton>
              <UploadInput
                id="upload-cover-photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </CoverOverlay>
        )}
      </ProfileCover>
    </ProfileHeaderBackground>
  );
}

export default ProfileThumbnail; 