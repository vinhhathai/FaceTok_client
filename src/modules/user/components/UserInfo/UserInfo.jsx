import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from 'react-router-dom';

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
  MessageButton
} from './UserInfo.styles';

const UserInfo = ({ user }) => {
  const [isFriend, setIsFriend] = useState(user?.isFriend || false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleAddFriend = () => {
    if (!isRequestSent) {
      setIsRequestSent(true);
      // Dispatch action để gửi friend request
      console.log('Friend request sent');
    }
  };

  const handleMessageUser = () => {
    navigate(`/messages/${user.id}`);
  };

  return (
    <ProfileInfoContainer elevation={1}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <ProfileImage src={user.avatar || "https://via.placeholder.com/150"} alt={user.name} />
        <ProfileFullName variant="h5">{user.name}</ProfileFullName>
      </Box>

      <IntroContainer>
        <IntroHeader>
          <IntroTitle>Giới thiệu</IntroTitle>
          {user.isCurrentUser && (
            <IconButton size="small" onClick={handleEditProfile}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </IntroHeader>

        {user.bio && (
          <Typography variant="body2" sx={{ py: 1, textAlign: 'center' }}>
            {user.bio}
          </Typography>
        )}

        <Divider sx={{ my: 1 }} />
        
        {user.location && (
          <IntroItem>
            <LocationOnIcon fontSize="small" />
            <IntroItemText>{user.location}</IntroItemText>
          </IntroItem>
        )}
        
        {user.education && (
          <IntroItem>
            <SchoolIcon fontSize="small" />
            <IntroItemText>{user.education}</IntroItemText>
          </IntroItem>
        )}
        
        {user.work && (
          <IntroItem>
            <WorkIcon fontSize="small" />
            <IntroItemText>{user.work}</IntroItemText>
          </IntroItem>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Bài viết</span>
            <strong>{user.postCount}</strong>
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Người theo dõi</span>
            <strong>{user.followerCount}</strong>
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <span>Đang theo dõi</span>
            <strong>{user.followingCount}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <ButtonsContainer>
          {user.isCurrentUser ? (
            <Button
              variant="contained"
              fullWidth
              startIcon={<EditIcon />}
              onClick={handleEditProfile}
              size="medium"
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Stack spacing={1} width="100%">
              {isFriend ? (
                <Button
                  variant="contained"
                  startIcon={<CheckIcon />}
                  fullWidth
                >
                  Bạn bè
                </Button>
              ) : (
                <AddFriendButton
                  variant="contained"
                  startIcon={isRequestSent ? <CheckIcon /> : <AddIcon />}
                  onClick={handleAddFriend}
                  fullWidth
                >
                  {isRequestSent ? 'Đã gửi lời mời' : 'Kết bạn'}
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
    </ProfileInfoContainer>
  );
};

UserInfo.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    coverPhoto: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    education: PropTypes.string,
    work: PropTypes.string,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,
    postCount: PropTypes.number,
    isCurrentUser: PropTypes.bool,
    isFriend: PropTypes.bool,
  }).isRequired,
};

export default UserInfo; 