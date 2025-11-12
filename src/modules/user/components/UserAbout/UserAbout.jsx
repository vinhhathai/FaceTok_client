import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Fab,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { updateUserProfile, fetchUserProfile } from "../../redux/slices/userSlice";
import { showSuccess, showError } from "../../../../shared/utils/toastMessageUtils";

// Import components
import AboutHeader from "./components/AboutHeader";
import ProfileInfo from "./components/ProfileInfo";
import EditProfileModal from "./components/EditProfileModal";

// Import styled components
import {
  AboutContainer,
  AboutPaper,
} from "./UserAbout.styles";

// Format date string to YYYY-MM-DD for input type="date"
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

const UserAbout = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const isOwner = user?.isOwner || false;

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: '',
    location: '',
    gender: '',
    birthday: null,
    relationship: '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Debug user data
  console.log('User data in UserAbout:', user);

  // Hàm xử lý khi click vào nút chỉnh sửa
  const handleEditProfile = () => {
    // Mở modal chỉnh sửa thông tin
    handleOpenProfileModal();
  };

  const handleOpenProfileModal = () => {
    // Initialize form with current user data
    setProfileForm({
      bio: user.bio || '',
      location: user.location || '',
      gender: user.gender || '',
      birthday: user.birthday ? formatDateForInput(user.birthday) : '',
      relationship: user.relationship || '',
    });
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  const handleProfileFormChange = (field, value) => {
    setProfileForm({
      ...profileForm,
      [field]: value
    });
  };

  const handleDateChange = (event) => {
    setProfileForm({
      ...profileForm,
      birthday: event.target.value || null
    });
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      
      // Clone form data for API submission
      let formattedData = { ...profileForm };
      
      // Dispatch action to update user profile
      await dispatch(updateUserProfile({
        id: user.id,
        ...formattedData
      })).unwrap();
      
      showSuccess('Cập nhật thông tin thành công!');
      handleCloseProfileModal();
      
      // Refresh user profile after update
      if (user?.id) {
        dispatch(fetchUserProfile(user.id));
      }
    } catch (error) {
      showError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
      console.error('Profile update error:', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePrivacyUpdate = async (newValue) => {
    // Refresh user profile to get updated privacy setting
    if (user?.id) {
      try {
        await dispatch(fetchUserProfile(user.id)).unwrap();
        showSuccess(newValue ? 'Thông tin cá nhân đã được hiển thị' : 'Thông tin cá nhân đã được ẩn');
      } catch (error) {
        console.error('Failed to refresh profile:', error);
      }
    }
  };

  return (
    <AboutContainer>
      <AboutPaper elevation={1}>
        <AboutHeader bio={user?.bio} />
        <ProfileInfo 
          user={user} 
          isOwner={isOwner}
          onPrivacyUpdate={handlePrivacyUpdate}
        />

        {/* Mobile Edit Button - Only show for owner in mobile view */}
        {isOwner && isMobile && (
          <Tooltip title="Chỉnh sửa thông tin">
            <Fab
              color="primary"
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1000,
                boxShadow: 3,
              }}
              onClick={handleEditProfile}
            >
              <EditIcon />
            </Fab>
          </Tooltip>
        )}

        {/* Modal for editing profile */}
        <EditProfileModal
          open={profileModalOpen}
          onClose={handleCloseProfileModal}
          isMobile={isMobile}
          profileForm={profileForm}
          isUpdatingProfile={isUpdatingProfile}
          onFormChange={handleProfileFormChange}
          onDateChange={handleDateChange}
          onSave={handleUpdateProfile}
        />
      </AboutPaper>
    </AboutContainer>
  );
};

UserAbout.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    work: PropTypes.string,
    education: PropTypes.string,
    email: PropTypes.string,
    birthday: PropTypes.string,
    relationship: PropTypes.string,
    website: PropTypes.string,
    interests: PropTypes.string,
    gender: PropTypes.string,
    createdAt: PropTypes.string,
    isOwner: PropTypes.bool,
  }),
};

export default UserAbout;
