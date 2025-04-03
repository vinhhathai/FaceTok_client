import React, { useState } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import updateAvatarApi from '../../api/updateAvatarApi';
import { DEFAULT_AVATAR, MAX_AVATAR_SIZE, SUPPORTED_IMAGE_TYPES } from '../../config/config';
import EditProfileForm from '../EditProfileForm/EditProfileForm';
import FullNameEditDialog from '../FullNameEditDialog/FullNameEditDialog';

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

function ProfileInfo({ profile, loading, error, refreshProfile }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(profile?.profilePicture || DEFAULT_AVATAR);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [nameEditDialogOpen, setNameEditDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  // Hàm trả về màu dựa vào % tiến trình
  const getProgressColor = (progress) => {
    if (progress < 30) return '#64B5F6'; // Xanh nhạt
    if (progress < 70) return '#2196F3'; // Xanh
    if (progress < 100) return '#1976D2'; // Xanh đậm
    return '#FF9800'; // Cam khi 100%
  };

  // Hàm trả về text trạng thái dựa vào % tiến trình
  const getProgressText = (progress) => {
    if (progress < 30) return 'Bắt đầu tải lên...';
    if (progress < 70) return 'Đang tải lên...';
    if (progress < 100) return 'Sắp hoàn thành...';
    return 'Đang xử lý...';
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Only JPEG and PNG images are allowed');
      return;
    }

    // Validate file size
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error(`File size must be less than ${MAX_AVATAR_SIZE / (1024 * 1024)}MB`);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Create a temporary preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
      
      // Upload to Firebase directly and update server
      // Progress callback to update progress state
      const progressCallback = (progress) => {
        setUploadProgress(progress);
      };
      
      const response = await updateAvatarApi(file, progressCallback);
      
      // Update with the URL from Firebase
      setAvatarUrl(response.avatarUrl);
      
      toast.success('Avatar updated successfully');
      
      // Refresh profile data to get updated info from server
      if (refreshProfile) {
        setTimeout(() => {
          refreshProfile();
        }, 500);
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      // Reset to original avatar if upload fails
      setAvatarUrl(profile?.profilePicture || DEFAULT_AVATAR);
      toast.error(error.message || 'Failed to update avatar');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Function to open edit dialog
  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  // Function to close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  // Function to open name edit dialog
  const handleOpenNameEditDialog = () => {
    setNameEditDialogOpen(true);
  };

  // Function to close name edit dialog
  const handleCloseNameEditDialog = () => {
    setNameEditDialogOpen(false);
  };

  // Update avatar URL when profile changes
  React.useEffect(() => {
    if (profile?.profilePicture) {
      setAvatarUrl(profile.profilePicture);
    }
  }, [profile]);

  if (loading) {
    return (
      <ProfileInfoContainer elevation={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </ProfileInfoContainer>
    );
  }

  if (error) {
    return (
      <ProfileInfoContainer elevation={1}>
        <Typography color="error" variant="body2" sx={{ p: 2 }}>
          Error loading profile: {error}
        </Typography>
      </ProfileInfoContainer>
    );
  }

  return (
    <ProfileInfoContainer elevation={1}>
      <Grid container direction="column" alignItems="center">
        {/* Profile Image */}
        <ProfileImageWrapper>
          <ProfileImage
            src={avatarUrl}
            alt={profile?.fullName || "User"}
            sx={{
              ...(uploading && { 
                filter: 'blur(2px)',
                transition: 'filter 0.3s ease-in-out' 
              })
            }}
            className={uploading ? 'uploading-avatar' : ''}
          />
          
          {uploading && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                zIndex: 2,
                animation: 'fadeIn 0.3s',
              }}
            >
              <CircularProgress 
                size={50} 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ 
                  color: getProgressColor(uploadProgress),
                  transition: 'color 0.3s ease-in-out' 
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1, 
                  color: '#fff',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '80%',
                  fontSize: '0.75rem'
                }}
              >
                {getProgressText(uploadProgress)}
                <br />
                {uploadProgress}%
              </Typography>
            </div>
          )}
          
          <ProfileImageCaption 
            className="image-caption"
            sx={uploading ? { opacity: 0.5, pointerEvents: 'none' } : {}}
          >
            <label htmlFor="upload-profile-picture" style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
              <CameraAltIcon fontSize="small" sx={{ mr: 0.5 }} /> Update
            </label>
            <UploadInput
              id="upload-profile-picture"
              type="file"
              accept={SUPPORTED_IMAGE_TYPES.join(',')}
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </ProfileImageCaption>
        </ProfileImageWrapper>

        {/* Profile Name with Edit Button */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mt: 1,
          mb: 1
        }}>
          <ProfileFullName variant="h6">
            {profile?.fullName || 'User Name'}
          </ProfileFullName>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={handleOpenNameEditDialog}
            sx={{ ml: 1 }}
          >
            <DriveFileRenameOutlineIcon fontSize="small" />
          </IconButton>
        </Box>

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
            <MenuItem onClick={handleClose}>Block</MenuItem>
            <MenuItem onClick={handleClose}>Report</MenuItem>
          </Menu>
        </ButtonsContainer>

        {/* Intro Section */}
        <IntroContainer>
          <IntroHeader>
            <EditButton 
              color="primary" 
              onClick={handleOpenEditDialog}
              startIcon={<EditIcon />}
            >
              Chỉnh sửa
            </EditButton>
          </IntroHeader>
          
          {profile?.bio ? (
            <IntroItem>
              <IntroItemText variant="body2">
                {profile.bio}
              </IntroItemText>
            </IntroItem>
          ) : null}
          
          {profile?.gender ? (
            <IntroItem>
              <WcIcon color="action" fontSize="small" />
              <IntroItemText variant="body2">
                {profile.gender === 'male' ? 'Nam' : 
                 profile.gender === 'female' ? 'Nữ' : 
                 'Không xác định'}
              </IntroItemText>
            </IntroItem>
          ) : null }
          
          {profile?.birthday ? (
            <IntroItem>
              <CakeIcon color="action" fontSize="small" />
              <IntroItemText variant="body2">
                Born {profile.birthday}
              </IntroItemText>
            </IntroItem>
          ) : null }
          
          {profile?.location ? (
            <IntroItem>
              <LocationOnIcon color="action" fontSize="small" />
              <IntroItemText variant="body2">
                Lives in {profile.location}
              </IntroItemText>
            </IntroItem>
          ) : null }
        </IntroContainer>
      </Grid>
      
      {/* Edit Profile Dialog */}
      <EditProfileForm 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog} 
        profile={profile} 
        refreshProfile={refreshProfile}
      />

      {/* Name Edit Dialog */}
      <FullNameEditDialog
        open={nameEditDialogOpen}
        onClose={handleCloseNameEditDialog}
        currentName={profile?.fullName}
        refreshProfile={refreshProfile}
      />
    </ProfileInfoContainer>
  );
}

export default ProfileInfo;
