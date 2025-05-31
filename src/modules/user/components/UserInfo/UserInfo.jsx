import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import MessageIcon from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
} from "./UserInfo.styles";

// Default image
const DEFAULT_AVATAR = "/assets/images/avatar_default.jpg";

const UserInfo = ({ user }) => {
  const [isFriend, setIsFriend] = useState(false); // Assume no friendship status from API for now
  const [isRequestSent, setIsRequestSent] = useState(false);
  const navigate = useNavigate();
  const isOwner = user?.isOwner || false;

  const handleEditProfile = () => {
    navigate("/profile/edit");
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
        }}
      >
        <ProfileImage 
          src={user.profilePicture || DEFAULT_AVATAR} 
          alt={user.fullName} 
        />
        <ProfileFullName variant="h5">{user.fullName}</ProfileFullName>
      </Box>

      <IntroContainer>
        <IntroHeader>
          <IntroTitle>Giới thiệu</IntroTitle>
          {isOwner && (
            <IconButton size="small" onClick={handleEditProfile}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </IntroHeader>

        {user.bio && (
          <Typography variant="body2" sx={{ py: 1, textAlign: "center" }}>
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

        {/* Education field not yet in API */}
        {user.education && (
          <IntroItem>
            <SchoolIcon fontSize="small" />
            <IntroItemText>{user.education}</IntroItemText>
          </IntroItem>
        )}

        {/* Work field not yet in API */}
        {user.work && (
          <IntroItem>
            <WorkIcon fontSize="small" />
            <IntroItemText>{user.work}</IntroItemText>
          </IntroItem>
        )}

        {user.birthday && (
          <IntroItem>
            <Typography variant="body2" component="span">🎂</Typography>
            <IntroItemText>
              {new Date(user.birthday).toLocaleDateString('vi-VN')}
            </IntroItemText>
          </IntroItem>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
          >
            <span>Email</span>
            <strong>{user.email}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <ButtonsContainer>
          {isOwner ? (
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
