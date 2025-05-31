import React, { useState } from "react";
import PropTypes from "prop-types";
import { Stack, Button, Fab, Tooltip, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import MessageIcon from "@mui/icons-material/Message";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

// Styles
import {
  ButtonsContainer,
  AddFriendButton,
  MessageButton
} from "./UserActions.styles";

const UserActions = ({ user, onEditProfile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [isFriend, setIsFriend] = useState(false); // Assume no friendship status from API for now
  const [isRequestSent, setIsRequestSent] = useState(false);
  
  const isOwner = user?.isOwner || false;
  
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
  
  return (
    <>
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
              onClick={onEditProfile}
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

      {!isOwner && (
        <ButtonsContainer>
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
        </ButtonsContainer>
      )}
    </>
  );
};

UserActions.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    isOwner: PropTypes.bool,
  }),
  onEditProfile: PropTypes.func.isRequired
};

export default UserActions; 