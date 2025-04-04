import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../../redux/features/profileSlice";
import { updateProfileThumbnail } from "../../api/updateThumbnailApi";
import { toast } from "react-toastify";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import {
  ProfileHeaderBackground,
  ProfileCover,
  ProfileCoverImage,
  CoverOverlay,
  UpdateCoverButton,
  UploadInput
} from './styles';

function ProfileThumbnail({ userId }) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.data);
  const currentUser = useSelector((state) => state.user.user);
  const isOwnProfile = currentUser && userId && currentUser._id === userId;
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  
  // Debug log khi component render
  useEffect(() => {
    console.log("ProfileThumbnail - userId:", userId);
    console.log("ProfileThumbnail - profile state:", profile);
    console.log("ProfileThumbnail - isOwnProfile:", isOwnProfile);
    
    // Xác định thumbnail từ các cấu trúc dữ liệu có thể có
    const findThumbnail = () => {
      // Kiểm tra các khả năng cấu trúc dữ liệu khác nhau
      if (profile?.data?.thumbnail) return profile.data.thumbnail;
      if (profile?.data?.thumbnailL) return profile.data.thumbnailL;
      if (profile?.thumbnail) return profile.thumbnail;
      if (profile?.thumbnailL) return profile.thumbnailL;
      if (profile?.data?.data?.thumbnail) return profile.data.data.thumbnail;
      
      // Nếu không tìm thấy, dùng ảnh mặc định
      return "https://artmin96.github.io/argon-social/assets/images/users/cover/cover-1.gif";
    };
    
    const url = findThumbnail();
    console.log("ProfileThumbnail - selected thumbnail URL:", url);
    setThumbnailUrl(url);
  }, [profile, userId, isOwnProfile]);
  
  // Load profile data nếu chưa có
  useEffect(() => {
    if (userId && (!profile || !Object.keys(profile).length)) {
      console.log("ProfileThumbnail - Fetching profile data for userId:", userId);
      dispatch(fetchProfile(userId));
    }
  }, [userId, profile, dispatch]);
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Progress callback function
      const progressCallback = (progress) => {
        setUploadProgress(progress);
      };
      
      const result = await updateProfileThumbnail(file, progressCallback);

      if (result.success) {
        dispatch(fetchProfile(userId)); // Gọi lại API để cập nhật Redux
        toast.success("Cover photo updated successfully!");
      }
    } catch (error) {
      toast.error("Error updating cover photo: " + (error.message || "Unknown error"));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <ProfileHeaderBackground>
      <ProfileCover>
        <ProfileCoverImage
          src={thumbnailUrl}
          alt="Profile Cover"
          onError={(e) => {
            console.log("ProfileThumbnail - Image failed to load:", e.target.src);
            e.target.onerror = null; // Avoid infinite loop
            e.target.src = "https://artmin96.github.io/argon-social/assets/images/users/cover/cover-1.gif";
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
                {isUploading ? `Uploading... ${uploadProgress}%` : "Update Cover Photo"}
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
