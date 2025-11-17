import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MessageIcon from "@mui/icons-material/Message";
import { deleteFriend } from "../../redux";
import { useNavigate } from "react-router-dom";
import {
  FriendListContainer,
  FriendCard,
  FriendActionButtons,
} from "./FriendList.styles";
import Avatar from "../../../../shared/components/Avatar/Avatar";
import { getOrCreateRoom } from "../../../message/api/messageAPI";
import { toast } from "react-toastify";

function FriendList({ friends, loading, error }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [selectedFriendName, setSelectedFriendName] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [processingFriendIds, setProcessingFriendIds] = useState(new Set());

  const handleDeleteFriend = (friendId, friendName) => {
    setSelectedFriendId(friendId);
    setSelectedFriendName(friendName);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFriendId) {
      dispatch(deleteFriend(selectedFriendId));
    }
    setConfirmDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleMessageFriend = async (friendId) => {
    try {
      // Kiểm tra xem friendId đã đang được xử lý chưa
      if (processingFriendIds.has(friendId)) {
        console.log(
          "Already processing this friend, skipping duplicate request"
        );
        return;
      }

      // Đánh dấu đang xử lý friendId này
      setProcessingFriendIds((prev) => new Set([...prev, friendId]));

      // Hiển thị trạng thái đang tải
      setChatLoading(true);

      // Gọi API tạo hoặc tham gia phòng chat
      const response = await getOrCreateRoom(friendId);

      if (response && response.success && response.data && response.data.room) {
        // Nếu tạo phòng thành công, chuyển đến trang tin nhắn với roomId
        navigate(`/messages/`, { state: { roomId: response.data.room._id } });
      } else {
        // Nếu không tìm thấy phòng hoặc có lỗi, vẫn thử chuyển đến trang tin nhắn với userId
        navigate(`/messages/${friendId}`);
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
      toast.error("Không thể tạo phòng chat, vui lòng thử lại sau.");
      // Fallback: chuyển đến trang tin nhắn với userId
      navigate(`/messages/${friendId}`);
    } finally {
      setChatLoading(false);

      // Xóa khỏi danh sách đang xử lý
      setProcessingFriendIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
    }
  };

  const navigateToProfile = (friendId) => {
    // Navigate directly with URL param instead of state
    // FriendId could be publicId or _id, backend will handle both
    navigate('/profile', { state: { userId: friendId } });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", color: "error.main", my: 2 }}>
        <Typography>Đã xảy ra lỗi: {error}</Typography>
      </Box>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <Box sx={{ textAlign: "center", my: 2 }}>
        <Typography>Bạn chưa có người bạn nào. Hãy tìm bạn mới!</Typography>
      </Box>
    );
  }

  return (
    <>
      <FriendListContainer>
        <List>
          {friends.map((friend) => {
            const friendId = String(friend?._id || friend?.id);

            return (
              <FriendCard
                key={friendId}
                elevation={1}
                sx={{ cursor: "pointer" }}
                onClick={(e) => {
                  // Only navigate if the click was not on one of the action buttons
                  if (!e.defaultPrevented) {
                    navigateToProfile(friendId);
                  }
                }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      alt={friend.fullName}
                      src={
                        friend.profilePicture || "/assets/default-avatar.png"
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.fullName}
                    secondary={
                      friend.email || friend.bio || "Người dùng FaceTok"
                    }
                  />
                  <FriendActionButtons>
                    <IconButton
                      edge="end"
                      aria-label="message"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMessageFriend(friendId);
                      }}
                      color="primary"
                      disabled={chatLoading}
                    >
                      {chatLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <MessageIcon />
                      )}
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteFriend(friendId, friend.fullName);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </FriendActionButtons>
                </ListItem>
              </FriendCard>
            );
          })}
        </List>
      </FriendListContainer>

      {/* Modal xác nhận xóa bạn */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa bạn bè</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc muốn xóa {selectedFriendName} khỏi danh sách bạn bè?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FriendList;
