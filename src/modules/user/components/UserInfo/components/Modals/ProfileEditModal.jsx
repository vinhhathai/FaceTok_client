import React from "react";
import PropTypes from "prop-types";
import { Modal } from "@mui/material";
import { ModalContainer } from './ProfileEditModal.styles';

// Components
import { FormActions, ProfileForm, ModalHeader } from './sub_components';

// Hooks
import useProfileForm from './hooks/useProfileForm';

// Import danh sách tỉnh thành Việt Nam
import vietnamProvinces from "../../../../../../shared/data/vietnamProvinces";

const ProfileEditModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
  const {
    profileForm,
    isUpdatingProfile,
    birthdayParts,
    handleProfileFormChange,
    handleBirthdayChange,
    handleUpdateProfile
  } = useProfileForm(user, isOpen, onClose, onProfileUpdate, vietnamProvinces);
  
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="edit-profile-modal"
      aria-describedby="modal-to-edit-user-profile"
    >
      <ModalContainer>
        <ModalHeader title="Chỉnh sửa thông tin" />
        
        <ProfileForm
          profileForm={profileForm}
          handleProfileFormChange={handleProfileFormChange}
          birthdayParts={birthdayParts}
          handleBirthdayChange={handleBirthdayChange}
        />
        
        <FormActions
          onClose={onClose}
          onSave={handleUpdateProfile}
          isUpdating={isUpdatingProfile}
        />
      </ModalContainer>
    </Modal>
  );
};

ProfileEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProfileUpdate: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    gender: PropTypes.string,
    birthday: PropTypes.string,
    relationship: PropTypes.string,
  }),
};

export default ProfileEditModal; 