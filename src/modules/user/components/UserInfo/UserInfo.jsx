import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Stack,
  CircularProgress,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useMediaQuery,
  Fab,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import MessageIcon from "@mui/icons-material/Message";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { showSuccess, showError } from "../../../../shared/utils/toastMessageUtils";

// Import danh sách tỉnh thành Việt Nam
import vietnamProvinces from "../../../../shared/data/vietnamProvinces";

// Styles
import {
  ProfileInfoContainer,
  ProfileImage,
  ProfileFullName,
  IntroContainer,
  IntroHeader,
  IntroTitle,
  IntroItem,
  IntroItemText,
  ButtonsContainer,
  AddFriendButton,
  MessageButton,
  ProfileImageWrapper,
  ProfileImageOverlay,
  UploadInput,
} from "./UserInfo.styles";

// Redux
import { uploadAvatar, selectUploadStatus, resetUploadStatus, fetchUserProfile, updateUserProfile } from '../../redux/slices/userSlice';

// Default image
const DEFAULT_AVATAR = "/assets/images/avatar_default.jpg";

// Define constant toast ID to prevent duplicate toasts
const AVATAR_UPDATE_TOAST_ID = 'avatar-update-toast';

// Format date string to DD/MM/YYYY for input
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format input date (DD/MM/YYYY) to YYYY-MM-DD string for API
const formatDateForApi = (dateString) => {
  if (!dateString) return null;
  
  // Split the DD/MM/YYYY format into parts
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  
  // If date is already in YYYY-MM-DD format or not properly formatted
  return dateString;
};

const UserInfo = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [isFriend, setIsFriend] = useState(false); // Assume no friendship status from API for now
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false); // Thêm state để kiểm soát việc mở rộng bio
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uploadStatus = useSelector(selectUploadStatus);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarSrc, setAvatarSrc] = useState(user?.profilePicture || DEFAULT_AVATAR);
  const [optimisticAvatar, setOptimisticAvatar] = useState(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  
  const originalAvatarRef = useRef(null);
  const processedUploadRef = useRef(false);
  
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

  // Format relationship status
  const formatRelationship = (relationship) => {
    switch(relationship) {
      case 'single': return 'Độc thân';
      case 'relationship': return 'Đang trong mối quan hệ';
      case 'married': return 'Đã kết hôn';
      default: return 'Chưa cập nhật';
    }
  };

  // Update avatar URL when user changes
  React.useEffect(() => {
    if (user?.profilePicture) {
      setAvatarSrc(user.profilePicture);
    } else {
      setAvatarSrc(DEFAULT_AVATAR);
    }
    
    // Clean up optimistic image when user changes
    if (optimisticAvatar) {
      URL.revokeObjectURL(optimisticAvatar);
      setOptimisticAvatar(null);
    }
    
    originalAvatarRef.current = user?.profilePicture || null;
  }, [user?.id, user?.profilePicture]);
  
  // Monitor upload status
  React.useEffect(() => {
    if (uploadStatus === 'succeeded' && !processedUploadRef.current) {
      // Mark this upload as processed
      processedUploadRef.current = true;
      
      // Show success notification
      if (!hasShownSuccessToast) {
        // Dismiss all existing toasts first to prevent duplicates
        toast.dismiss();
        
        showSuccess("Ảnh đại diện đã được cập nhật thành công!", {
          toastId: AVATAR_UPDATE_TOAST_ID,
          autoClose: 2000,
          pauseOnFocusLoss: false,
          closeOnClick: false
        });
        setHasShownSuccessToast(true);
        
        // Delay the profile refresh
        setTimeout(() => {
          if (user?.id) {
            dispatch(fetchUserProfile(user.id));
          }
        }, 500);
      }
      
      setIsUploading(false);
      setUploadProgress(0);
      
      // Clean up the optimistic image
      if (optimisticAvatar) {
        URL.revokeObjectURL(optimisticAvatar);
        setOptimisticAvatar(null);
      }
      
      // Reset upload status
      setTimeout(() => {
        dispatch(resetUploadStatus());
        
        setTimeout(() => {
          setHasShownSuccessToast(false);
          processedUploadRef.current = false;
        }, 3000);
      }, 100);
    } else if (uploadStatus === 'failed') {
      if (!hasShownSuccessToast) {
        // Dismiss all existing toasts first
        toast.dismiss();
        
        showError("Lỗi khi cập nhật ảnh đại diện!", {
          toastId: AVATAR_UPDATE_TOAST_ID
        });
      }
      
      setIsUploading(false);
      setUploadProgress(0);
      processedUploadRef.current = false;
      
      // Clean up and roll back to original avatar
      if (optimisticAvatar) {
        URL.revokeObjectURL(optimisticAvatar);
        setOptimisticAvatar(null);
      }
      
      // Restore original avatar
      setAvatarSrc(originalAvatarRef.current || DEFAULT_AVATAR);
      
      // Reset upload status on failure
      setTimeout(() => {
        dispatch(resetUploadStatus());
        setHasShownSuccessToast(false);
      }, 100);
    }
  }, [uploadStatus, dispatch, optimisticAvatar, hasShownSuccessToast, user]);
  
  // Clean up URL objects when component unmounts
  React.useEffect(() => {
    return () => {
      if (optimisticAvatar) {
        URL.revokeObjectURL(optimisticAvatar);
      }
    };
  }, [optimisticAvatar]);

  // Thêm debug log cho chế độ mobile
  React.useEffect(() => {
    console.log('Mobile view detected:', isMobile);
    console.log('ProfileImageWrapper styles updated for mobile view');
  }, [isMobile]);

  const handleEditProfile = () => {
    // Open modal instead of navigating to edit page
    handleOpenProfileModal();
  };

  const handleAddFriend = () => {
    if (!isRequestSent) {
      setIsRequestSent(true);
      // Dispatch action để gửi friend request
      console.log("Friend request sent");
    }
  };

  const handleMessageUser = () => {
    navigate(`/messages/${user.id}`);
  };
  
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset toast tracking for new upload
    setHasShownSuccessToast(false);
    
    // Clean up previous optimistic image if exists
    if (optimisticAvatar) {
      URL.revokeObjectURL(optimisticAvatar);
    }
    
    // Save original avatar URL for rollback
    originalAvatarRef.current = avatarSrc;
    
    // Create an optimistic local image URL
    const localImageUrl = URL.createObjectURL(file);
    setOptimisticAvatar(localImageUrl);
    setAvatarSrc(localImageUrl);
    
    // Reset the processed flag when starting a new upload
    processedUploadRef.current = false;
    setIsUploading(true);
    
    // Use the uploadAvatar action from Redux
    dispatch(uploadAvatar({
      file,
      onProgress: (progress) => {
        setUploadProgress(progress);
      }
    }));
  };

  // Hàm để thu gọn bio nếu quá dài
  const renderBio = (bio) => {
    if (!bio) return null;
    
    const MAX_BIO_LENGTH = 100; // Giới hạn độ dài bio khi hiển thị
    const isBioLong = bio.length > MAX_BIO_LENGTH;
    
    if (!isBioLong) {
      return bio;
    }
    
    return bioExpanded ? bio : `${bio.substring(0, MAX_BIO_LENGTH)}...`;
  };

  // Hàm xử lý khi click vào nút xem thêm/thu gọn
  const handleToggleBio = () => {
    setBioExpanded(!bioExpanded);
  };

  const handleOpenNameModal = () => {
    setNewName(user.fullName || '');
    setNameModalOpen(true);
  };
  
  const handleCloseNameModal = () => {
    setNameModalOpen(false);
  };
  
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  
  const handleUpdateName = async () => {
    if (!newName || newName.trim().length === 0) {
      showError('Tên không được để trống!');
      return;
    }
    
    try {
      setIsUpdatingName(true);
      
      // Dispatch action to update user name
      await dispatch(updateUserProfile({
        id: user.id,
        fullName: newName.trim()
      })).unwrap();
      
      showSuccess('Cập nhật tên thành công!');
      handleCloseNameModal();
      
      // Refresh user profile after update
      if (user?.id) {
        dispatch(fetchUserProfile(user.id));
      }
    } catch (error) {
      showError('Không thể cập nhật tên. Vui lòng thử lại sau.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleOpenProfileModal = () => {
    // Initialize form with current user data
    const currentLocation = user.location || '';
    // Find the province object that matches the user's current location
    const userProvince = vietnamProvinces.find(p => p.name === currentLocation);
    
    setProfileForm({
      bio: user.bio || '',
      location: userProvince ? userProvince.name : '',
      gender: user.gender || '',
      birthday: user.birthday ? formatDateForInput(user.birthday) : '',
      relationship: user.relationship || '',
    });
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  const handleProfileFormChange = (field) => (event) => {
    setProfileForm({
      ...profileForm,
      [field]: event.target.value
    });
  };

  const handleDateChange = (event) => {
    const inputValue = event.target.value;
    
    // Allow empty values
    if (!inputValue) {
      setProfileForm({
        ...profileForm,
        birthday: null
      });
      return;
    }
    
    // Validate format DD/MM/YYYY
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const isValidFormat = datePattern.test(inputValue);
    
    // Simple date validation
    let isValidDate = false;
    if (isValidFormat) {
      const parts = inputValue.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      // Check if date is valid
      const date = new Date(year, month - 1, day);
      isValidDate = date.getDate() === day && 
                    date.getMonth() === month - 1 && 
                    date.getFullYear() === year &&
                    year >= 1900 && year <= new Date().getFullYear();
    }
    
    setProfileForm({
      ...profileForm,
      birthday: inputValue
    });
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      
      // Clone form data for API submission
      let formattedData = { ...profileForm };
      
      // Convert date format to API format if it exists
      if (formattedData.birthday) {
        formattedData.birthday = formatDateForApi(formattedData.birthday);
      }
      
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

  // Debug
  console.log('User data in UserInfo:', user);
  console.log('Relationship status:', user?.relationship);

  if (!user) {
    return <ProfileInfoContainer elevation={1}>Loading...</ProfileInfoContainer>;
  }

  return (
    <ProfileInfoContainer elevation={1}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
          position: "relative",
          width: "100%",
          ...(isMobile && {
            marginTop: -7, // Điều chỉnh vị trí avatar so với ảnh bìa
            zIndex: 20,
          }),
        }}
      >
        <ProfileImageWrapper
          sx={{
            ...(isMobile && {
              margin: '0 auto',
              marginBottom: 1,
            }),
          }}
        >
          <ProfileImage 
            src={avatarSrc} 
            alt={user.fullName}
            sx={{
              ...(isUploading && { 
                filter: 'blur(2px)',
                transition: 'filter 0.3s ease-in-out' 
              })
            }}
          />
          
          {isUploading && (
            <ProfileImageOverlay>
              <CircularProgress 
                size={40} 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ color: '#fff' }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1, 
                  color: '#fff',
                  fontWeight: 'bold' 
                }}
              >
                {uploadProgress}%
              </Typography>
            </ProfileImageOverlay>
          )}
          
          {isOwner && (
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0, // Hide by default
                transition: 'opacity 0.3s',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.7, // Show on hover for both mobile and desktop
                },
                zIndex: 1,
              }}
            >
              <label 
                htmlFor="upload-avatar" 
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Cập nhật
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  ảnh đại diện
                </Typography>
              </label>
              <UploadInput
                id="upload-avatar"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </Box>
          )}
        </ProfileImageWrapper>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          ...(isMobile && {
            flexDirection: 'row', 
            marginTop: 1,
          }),
        }}>
          <ProfileFullName 
            variant={isMobile ? "h4" : "h5"}
            sx={{
              ...(isMobile && {
                fontWeight: 'bold',
                marginBottom: 0,
                textAlign: 'center',
              }),
            }}
          >
            {user.fullName}
          </ProfileFullName>
          {isOwner && (
            <IconButton 
              size="small" 
              sx={{ 
                ml: 0.5, 
                color: 'primary.main',
                padding: '4px',
              }}
              onClick={handleOpenNameModal}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      <IntroContainer>
        <IntroHeader>
          <IntroTitle sx={{ 
            ...(isMobile && {
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: 1
            })
          }}>
            Giới thiệu
          </IntroTitle>
        </IntroHeader>

        {user.bio && (
          <Box sx={{ 
            width: '100%',
            ...(isMobile && {
              px: 1
            })
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                py: 1, 
                px: 1,
                textAlign: "center",
                display: '-webkit-box',
                WebkitLineClamp: bioExpanded ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: bioExpanded ? 'visible' : 'hidden',
                wordBreak: 'break-word',
                maxWidth: '100%',
                ...(isMobile && {
                  fontSize: '0.9rem',
                  lineHeight: 1.5
                })
              }}
            >
              {user.bio}
            </Typography>
            
            {user.bio.length > 50 && (
              <Button 
                onClick={handleToggleBio}
                size="small"
                color="primary"
                sx={{ 
                  fontSize: '0.75rem', 
                  textTransform: 'none',
                  display: 'block',
                  margin: '0 auto',
                  padding: '0px 8px',
                  minWidth: 'auto',
                  mb: 1,
                }}
              >
                {bioExpanded ? 'Thu gọn' : 'Xem thêm'}
              </Button>
            )}
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Always display relationship status */}
        <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
          <FavoriteIcon fontSize="small" color="error" />
          <IntroItemText>
            {formatRelationship(user.relationship)}
          </IntroItemText>
        </IntroItem>

        {user.gender && (
          <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
            <Typography variant="body2" component="span">👤</Typography>
            <IntroItemText>
              {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
            </IntroItemText>
          </IntroItem>
        )}

        {user.location && (
          <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
            <LocationOnIcon fontSize="small" />
            <IntroItemText>{user.location}</IntroItemText>
          </IntroItem>
        )}

        {/* Education field not yet in API */}
        {user.education && (
          <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
            <SchoolIcon fontSize="small" />
            <IntroItemText>{user.education}</IntroItemText>
          </IntroItem>
        )}

        {/* Work field not yet in API */}
        {user.work && (
          <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
            <WorkIcon fontSize="small" />
            <IntroItemText>{user.work}</IntroItemText>
          </IntroItem>
        )}

        {user.birthday && (
          <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
            <Typography variant="body2" component="span">🎂</Typography>
            <IntroItemText>
              {new Date(user.birthday).toLocaleDateString('vi-VN')}
            </IntroItemText>
          </IntroItem>
        )}
        
        {user.createdAt && (
          <IntroItem sx={{ ...(isMobile && { mb: 1.5 }) }}>
            <Typography variant="body2" component="span">📅</Typography>
            <IntroItemText>
              Tham gia ngày {new Date(user.createdAt).toLocaleDateString('vi-VN')}
            </IntroItemText>
          </IntroItem>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              mb: 1,
              ...(isMobile && {
                fontSize: '0.85rem'
              })
            }}
          >
            <span>Email</span>
            <strong>{user.email}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Mobile edit button - Always visible when owner */}
        {isOwner && isMobile && (
          <Box sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            zIndex: 1000,
            backgroundColor: theme.palette.background.paper,
            borderRadius: '50%',
            padding: '3px',
            boxShadow: theme.shadows[3],
          }}>
            <Tooltip title="Chỉnh sửa thông tin">
              <Fab
                color="primary"
                onClick={handleEditProfile}
                sx={{ 
                  boxShadow: 3,
                  width: 50,
                  height: 50,
                }}
                aria-label="edit profile"
              >
                <EditIcon />
              </Fab>
            </Tooltip>
          </Box>
        )}

        <ButtonsContainer>
          {isOwner ? (
            <Button
              variant="contained"
              fullWidth
              startIcon={<EditIcon />}
              onClick={handleEditProfile}
              size="medium"
              sx={{ display: isMobile ? 'none' : 'flex' }}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Stack spacing={1} width="100%">
              {isFriend ? (
                <Button variant="contained" startIcon={<CheckIcon />} fullWidth>
                  Bạn bè
                </Button>
              ) : (
                <AddFriendButton
                  variant="contained"
                  startIcon={isRequestSent ? <CheckIcon /> : <AddIcon />}
                  onClick={handleAddFriend}
                  fullWidth
                >
                  {isRequestSent ? "Đã gửi lời mời" : "Kết bạn"}
                </AddFriendButton>
              )}

              <MessageButton
                variant="outlined"
                startIcon={<MessageIcon />}
                onClick={handleMessageUser}
                fullWidth
              >
                Nhắn tin
              </MessageButton>
            </Stack>
          )}
        </ButtonsContainer>
      </IntroContainer>

      {/* Modal for editing profile */}
      <Modal
        open={profileModalOpen}
        onClose={handleCloseProfileModal}
        aria-labelledby="edit-profile-modal"
        aria-describedby="modal-to-edit-user-profile"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: 600 },
          maxHeight: { xs: '80vh', sm: '90vh' },
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        }}>
          <Typography variant="h6" component="h2" sx={{ mb: { xs: 2, sm: 3 } }}>
            Chỉnh sửa thông tin
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giới thiệu về bản thân"
                value={profileForm.bio}
                onChange={handleProfileFormChange('bio')}
                variant="outlined"
                multiline
                rows={isMobile ? 3 : 4}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Đang sống tại</InputLabel>
                <Select
                  value={profileForm.location}
                  label="Đang sống tại"
                  onChange={handleProfileFormChange('location')}
                >
                  <MenuItem value="">Chọn tỉnh thành</MenuItem>
                  {vietnamProvinces.map((province) => (
                    <MenuItem key={province.code} value={province.name}>{province.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={profileForm.gender}
                  label="Giới tính"
                  onChange={handleProfileFormChange('gender')}
                >
                  <MenuItem value="">Không xác định</MenuItem>
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sinh nhật"
                type="text"
                value={profileForm.birthday || ''}
                onChange={handleDateChange}
                variant="outlined"
                placeholder="DD/MM/YYYY"
                inputProps={{
                  pattern: "\\d{2}/\\d{2}/\\d{4}"
                }}
                helperText="Định dạng: Ngày/Tháng/Năm (VD: 31/12/2000)"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tình trạng mối quan hệ</InputLabel>
                <Select
                  value={profileForm.relationship}
                  label="Tình trạng mối quan hệ"
                  onChange={handleProfileFormChange('relationship')}
                >
                  <MenuItem value="">Không xác định</MenuItem>
                  <MenuItem value="single">Độc thân</MenuItem>
                  <MenuItem value="relationship">Đang trong mối quan hệ</MenuItem>
                  <MenuItem value="married">Đã kết hôn</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 1, 
            mt: 3,
            flexDirection: isMobile ? 'column' : 'row' 
          }}>
            <Button 
              variant="outlined" 
              onClick={handleCloseProfileModal}
              disabled={isUpdatingProfile}
              fullWidth={isMobile}
              sx={{ mb: isMobile ? 1 : 0 }}
            >
              Huỷ
            </Button>
            <Button 
              variant="contained" 
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              startIcon={isUpdatingProfile ? <CircularProgress size={16} color="inherit" /> : null}
              fullWidth={isMobile}
            >
              {isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Existing name edit modal */}
      <Modal
        open={nameModalOpen}
        onClose={handleCloseNameModal}
        aria-labelledby="edit-name-modal"
        aria-describedby="modal-to-edit-user-full-name"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
        }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Chỉnh sửa tên hiển thị
          </Typography>
          
          <TextField
            fullWidth
            label="Tên hiển thị"
            value={newName}
            onChange={handleNameChange}
            variant="outlined"
            autoFocus
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 1,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Button 
              variant="outlined" 
              onClick={handleCloseNameModal}
              disabled={isUpdatingName}
              fullWidth={isMobile}
              sx={{ mb: isMobile ? 1 : 0 }}
            >
              Huỷ
            </Button>
            <Button 
              variant="contained" 
              onClick={handleUpdateName}
              disabled={isUpdatingName || !newName.trim()}
              startIcon={isUpdatingName ? <CircularProgress size={16} color="inherit" /> : null}
              fullWidth={isMobile}
            >
              {isUpdatingName ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </ProfileInfoContainer>
  );
};

UserInfo.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    profilePicture: PropTypes.string,
    thumbnail: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    birthday: PropTypes.string,
    gender: PropTypes.string,
    email: PropTypes.string,
    isOwner: PropTypes.bool,
  }),
};

export default UserInfo;
