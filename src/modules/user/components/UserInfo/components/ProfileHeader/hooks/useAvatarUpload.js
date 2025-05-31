import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { uploadAvatar, selectUploadStatus, resetUploadStatus } from '../../../../../redux/slices/userSlice';
import { showSuccess, showError } from '../../../../../../../shared/utils/toastMessageUtils';

// Các hằng số
const DEFAULT_AVATAR = "/assets/images/avatar_default.jpg";
const AVATAR_UPDATE_TOAST_ID = 'avatar-update-toast';

const useAvatarUpload = (user) => {
  const dispatch = useDispatch();
  const uploadStatus = useSelector(selectUploadStatus);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarSrc, setAvatarSrc] = useState(user?.profilePicture || DEFAULT_AVATAR);
  const [optimisticAvatar, setOptimisticAvatar] = useState(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  
  const originalAvatarRef = useRef(null);
  const processedUploadRef = useRef(false);
  
  // Update avatar URL when user changes
  useEffect(() => {
    if (user?.profilePicture) {
      setAvatarSrc(user.profilePicture);
    } else {
      setAvatarSrc(DEFAULT_AVATAR);
    }
    
    // Clean up optimistic image when user changes
    if (optimisticAvatar) {
      URL.revokeObjectURL(optimisticAvatar);
      setOptimisticAvatar(null);
    }
    
    originalAvatarRef.current = user?.profilePicture || null;
  }, [user?.id, user?.profilePicture]);
  
  // Monitor upload status
  useEffect(() => {
    if (uploadStatus === 'succeeded' && !processedUploadRef.current) {
      // Mark this upload as processed
      processedUploadRef.current = true;
      
      // Show success notification
      if (!hasShownSuccessToast) {
        // Dismiss all existing toasts first to prevent duplicates
        toast.dismiss();
        
        showSuccess("Ảnh đại diện đã được cập nhật thành công!", {
          toastId: AVATAR_UPDATE_TOAST_ID,
          autoClose: 2000,
          pauseOnFocusLoss: false,
          closeOnClick: false
        });
        setHasShownSuccessToast(true);
      }
      
      setIsUploading(false);
      setUploadProgress(0);
      
      // Clean up the optimistic image
      if (optimisticAvatar) {
        URL.revokeObjectURL(optimisticAvatar);
        setOptimisticAvatar(null);
      }
      
      // Reset upload status
      setTimeout(() => {
        dispatch(resetUploadStatus());
        
        setTimeout(() => {
          setHasShownSuccessToast(false);
          processedUploadRef.current = false;
        }, 3000);
      }, 100);
    } else if (uploadStatus === 'failed') {
      if (!hasShownSuccessToast) {
        // Dismiss all existing toasts first
        toast.dismiss();
        
        showError("Lỗi khi cập nhật ảnh đại diện!", {
          toastId: AVATAR_UPDATE_TOAST_ID
        });
      }
      
      setIsUploading(false);
      setUploadProgress(0);
      processedUploadRef.current = false;
      
      // Clean up and roll back to original avatar
      if (optimisticAvatar) {
        URL.revokeObjectURL(optimisticAvatar);
        setOptimisticAvatar(null);
      }
      
      // Restore original avatar
      setAvatarSrc(originalAvatarRef.current || DEFAULT_AVATAR);
      
      // Reset upload status on failure
      setTimeout(() => {
        dispatch(resetUploadStatus());
        setHasShownSuccessToast(false);
      }, 100);
    }
  }, [uploadStatus, dispatch, optimisticAvatar, hasShownSuccessToast]);
  
  // Clean up URL objects when component unmounts
  useEffect(() => {
    return () => {
      if (optimisticAvatar) {
        URL.revokeObjectURL(optimisticAvatar);
      }
    };
  }, [optimisticAvatar]);
  
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset toast tracking for new upload
    setHasShownSuccessToast(false);
    
    // Clean up previous optimistic image if exists
    if (optimisticAvatar) {
      URL.revokeObjectURL(optimisticAvatar);
    }
    
    // Save original avatar URL for rollback
    originalAvatarRef.current = avatarSrc;
    
    // Create an optimistic local image URL
    const localImageUrl = URL.createObjectURL(file);
    setOptimisticAvatar(localImageUrl);
    setAvatarSrc(localImageUrl);
    
    // Reset the processed flag when starting a new upload
    processedUploadRef.current = false;
    setIsUploading(true);
    
    // Use the uploadAvatar action from Redux
    dispatch(uploadAvatar({
      file,
      onProgress: (progress) => {
        setUploadProgress(progress);
      }
    }));
  };
  
  return {
    avatarSrc,
    isUploading,
    uploadProgress,
    handleAvatarChange
  };
};

export default useAvatarUpload; 