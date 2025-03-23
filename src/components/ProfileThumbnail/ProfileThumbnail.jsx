import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile } from "../../redux/features/profileSlice";
import { updateProfileThumbnail } from "../../api/updateThumbnailApi";
import "./ProfileThumbnail.css";
import { toast } from "react-toastify";

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
      toast.error("Error updating cover photo:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-header-background">
      <div className="profile-cover">
        <img
          src={
            profile?.data?.thumbnailL ||
            "https://artmin96.github.io/argon-social/assets/images/users/cover/cover-1.gif"
          }
          alt="Profile Header Background"
        />
        <div className="cover-overlay">
          <label className="btn btn-update-cover">
            <i className="bx bxs-camera"></i>
            {isUploading ? "Uploading..." : "Update Cover Photo"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default ProfileThumbnail;
