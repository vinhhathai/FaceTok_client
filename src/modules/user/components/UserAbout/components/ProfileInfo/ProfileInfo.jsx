import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Switch, FormControlLabel, Typography, Alert, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LanguageIcon from '@mui/icons-material/Language';
import InterestsIcon from '@mui/icons-material/Interests';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import userApi from '../../../../api/userApi';

import {
  InfoSection,
  InfoItem,
  InfoIcon,
  InfoContent,
  InfoLabel,
  InfoValue
} from './ProfileInfo.styles';

// Format gender
const formatGender = (gender) => {
  if (!gender) return null;
  return gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Khác';
};

// Format relationship status
const formatRelationship = (relationship) => {
  switch(relationship) {
    case 'single': return 'Độc thân';
    case 'relationship': return 'Đang trong mối quan hệ';
    case 'married': return 'Đã kết hôn';
    default: return 'Chưa cập nhật';
  }
};

const ProfileInfo = ({ user, isOwner, onPrivacyUpdate }) => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(user?.showPersonalInfo !== false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Format dates if available
  const formattedBirthday = user?.birthday 
    ? new Date(user.birthday).toLocaleDateString('vi-VN')
    : null;

  const handlePrivacyToggle = async (event) => {
    const newValue = event.target.checked;
    setIsUpdating(true);
    setError(null);

    try {
      const response = await userApi.updatePrivacySetting(newValue);
      if (response.success) {
        setShowPersonalInfo(newValue);
        // Notify parent component to refresh user data
        if (onPrivacyUpdate) {
          onPrivacyUpdate(newValue);
        }
      }
    } catch (err) {
      console.error('Failed to update privacy setting:', err);
      setError('Không thể cập nhật cài đặt riêng tư. Vui lòng thử lại.');
      // Revert toggle on error
      setShowPersonalInfo(!newValue);
    } finally {
      setIsUpdating(false);
    }
  };

  // Determine if info should be displayed
  const displayPersonalInfo = isOwner || showPersonalInfo;

  return (
    <InfoSection>
      {/* Privacy Toggle - Only show for profile owner */}
      {isOwner && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.default', borderRadius: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showPersonalInfo}
                onChange={handlePrivacyToggle}
                disabled={isUpdating}
                icon={<VisibilityOffIcon />}
                checkedIcon={<VisibilityIcon />}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" fontWeight="medium">
                  {showPersonalInfo ? 'Thông tin cá nhân đang hiển thị' : 'Thông tin cá nhân đang ẩn'}
                </Typography>
                {isUpdating && <CircularProgress size={20} />}
              </Box>
            }
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', ml: 5 }}>
            {showPersonalInfo 
              ? 'Mọi người có thể xem email, giới tính, sinh nhật, địa chỉ và tình trạng mối quan hệ của bạn'
              : 'Thông tin cá nhân của bạn sẽ bị ẩn khỏi người khác'
            }
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {displayPersonalInfo && user?.location && (
            <InfoItem>
              <InfoIcon>
                <LocationOnIcon color="primary" />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Đang sống tại</InfoLabel>
                <InfoValue>{user.location}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}

          {user?.work && (
            <InfoItem>
              <InfoIcon>
                <WorkIcon color="primary" />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Làm việc tại</InfoLabel>
                <InfoValue>{user.work}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}

          {user?.education && (
            <InfoItem>
              <InfoIcon>
                <SchoolIcon color="primary" />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Học tại</InfoLabel>
                <InfoValue>{user.education}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}

          {displayPersonalInfo && user?.email && (
            <InfoItem>
              <InfoIcon>
                <EmailIcon color="primary" />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{user.email}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}
          
          {displayPersonalInfo && formatGender(user?.gender) && (
            <InfoItem>
              <InfoIcon>
                <PersonIcon color="primary" />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Giới tính</InfoLabel>
                <InfoValue>{formatGender(user.gender)}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {displayPersonalInfo && formattedBirthday && (
            <InfoItem>
              <InfoIcon>
                <CalendarMonthIcon color="primary" />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Sinh nhật</InfoLabel>
                <InfoValue>{formattedBirthday}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}

          {/* Removed "Tham gia ngày" as requested */}

          {displayPersonalInfo && (
            <InfoItem>
              <InfoIcon>
                <FavoriteIcon color="error" />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Tình trạng mối quan hệ</InfoLabel>
                <InfoValue>
                  {formatRelationship(user?.relationship)}
                </InfoValue>
              </InfoContent>
            </InfoItem>
          )}

          {user?.website && (
            <InfoItem>
              <InfoIcon>
                <LanguageIcon color="primary" />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Website</InfoLabel>
                <InfoValue>{user.website}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}

          {user?.interests && (
            <InfoItem>
              <InfoIcon>
                <InterestsIcon color="primary" />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Sở thích</InfoLabel>
                <InfoValue>{user.interests}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}
        </Grid>
      </Grid>
    </InfoSection>
  );
};

ProfileInfo.propTypes = {
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
    showPersonalInfo: PropTypes.bool,
  }),
  isOwner: PropTypes.bool,
  onPrivacyUpdate: PropTypes.func,
};

export default ProfileInfo; 