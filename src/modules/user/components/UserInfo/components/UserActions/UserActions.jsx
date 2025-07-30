import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Stack, Button, Fab, Tooltip, Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import MessageIcon from "@mui/icons-material/Message";
import EditIcon from "@mui/icons-material/Edit";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"; 
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// API functions
import { sendFriendRequest, removeFriend, checkRelationship, acceptFriendRequest } from "../../../../../friend/api/friendAPI";

// Styles
import {
  ButtonsContainer,
  AddFriendButton,
  MessageButton
} from "./UserActions.styles";

// Relationship status enum
const RELATIONSHIP_STATUS = {
  NONE: "NONE",
  FRIEND: "FRIEND",
  REQUEST_SENT: "REQUEST_SENT",
  REQUEST_RECEIVED: "REQUEST_RECEIVED"
};

const UserActions = ({ user, onEditProfile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State
  const [relationshipStatus, setRelationshipStatus] = useState(RELATIONSHIP_STATUS.NONE);
  const [requestId, setRequestId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  
  const isOwner = user?.isOwner || false;
  
  // Kiểm tra mối quan hệ khi component mount hoặc user thay đổi
  useEffect(() => {
    if (user && user.id && !isOwner) {
      fetchRelationshipStatus(user.id);
    }
  }, [user, isOwner]);

  // Hàm kiểm tra mối quan hệ
  const fetchRelationshipStatus = async (userId) => {
    if (!userId) return;
    
    setIsChecking(true);
    try {
      const response = await checkRelationship(userId);
      
      if (response.success && response.data) {
        setRelationshipStatus(response.data.status);
        if (response.data.requestId) {
          setRequestId(response.data.requestId);
        }
      } else {
        setRelationshipStatus(RELATIONSHIP_STATUS.NONE);
      }
    } catch (error) {
      console.error("Error checking relationship:", error);
      setRelationshipStatus(RELATIONSHIP_STATUS.NONE);
    } finally {
      setIsChecking(false);
    }
  };

  const handleAddFriend = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await sendFriendRequest(user.id);
      
      if (response.success) {
        setRelationshipStatus(RELATIONSHIP_STATUS.REQUEST_SENT);
        if (response.data && response.data.friendRequest && response.data.friendRequest._id) {
          setRequestId(response.data.friendRequest._id);
        }
        showAlert("Đã gửi lời mời kết bạn thành công", "success");
      } else {
        showAlert(response.error?.message || "Gửi lời mời thất bại, vui lòng thử lại sau", "error");
      }
    } catch (error) {
      showAlert(error.message || "Đã xảy ra lỗi, vui lòng thử lại sau", "error");
      console.error("Error sending friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (isLoading || !requestId) return;
    
    setIsLoading(true);
    try {
      const response = await acceptFriendRequest(requestId);
      
      if (response.success) {
        setRelationshipStatus(RELATIONSHIP_STATUS.FRIEND);
        showAlert("Đã chấp nhận lời mời kết bạn", "success");
      } else {
        showAlert(response.error?.message || "Không thể chấp nhận lời mời", "error");
      }
    } catch (error) {
      showAlert(error.message || "Đã xảy ra lỗi", "error");
      console.error("Error accepting friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUnfriend = async () => {
    if (isLoading) return;
    
    if (!window.confirm("Bạn có chắc muốn hủy kết bạn với người này?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await removeFriend(user.id);
      
      if (response.success) {
        setRelationshipStatus(RELATIONSHIP_STATUS.NONE);
        setRequestId(null);
        showAlert("Đã hủy kết bạn thành công", "success");
      } else {
        showAlert(response.error?.message || "Hủy kết bạn thất bại", "error");
      }
    } catch (error) {
      showAlert(error.message || "Đã xảy ra lỗi", "error");
      console.error("Error unfriending:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (message, severity) => {
    setAlertInfo({
      open: true,
      message,
      severity
    });
  };

  const handleCloseAlert = () => {
    setAlertInfo(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleMessageUser = () => {
    navigate(`/messages`, {state: { conversationId: user.id } });
  };
  
  // Hiển thị nút phù hợp dựa trên trạng thái mối quan hệ
  const renderFriendButton = () => {
    if (isChecking) {
      return (
        <Button 
          variant="outlined" 
          disabled 
          fullWidth
          startIcon={<CircularProgress size={18} />}
        >
          Đang kiểm tra...
        </Button>
      );
    }
    
    switch (relationshipStatus) {
      case RELATIONSHIP_STATUS.FRIEND:
        return (
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<PersonRemoveIcon />}
            onClick={handleUnfriend}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? "Đang xử lý..." : "Bạn bè"}
          </Button>
        );
      
      case RELATIONSHIP_STATUS.REQUEST_SENT:
        return (
          <Button 
            variant="outlined" 
            disabled={true}
            startIcon={<CheckIcon />}
            fullWidth
          >
            Đã gửi lời mời
          </Button>
        );
        
      case RELATIONSHIP_STATUS.REQUEST_RECEIVED:
        return (
          <Button 
            variant="contained" 
            color="success"
            startIcon={<CheckIcon />}
            onClick={handleAcceptRequest}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? "Đang xử lý..." : "Chấp nhận lời mời"}
          </Button>
        );
      
      case RELATIONSHIP_STATUS.NONE:
      default:
        return (
          <AddFriendButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddFriend}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? "Đang xử lý..." : "Kết bạn"}
          </AddFriendButton>
        );
    }
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
            {renderFriendButton()}

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
      
      <Snackbar 
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertInfo.severity} 
          sx={{ width: '100%' }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
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