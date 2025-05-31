import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LanguageIcon from "@mui/icons-material/Language";
import InterestsIcon from "@mui/icons-material/Interests";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";

// Import styled components
import {
  AboutContainer,
  AboutPaper,
  AboutTitle,
  AboutBio,
  InfoSection,
  InfoItem,
  InfoIcon,
  InfoContent,
  InfoLabel,
  InfoValue
} from "./UserAbout.styles";

const UserAbout = ({ user }) => {
  // Debug user data
  console.log('User data in UserAbout:', user);
  console.log('Relationship status:', user?.relationship);

  // Format dates if available
  const formattedBirthday = user?.birthday 
    ? new Date(user.birthday).toLocaleDateString('vi-VN')
    : null;

  const formattedCreatedAt = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('vi-VN')
    : null;

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

  return (
    <AboutContainer>
      <AboutPaper elevation={1}>
        <AboutTitle variant="h6">
          Giới thiệu
        </AboutTitle>

        {user?.bio ? (
          <AboutBio variant="body1">
            {user.bio}
          </AboutBio>
        ) : (
          <AboutBio variant="body1">
            Người dùng chưa cập nhật thông tin giới thiệu.
          </AboutBio>
        )}

        <InfoSection>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {user?.location && (
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

              {user?.email && (
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
              
              {formatGender(user?.gender) && (
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
              {formattedBirthday && (
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

              {formattedCreatedAt && (
                <InfoItem>
                  <InfoIcon>
                    <EventIcon color="primary" />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Tham gia ngày</InfoLabel>
                    <InfoValue>{formattedCreatedAt}</InfoValue>
                  </InfoContent>
                </InfoItem>
              )}

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
      </AboutPaper>
    </AboutContainer>
  );
};

UserAbout.propTypes = {
  user: PropTypes.shape({
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
  }),
};

export default UserAbout;
