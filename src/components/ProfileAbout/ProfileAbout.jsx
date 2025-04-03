import React from 'react';
import { 
  Typography, 
  Grid, 
  List,
  ListItemText,
  Box
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import {
  SectionContainer,
  SectionTitle,
  StyledListItem,
  StyledListItemIcon,
  EmptyMessage
} from './styles';

const ProfileAbout = ({ profile }) => {
  if (!profile) {
    return (
      <EmptyMessage>
        Không có thông tin người dùng
      </EmptyMessage>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      default: return 'Không xác định';
    }
  };

  const joinedDate = formatDate(profile.createdAt);

  const renderInfoSection = () => (
    <SectionContainer elevation={0}>
      <SectionTitle>Thông tin cơ bản</SectionTitle>
      <List>
        {profile.email && (
          <StyledListItem>
            <StyledListItemIcon>
              <EmailIcon />
            </StyledListItemIcon>
            <ListItemText 
              primary="Email" 
              secondary={profile.email} 
            />
          </StyledListItem>
        )}
        
        {profile.gender && (
          <StyledListItem>
            <StyledListItemIcon>
              <WcIcon />
            </StyledListItemIcon>
            <ListItemText 
              primary="Giới tính" 
              secondary={getGenderText(profile.gender)} 
            />
          </StyledListItem>
        )}
        
        {profile.birthday && (
          <StyledListItem>
            <StyledListItemIcon>
              <CakeIcon />
            </StyledListItemIcon>
            <ListItemText 
              primary="Ngày sinh" 
              secondary={formatDate(profile.birthday)} 
            />
          </StyledListItem>
        )}
        
        {profile.location && (
          <StyledListItem>
            <StyledListItemIcon>
              <LocationOnIcon />
            </StyledListItemIcon>
            <ListItemText 
              primary="Đang sống tại" 
              secondary={profile.location} 
            />
          </StyledListItem>
        )}
        
        {joinedDate && (
          <StyledListItem>
            <StyledListItemIcon>
              <AccessTimeIcon />
            </StyledListItemIcon>
            <ListItemText 
              primary="Tham gia từ" 
              secondary={joinedDate} 
            />
          </StyledListItem>
        )}
      </List>
    </SectionContainer>
  );

  const renderBioSection = () => (
    profile.bio ? (
      <SectionContainer elevation={0}>
        <SectionTitle>Giới thiệu</SectionTitle>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
          {profile.bio}
        </Typography>
      </SectionContainer>
    ) : null
  );

  // Sections được thiết kế để có thể mở rộng thêm các trường thông tin khác trong tương lai
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {renderBioSection()}
        {renderInfoSection()}
      </Grid>
    </Grid>
  );
};

export default ProfileAbout; 