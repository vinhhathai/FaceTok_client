import React, { useState, useEffect, useRef, useCallback } from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { 
  uploadThumbnail, 
  selectUploadStatus, 
  selectUploadError, 
  resetUploadStatus,
  selectUserProfile,
  fetchUserProfile
} from '../../redux/slices/userSlice';

import {
  ProfileHeaderBackground,
  ProfileCover,
  ProfileCoverImage,
  CoverOverlay,
  UpdateCoverButton,
  UploadInput
} from './ProfileThumbnail.styles';

// Import specific toast functions from our utils
import { showError, showSuccess, showWarning, clearAllToasts } from '../../../../shared/utils/toastMessageUtils';
// Import toast directly from react-toastify for dismiss function
import { toast } from 'react-toastify';

// Default placeholder images
const DEFAULT_COVER_IMAGE = '/assets/images/cover_default.jpg';

// Define constant toast ID to prevent duplicate toasts
const THUMBNAIL_UPDATE_TOAST_ID = 'thumbnail-update-toast';

function ProfileThumbnail({ user }) {
  const dispatch = useDispatch();
  const uploadStatus = useSelector(selectUploadStatus);
  const uploadError = useSelector(selectUploadError);
  const currentProfileFromStore = useSelector(selectUserProfile);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [optimisticImage, setOptimisticImage] = useState(null);
  const [currentImageSrc, setCurrentImageSrc] = useState(null);
  const [imageVersion, setImageVersion] = useState(0);
  
  // Add toast tracking state to prevent multiple toasts
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  
  const originalImageRef = useRef(null);
  const processedUploadRef = useRef(false);
  const imageElementRef = useRef(null);
  
  // Check if user is the owner (can edit)
  const isOwner = user?.isOwner || false;

  // Force re-render function
  const forceRerender = useCallback(() => {
    setImageVersion(v => v + 1);
  }, []);

  // Reset toast tracking when component mounts or unmounts
  useEffect(() => {
    setHasShownSuccessToast(false);
    return () => {
      setHasShownSuccessToast(false);
    };
  }, []);

  // Initialize image on user change
  useEffect(() => {
    if (user?.thumbnail) {
      setCurrentImageSrc(user.thumbnail);
    } else {
      setCurrentImageSrc(DEFAULT_COVER_IMAGE);
    }
    
    // Clean up optimistic image when user changes
    if (optimisticImage) {
      URL.revokeObjectURL(optimisticImage);
      setOptimisticImage(null);
    }
    
    originalImageRef.current = user?.thumbnail || null;
    forceRerender();
  }, [user?.id, user?.thumbnail, forceRerender]);
  
  // Update image when Redux store updates
  useEffect(() => {
    if (currentProfileFromStore?.thumbnail && uploadStatus !== 'loading') {
      // Generate unique cache-busting parameter
      const timestamp = new Date().getTime();
      
      // Completely new URL to bypass browser cache
      let thumbnailUrl = currentProfileFromStore.thumbnail;
      
      // Force cache-busting by adding or updating query parameters
      if (thumbnailUrl.includes('?')) {
        thumbnailUrl = `${thumbnailUrl}&_cb=${timestamp}`;
      } else {
        thumbnailUrl = `${thumbnailUrl}?_cb=${timestamp}`;
      }
      
      // Update the image source with cache busting
      setCurrentImageSrc(thumbnailUrl);

      // Additional force reload for the image
      if (imageElementRef.current) {
        const img = imageElementRef.current;
        img.setAttribute('data-src', thumbnailUrl);
        img.src = '';
        
        // Give browser a moment before setting new src
        setTimeout(() => {
          if (imageElementRef.current) {
            imageElementRef.current.src = thumbnailUrl;
          }
        }, 100);
      }
      
      // Update image version to force React to rerender the component
      forceRerender();
    }
  }, [currentProfileFromStore?.thumbnail, uploadStatus, forceRerender]);
  
  // Clean up URL objects when component unmounts
  useEffect(() => {
    return () => {
      if (optimisticImage) {
        URL.revokeObjectURL(optimisticImage);
      }
    };
  }, [optimisticImage]);
  
  // Monitor upload status from Redux
  useEffect(() => {
    if (uploadStatus === 'succeeded' && !processedUploadRef.current) {
      // Mark this upload as processed
      processedUploadRef.current = true;
      
      // Show success notification ONLY if we haven't shown one already
      if (!hasShownSuccessToast) {
        // Fixed: Using toast ID to prevent duplicates
        toast.dismiss(THUMBNAIL_UPDATE_TOAST_ID); // Dismiss any existing toast with this ID
        showSuccess("Ảnh bìa đã được cập nhật thành công!", {
          toastId: THUMBNAIL_UPDATE_TOAST_ID,
          autoClose: 2000,  // 2 seconds
          // Prevent toast from being auto-closed on state changes
          pauseOnFocusLoss: false,
          closeOnClick: false
        });
        setHasShownSuccessToast(true);
        
        // Delay the profile refresh to allow toast to be visible first
        setTimeout(() => {
          // Re-fetch user profile to get the updated thumbnail
          if (user?.id) {
            dispatch(fetchUserProfile(user.id));
          }
        }, 500); // Half-second delay before refreshing data
      }
      
      setIsUploading(false);
      setUploadProgress(0);
      
      // Clean up the optimistic image
      if (optimisticImage) {
        URL.revokeObjectURL(optimisticImage);
        setOptimisticImage(null); 
      }
      
      // Reset upload status to prevent repeated handling
      setTimeout(() => {
        dispatch(resetUploadStatus());
        
        // Allow for future upload notifications, but with a delay
        setTimeout(() => {
          setHasShownSuccessToast(false);
          processedUploadRef.current = false;
        }, 6000); // Wait until after toast is gone (5s display + 1s buffer)
      }, 100);
    } else if (uploadStatus === 'failed') {
      // Only show error if we haven't shown success
      if (!hasShownSuccessToast) {
        // Fixed: Using toast ID to prevent duplicates
        toast.dismiss(THUMBNAIL_UPDATE_TOAST_ID); // Dismiss any existing toast with this ID
        showError(uploadError?.message || "Lỗi khi cập nhật ảnh bìa!", {
          toastId: THUMBNAIL_UPDATE_TOAST_ID
        });
      }
      
      setIsUploading(false);
      setUploadProgress(0);
      processedUploadRef.current = false;
      
      // Clean up and roll back to original image
      if (optimisticImage) {
        URL.revokeObjectURL(optimisticImage);
        setOptimisticImage(null);
      }
      
      // Restore original image
      setCurrentImageSrc(originalImageRef.current || DEFAULT_COVER_IMAGE);
      forceRerender();
      
      // Reset upload status on failure
      setTimeout(() => {
        dispatch(resetUploadStatus());
        setHasShownSuccessToast(false);
      }, 100);
    }
  }, [uploadStatus, uploadError, dispatch, optimisticImage, forceRerender, hasShownSuccessToast, user]);
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset toast tracking for new upload
    setHasShownSuccessToast(false);

    // Clean up previous optimistic image if exists
    if (optimisticImage) {
      URL.revokeObjectURL(optimisticImage);
    }

    // Save original thumbnail URL for rollback
    originalImageRef.current = currentImageSrc;
    
    // Create an optimistic local image URL
    const localImageUrl = URL.createObjectURL(file);
    setOptimisticImage(localImageUrl);
    setCurrentImageSrc(localImageUrl);
    forceRerender();
    
    // Reset the processed flag when starting a new upload
    processedUploadRef.current = false;
    setIsUploading(true);
    
    // Use the uploadThumbnail action from Redux
    dispatch(uploadThumbnail({
      file,
      onProgress: (progress) => {
        setUploadProgress(progress);
      }
    }));
  };

  // Display image with priority: optimistic image > current image > default
  const displayImage = optimisticImage || currentImageSrc || DEFAULT_COVER_IMAGE;

  if (!user) {
    return <ProfileHeaderBackground />;
  }

  return (
    <ProfileHeaderBackground>
      <ProfileCover>
        <ProfileCoverImage
          ref={imageElementRef}
          src={displayImage}
          alt="Profile Cover"
          key={`thumbnail-${imageVersion}-${Date.now()}`}
          onError={(e) => {
            e.target.onerror = null; // Avoid infinite loop
            setImgError(true);
            if (optimisticImage) {
              URL.revokeObjectURL(optimisticImage);
              setOptimisticImage(null);
            }
            setCurrentImageSrc(DEFAULT_COVER_IMAGE);
            forceRerender();
          }}
        />
        {isOwner && (
          <CoverOverlay className="cover-overlay">
            <label htmlFor="upload-cover-photo">
              <UpdateCoverButton
                variant="contained"
                component="span"
                disabled={isUploading || uploadStatus === 'loading'}
                startIcon={(isUploading || uploadStatus === 'loading') ? 
                  <CircularProgress size={16} color="inherit" variant={uploadProgress > 0 ? "determinate" : "indeterminate"} value={uploadProgress} /> : 
                  <CameraAltIcon fontSize="small" />
                }
                size="small"
              >
                {(isUploading || uploadStatus === 'loading') ? `${uploadProgress}%` : "Cập nhật ảnh bìa"}
              </UpdateCoverButton>
              <UploadInput
                id="upload-cover-photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading || uploadStatus === 'loading'}
              />
            </label>
          </CoverOverlay>
        )}
      </ProfileCover>
    </ProfileHeaderBackground>
  );
}

export default ProfileThumbnail; 