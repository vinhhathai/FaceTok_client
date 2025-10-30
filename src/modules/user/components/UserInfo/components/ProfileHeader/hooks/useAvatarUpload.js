import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { uploadAvatar, fetchUserProfile } from '@user/redux/slices/userSlice';
import { showSuccess, showError } from '@utils';

// Default avatar image
const DEFAULT_AVATAR_IMAGE = '/assets/images/avatar_default.jpg';

// Define constant toast ID to prevent duplicate toasts
const AVATAR_UPDATE_TOAST_ID = 'avatar-update-toast';

export const useAvatarUpload = (user) => {
  const dispatch = useDispatch();
  
  
  // Local states thay vì Redux selectors
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadError, setUploadError] = useState(null);
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
    // Check if user has a valid avatar URL
    const isValidAvatar = user?.profilePicture && typeof user.profilePicture === 'string' && user.profilePicture.trim() !== '';
    
    if (isValidAvatar) {
      setCurrentImageSrc(user.profilePicture);
      setImgError(false); // Reset error state when setting a new image
    } else {
      setCurrentImageSrc(DEFAULT_AVATAR_IMAGE);
    }
    
    // Clean up optimistic image when user changes
    if (optimisticImage) {
      URL.revokeObjectURL(optimisticImage);
      setOptimisticImage(null);
    }
    
    originalImageRef.current = isValidAvatar ? user.profilePicture : null;
    forceRerender();
  }, [user?.id, user?.profilePicture, forceRerender, optimisticImage]);
  
  // Clean up URL objects when component unmounts
  useEffect(() => {
    return () => {
      if (optimisticImage) {
        URL.revokeObjectURL(optimisticImage);
      }
    };
  }, [optimisticImage]);
  
  // Monitor upload status from local state
  useEffect(() => {
    if (uploadStatus === 'succeeded' && !processedUploadRef.current) {
      // Mark this upload as processed
      processedUploadRef.current = true;
      
      // Show success notification ONLY if we haven't shown one already
      if (!hasShownSuccessToast) {
        // Fixed: Using toast ID to prevent duplicates
        toast.dismiss(AVATAR_UPDATE_TOAST_ID); // Dismiss any existing toast with this ID
        showSuccess("Ảnh đại diện đã được cập nhật thành công!", {
          toastId: AVATAR_UPDATE_TOAST_ID,
          autoClose: 2000,  // 2 seconds
          // Prevent toast from being auto-closed on state changes
          pauseOnFocusLoss: false,
          closeOnClick: false
        });
        setHasShownSuccessToast(true);
        
        // Delay the profile refresh to allow toast to be visible first
        setTimeout(() => {
          // Re-fetch user profile to get the updated avatar
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
      
      // Reset status after processing
      setTimeout(() => {
        setUploadStatus('idle');
        processedUploadRef.current = false;
      }, 1000);
    }
    
    if (uploadStatus === 'failed') {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Show error notification
      if (uploadError) {
        showError(uploadError);
      }
      
      // Clean up the optimistic image
      if (optimisticImage) {
        URL.revokeObjectURL(optimisticImage);
        setOptimisticImage(null);
      }
      
      // Reset status after processing
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadError(null);
      }, 1000);
    }
  }, [uploadStatus, uploadError, optimisticImage, hasShownSuccessToast, user?.id, dispatch]);
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset toast tracking for new upload
    setHasShownSuccessToast(false);

    // Clean up previous optimistic image if exists
    if (optimisticImage) {
      URL.revokeObjectURL(optimisticImage);
    }

    // Save original avatar URL for rollback
    originalImageRef.current = currentImageSrc;
    
    // Create an optimistic local image URL
    const localImageUrl = URL.createObjectURL(file);
    setOptimisticImage(localImageUrl);
    setCurrentImageSrc(localImageUrl);
    setImgError(false); // Reset error state when uploading a new image
    forceRerender();
    
    // Reset the processed flag when starting a new upload
    processedUploadRef.current = false;
    setIsUploading(true);
    setUploadStatus('loading');
    setUploadError(null);
    
    try {
      // Use the uploadAvatar action from Redux
      await dispatch(uploadAvatar(file)).unwrap();
      setUploadStatus('succeeded');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('failed');
      setUploadError(error.message || 'Failed to upload avatar');
      
      // Restore original image
      setCurrentImageSrc(originalImageRef.current || DEFAULT_AVATAR_IMAGE);
      forceRerender();
    }
  };

  const handleImageError = () => {
    console.log('Image error in useAvatarUpload hook');
    setImgError(true);
    setCurrentImageSrc(DEFAULT_AVATAR_IMAGE);
    
    if (imageElementRef.current) {
      imageElementRef.current.src = DEFAULT_AVATAR_IMAGE;
    }
  };

  return {
    isUploading,
    uploadProgress,
    imgError,
    currentImageSrc,
    imageVersion,
    imageElementRef,
    handleFileChange,
    handleImageError
  };
}; 