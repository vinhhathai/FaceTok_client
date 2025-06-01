import React from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Components
import { ProfileAvatar, ProfileName } from "./sub_components";
import { ProfileContainer } from "./ProfileHeader.styles";

// Hooks
import useAvatarUpload from "./hooks/useAvatarUpload";

const ProfileHeader = ({ user, onEditName }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    avatarSrc,
    isUploading,
    uploadProgress,
    handleAvatarChange
  } = useAvatarUpload(user);
  
  const isOwner = user?.isOwner || false;
  
  return (
    <ProfileContainer>
      <ProfileAvatar
        avatarSrc={avatarSrc}
        userName={user.fullName}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        handleAvatarChange={handleAvatarChange}
        isOwner={isOwner}
      />
      
      <ProfileName
        fullName={user.fullName}
        isOwner={isOwner}
        onEditName={onEditName}
      />
    </ProfileContainer>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    profilePicture: PropTypes.string,
    isOwner: PropTypes.bool,
  }),
  onEditName: PropTypes.func.isRequired
};

export default ProfileHeader; 