import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../../redux/features/profileSlice";
import { updateProfileThumbnail } from "../../api/updateThumbnailApi";
import { toast } from "react-toastify";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';

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
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await updateProfileThumbnail(file);

      if (result.success) {
        dispatch(fetchProfile(userId)); // Gọi lại API để cập nhật Redux
        toast.success("Cover photo updated successfully!");
      }
    } catch (error) {
      toast.error("Error updating cover photo: " + (error.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ProfileHeaderBackground>
      <ProfileCover>
        <ProfileCoverImage
          src={
            profile?.data?.thumbnailL ||
            "https://artmin96.github.io/argon-social/assets/images/users/cover/cover-1.gif"
          }
          alt="Profile Cover"
        />
        <CoverOverlay className="cover-overlay">
          <label htmlFor="upload-cover-photo">
            <UpdateCoverButton
              variant="contained"
              component="span"
              disabled={isUploading}
              startIcon={isUploading ? <CircularProgress size={16} color="inherit" /> : <CameraAltIcon />}
            >
              {isUploading ? "Uploading..." : "Update Cover Photo"}
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
      </ProfileCover>
    </ProfileHeaderBackground>
  );
}

export default ProfileThumbnail;
