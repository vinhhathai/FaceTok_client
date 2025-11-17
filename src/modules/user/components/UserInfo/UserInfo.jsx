import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Box } from "@mui/material";
import { useDispatch } from "react-redux";

// Components
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import UserAbout from "./components/UserAbout/UserAbout";
import UserActions from "./components/UserActions/UserActions";
import { NameEditModal, ProfileEditModal } from "./components/Modals";

// Styles
import { ProfileInfoContainer } from "./UserInfo.styles";

// Redux
import { fetchUserProfile } from '@user/redux/slices/userSlice';

// Local storage keys
const NAME_MODAL_STORAGE_KEY = 'name_modal_open';
const PROFILE_MODAL_STORAGE_KEY = 'profile_modal_open';

const UserInfo = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  
  // Modals state - initialize from localStorage to persist across page reloads
  const [nameModalOpen, setNameModalOpen] = useState(() => {
    const savedState = localStorage.getItem(NAME_MODAL_STORAGE_KEY);
    return savedState === 'true';
  });
  
  const [profileModalOpen, setProfileModalOpen] = useState(() => {
    const savedState = localStorage.getItem(PROFILE_MODAL_STORAGE_KEY);
    return savedState === 'true';
  });
  
  // Save modal state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(NAME_MODAL_STORAGE_KEY, nameModalOpen);
  }, [nameModalOpen]);
  
  useEffect(() => {
    localStorage.setItem(PROFILE_MODAL_STORAGE_KEY, profileModalOpen);
  }, [profileModalOpen]);
  
  // Create a local state for relationship to show after update
  const [updatedRelationship, setUpdatedRelationship] = useState(null);
  
  // Use latest available relationship value
  const displayRelationship = updatedRelationship || user?.relationship;

  // Update local state when user data changes
  React.useEffect(() => {
    if (user?.relationship) {
      setUpdatedRelationship(user.relationship);
    }
  }, [user]);
  
  // Debug user data when it changes
  React.useEffect(() => {
    if (user) {
      console.log('User data changed:', user);
      console.log('Relationship status from server:', user.relationship);
    }
  }, [user]);

  const handleOpenNameModal = () => {
    setNameModalOpen(true);
  };

  const handleCloseNameModal = () => {
    setNameModalOpen(false);
  };

  const handleOpenProfileModal = () => {
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  const handleProfileUpdate = (updatedData) => {
    console.log("Received updated profile data:", updatedData);
    
    // Update local state with new relationship value if provided
    if (updatedData.relationship !== undefined) {
      console.log("Setting new relationship value:", updatedData.relationship);
      setUpdatedRelationship(updatedData.relationship);
    }
    
    // Refresh user profile data from server
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ProfileInfoContainer>
      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...(isMobile && {
          padding: theme.spacing(2, 1),
        })
      }}>
        <ProfileHeader user={user} onEditName={handleOpenNameModal} />
        
        <UserAbout 
          user={user} 
          displayRelationship={displayRelationship} 
          onEditProfile={handleOpenProfileModal}
        />
        
        <UserActions 
          user={user} 
          onEditProfile={handleOpenProfileModal} 
        />
      </Box>
      
      {/* Modals */}
      <NameEditModal 
        open={nameModalOpen}
        currentName={user?.fullName}
        onClose={handleCloseNameModal} 
        user={user} 
      />
      
      <ProfileEditModal 
        isOpen={profileModalOpen} 
        onClose={handleCloseProfileModal} 
        user={user}
        onProfileUpdate={handleProfileUpdate} 
      />
    </ProfileInfoContainer>
  );
};

UserInfo.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    profilePicture: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    gender: PropTypes.string,
    birthday: PropTypes.string,
    relationship: PropTypes.string,
    createdAt: PropTypes.string,
    email: PropTypes.string,
    isOwner: PropTypes.bool,
  }),
};

export default UserInfo;
