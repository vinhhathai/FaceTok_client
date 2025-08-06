import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Stack,
  Button,
  Fab,
  Tooltip,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import MessageIcon from "@mui/icons-material/Message";
import EditIcon from "@mui/icons-material/Edit";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// API functions
import {
  sendFriendRequest,
  removeFriend,
  checkRelationship,
  acceptFriendRequest,
} from "../../../../../friend/api/friendAPI";
import userApi from "@/modules/user/api/userApi";

// Styles
import {
  ButtonsContainer,
  AddFriendButton,
  MessageButton,
} from "./UserActions.styles";
import { getOrCreateRoom } from "@/modules/message/api/messageAPI";

// Relationship status enum
const RELATIONSHIP_STATUS = {
  NONE: "NONE",
  FRIEND: "FRIEND",
  REQUEST_SENT: "REQUEST_SENT",
  REQUEST_RECEIVED: "REQUEST_RECEIVED",
};

const UserActions = ({ user, onEditProfile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [relationshipStatus, setRelationshipStatus] = useState(
    RELATIONSHIP_STATUS.NONE
  );
  const [requestId, setRequestId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // State để track trạng thái block
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isOwner = user?.isOwner || false;

  // Kiểm tra mối quan hệ và trạng thái block khi component mount hoặc user thay đổi
  useEffect(() => {
    if (user && user.id && !isOwner) {
      fetchRelationshipStatus(user.id);
      checkBlockStatus(user.id);
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

  // Hàm kiểm tra trạng thái block
  const checkBlockStatus = async (userId) => {
    if (!userId) return;

    try {
      // Get blocked users list and check if current user is blocked
      const response = await userApi.getBlockedUsers();

      if (response.success && response.data) {
        const blockedUsers = response.data.blockedUsers || [];
        const isUserBlocked = blockedUsers.some(
          (blockedUser) => blockedUser._id === userId || blockedUser === userId
        );
        setIsBlocked(isUserBlocked);
      } else {
        setIsBlocked(false);
      }
    } catch (error) {
      console.error("Error checking block status:", error);
      setIsBlocked(false);
    }
  };

  const handleAddFriend = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await sendFriendRequest(user.id);

      if (response.success) {
        setRelationshipStatus(RELATIONSHIP_STATUS.REQUEST_SENT);
        if (
          response.data &&
          response.data.friendRequest &&
          response.data.friendRequest._id
        ) {
          setRequestId(response.data.friendRequest._id);
        }
        showAlert("Đã gửi lời mời kết bạn thành công", "success");
      } else {
        showAlert(
          response.error?.message ||
            "Gửi lời mời thất bại, vui lòng thử lại sau",
          "error"
        );
      }
    } catch (error) {
      showAlert(
        error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        "error"
      );
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
        showAlert(
          response.error?.message || "Không thể chấp nhận lời mời",
          "error"
        );
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

  // Handle block user
  const handleBlockUser = () => {
    setShowBlockDialog(true);
  };

  const handleConfirmBlock = async () => {
    if (isBlocking) return;

    setIsBlocking(true);
    try {
      const response = await userApi.blockUser(user.id);

      if (response.success) {
        setIsBlocked(true);
        showAlert("Đã chặn người dùng thành công", "success");
        setShowBlockDialog(false);
      } else {
        showAlert(
          response.error?.message || "Không thể chặn người dùng",
          "error"
        );
      }
    } catch (error) {
      showAlert("Không thể chặn người dùng", "error");
      console.error("Error blocking user:", error);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleCancelBlock = () => {
    setShowBlockDialog(false);
  };

  // Handle unblock user
  const handleUnblockUser = () => {
    setShowUnblockDialog(true);
  };

  const handleConfirmUnblock = async () => {
    if (isUnblocking) return;

    setIsUnblocking(true);
    try {
      const response = await userApi.unblockUser(user.id);

      if (response.success) {
        setIsBlocked(false);
        showAlert("Đã bỏ chặn người dùng thành công", "success");
        setShowUnblockDialog(false);
      } else {
        showAlert(
          response.error?.message || "Không thể bỏ chặn người dùng",
          "error"
        );
      }
    } catch (error) {
      showAlert("Không thể bỏ chặn người dùng", "error");
      console.error("Error unblocking user:", error);
    } finally {
      setIsUnblocking(false);
    }
  };

  const handleCancelUnblock = () => {
    setShowUnblockDialog(false);
  };

  const showAlert = (message, severity) => {
    setAlertInfo({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseAlert = () => {
    setAlertInfo((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleMessageUser = async () => {
    const response = await getOrCreateRoom(user.id);
    navigate(`/messages`, { state: { roomId: response.data.room._id } });
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

  // Render block/unblock button
  const renderBlockButton = () => {
    if (isBlocked) {
      return (
        <Button
          variant="outlined"
          color="success"
          startIcon={<BlockIcon />}
          onClick={handleUnblockUser}
          fullWidth
        >
          Bỏ chặn người dùng
        </Button>
      );
    } else {
      return (
        <Button
          variant="outlined"
          color="error"
          startIcon={<BlockIcon />}
          onClick={handleBlockUser}
          fullWidth
        >
          Chặn người dùng
        </Button>
      );
    }
  };

  return (
    <>
      {/* Mobile edit button - Always visible when owner */}
      {isOwner && isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: theme.palette.background.paper,
            borderRadius: "50%",
            padding: "3px",
            boxShadow: theme.shadows[3],
          }}
        >
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

            {/* Block/Unblock User Button */}
            {renderBlockButton()}
          </Stack>
        </ButtonsContainer>
      )}

      {/* Block User Confirmation Dialog */}
      <Dialog
        open={showBlockDialog}
        onClose={handleCancelBlock}
        aria-labelledby="block-dialog-title"
        aria-describedby="block-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="block-dialog-title">
          Xác nhận chặn người dùng
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Bạn có chắc chắn muốn chặn {user?.fullName || "người dùng này"}? Sau
            khi chặn, bạn sẽ không thể:
          </Typography>
          <Box sx={{ mt: 2, pl: 2 }}>
            <Typography variant="body2" color="text.secondary" component="ul">
              <li>Xem bài viết của họ</li>
              <li>Nhắn tin với họ</li>
              <li>Nhận thông báo từ họ</li>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelBlock}
            color="primary"
            disabled={isBlocking}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmBlock}
            color="error"
            variant="contained"
            disabled={isBlocking}
            autoFocus
          >
            {isBlocking ? "Đang chặn..." : "Chặn người dùng"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unblock User Confirmation Dialog */}
      <Dialog
        open={showUnblockDialog}
        onClose={handleCancelUnblock}
        aria-labelledby="unblock-dialog-title"
        aria-describedby="unblock-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="unblock-dialog-title">
          Xác nhận bỏ chặn người dùng
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Bạn có chắc chắn muốn bỏ chặn {user?.fullName || "người dùng này"}?
            Sau khi bỏ chặn, bạn sẽ có thể:
          </Typography>
          <Box sx={{ mt: 2, pl: 2 }}>
            <Typography variant="body2" color="text.secondary" component="ul">
              <li>Xem bài viết của họ</li>
              <li>Nhắn tin với họ</li>
              <li>Nhận thông báo từ họ</li>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelUnblock}
            color="primary"
            disabled={isUnblocking}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmUnblock}
            color="success"
            variant="contained"
            disabled={isUnblocking}
            autoFocus
          >
            {isUnblocking ? "Đang bỏ chặn..." : "Bỏ chặn người dùng"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertInfo.severity}
          sx={{ width: "100%" }}
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
    fullName: PropTypes.string,
    isOwner: PropTypes.bool,
  }),
  onEditProfile: PropTypes.func.isRequired,
};

export default UserActions;
