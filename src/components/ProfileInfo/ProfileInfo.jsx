import React from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import WcIcon from '@mui/icons-material/Wc';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import {
  ProfileInfoContainer,
  ProfileImageWrapper,
  ProfileImage,
  ProfileImageCaption,
  ProfileFullName,
  ButtonsContainer,
  AddFriendButton,
  MessageButton,
  MoreButton,
  IntroContainer,
  IntroHeader,
  IntroTitle,
  IntroItem,
  IntroItemText,
  EditButton,
  OnlineStatus,
  UploadInput
} from './styles';

function ProfileInfo({ profile, loading, error }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: 200 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="body1">
        Error: {error}
      </Typography>
    );
  }

  return (
    <Grid item xs={12} md={3}>
      <ProfileInfoContainer elevation={2}>
        <Grid container direction="column" alignItems="center">
          {/* Profile Image */}
          <ProfileImageWrapper>
            <ProfileImage
              src={profile?.profilePicture || "/assets/images/avatar_default.jpg"}
              alt={profile?.fullName || "User"}
            />
            <ProfileImageCaption className="image-caption">
              <label htmlFor="upload-profile-picture" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <CameraAltIcon fontSize="small" sx={{ mr: 0.5 }} /> Update
              </label>
              <UploadInput
                id="upload-profile-picture"
                type="file"
                accept="image/*"
              />
            </ProfileImageCaption>
          </ProfileImageWrapper>

          {/* Profile Name */}
          <ProfileFullName variant="h6">
            {profile?.fullName}
          </ProfileFullName>

          {/* Action Buttons */}
          <ButtonsContainer>
            <AddFriendButton 
              variant="contained" 
              startIcon={<AddIcon />}
            >
              Add friend
            </AddFriendButton>
            
            <MessageButton 
              variant="contained" 
              startIcon={<ChatIcon />}
            >
              Message
            </MessageButton>
            
            <MoreButton
              aria-controls={open ? 'profile-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              variant="contained"
            >
              <MoreHorizIcon />
            </MoreButton>
            
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'more-button',
              }}
            >
              <MenuItem onClick={handleClose}>Timeline</MenuItem>
              <MenuItem onClick={handleClose}>About</MenuItem>
              <MenuItem onClick={handleClose}>Followers</MenuItem>
              <MenuItem onClick={handleClose}>Following</MenuItem>
              <MenuItem onClick={handleClose}>Photos</MenuItem>
              <MenuItem onClick={handleClose}>Videos</MenuItem>
              <MenuItem onClick={handleClose}>Check-Ins</MenuItem>
              <MenuItem onClick={handleClose}>Events</MenuItem>
              <MenuItem onClick={handleClose}>Likes</MenuItem>
            </Menu>
          </ButtonsContainer>

          {/* Intro Section */}
          <IntroContainer>
            <IntroHeader>
              <IntroTitle variant="subtitle1">Intro</IntroTitle>
            </IntroHeader>
            
            {profile?.gender && (
              <IntroItem>
                <WcIcon color="primary" fontSize="small" />
                <IntroItemText variant="body2">
                  Gender{' '}
                  <Link href="#" underline="hover">
                    {profile.gender}
                  </Link>
                </IntroItemText>
              </IntroItem>
            )}
            
            {profile?.birthday && (
              <IntroItem>
                <CakeIcon color="primary" fontSize="small" />
                <IntroItemText variant="body2">
                  Birthday{' '}
                  <Link href="#" underline="hover">
                    {profile.birthday}
                  </Link>
                </IntroItemText>
              </IntroItem>
            )}
            
            {profile?.location && (
              <IntroItem>
                <LocationOnIcon color="primary" fontSize="small" />
                <IntroItemText variant="body2">
                  Live in{' '}
                  <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                    {profile.location}
                    <OnlineStatus />
                  </Link>
                </IntroItemText>
              </IntroItem>
            )}
            
            <EditButton variant="outlined">
              Edit Details
            </EditButton>
          </IntroContainer>
        </Grid>
      </ProfileInfoContainer>
    </Grid>
  );
}

export default ProfileInfo;
