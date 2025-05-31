import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Components
import CoverPhoto from './components/CoverPhoto';

// Styles
import { ProfileHeaderBackground } from './ProfileThumbnail.styles';

// Hooks
import { useThumbnailUpload } from './hooks';

function ProfileThumbnail({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Check if user is the owner (can edit)
  const isOwner = user?.isOwner || false;

  // Debug info
  React.useEffect(() => {
    console.log('Is mobile in ProfileThumbnail:', isMobile);
    console.log('Is owner in ProfileThumbnail:', isOwner);
  }, [isMobile, isOwner]);

  const {
    isUploading,
    uploadProgress,
    currentImageSrc,
    imageVersion,
    imageElementRef,
    handleFileChange,
    handleImageError
  } = useThumbnailUpload(user);

  if (!user) {
    return <ProfileHeaderBackground />;
  }

  return (
    <ProfileHeaderBackground>
      <CoverPhoto
        imageRef={imageElementRef}
        currentImageSrc={currentImageSrc}
        imageVersion={imageVersion}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onImageError={handleImageError}
        isOwner={isOwner}
        isMobile={isMobile}
        onFileChange={handleFileChange}
      />
    </ProfileHeaderBackground>
  );
}

ProfileThumbnail.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    thumbnail: PropTypes.string,
    isOwner: PropTypes.bool,
  }),
};

export default ProfileThumbnail; 