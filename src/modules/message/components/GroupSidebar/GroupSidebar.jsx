import React, { useState } from "react";
import PropTypes from "prop-types";
// import { renameGroup as renameGroupAPI } from "../../api/messageAPI";
import useMessageSocket from "../../hooks/useMessageSocket";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  SidebarContent,
  RowBetween,
  AvatarWrapper,
  GroupAvatar,
  AvatarActionButton,
  NameRow,
  MembersSection,
  ActionsColumn,
  // OwnerBadgeIconSx,
  drawerPaperSx,
} from "./GroupSidebar.styles";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  ExitToApp as ExitIcon,
  PersonRemove as PersonRemoveIcon,
  AdminPanelSettings as CrownIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import ConfirmDialog from "./ConfirmDialog";

const GroupSidebar = ({ open, onClose, conversation, currentUserId }) => {
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  // Các hành động kick/chuyển quyền chỉ hiển thị trong modal thành viên
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [confirmDissolveOpen, setConfirmDissolveOpen] = useState(false);
  const [searchMember, setSearchMember] = useState("");
  const [confirmRemoveMember, setConfirmRemoveMember] = useState(null);
  const [confirmTransferOwnership, setConfirmTransferOwnership] =
    useState(null);

  // Socket hook
  const { renameGroup, dissolveGroup, changeGroupOwner, leaveGroup, kickMember, toastInfo, handleCloseToast } =
    useMessageSocket(conversation);

  // Xác định ownerId từ conversation đã được adapter chuẩn hóa
  const ownerId = conversation?.groupOwnerId || conversation?.participant?.groupOwnerId || conversation?.participant?.ownerId || conversation?.participant?._id;

  const isOwner = (currentUserId && ownerId) ? String(currentUserId) === String(ownerId) : false;
  const groupName = conversation?.participant?.fullName || "Group Chat";
  const groupAvatar = conversation?.participant?.avatar || null;
  const members = conversation?.members || [];

  const handleEditName = () => {
    setNewGroupName(groupName);
    setEditNameOpen(true);
  };

  const handleSaveName = async () => {
    try {
      // debug removed

      // Validation
      if (!newGroupName.trim()) {
        console.error("Tên nhóm không được để trống");
        return;
      }

      if (newGroupName.trim().length < 3) {
        console.error("Tên nhóm phải có ít nhất 3 ký tự");
        return;
      }

      if (newGroupName.trim().length > 30) {
        console.error("Tên nhóm không được quá 30 ký tự");
        return;
      }

      // Thử nhiều cách để lấy groupId
      const groupId =
        conversation?.groupId?._id ||
        conversation?.participant?.groupId ||
        conversation?.groupId || // Thử conversation.groupId trực tiếp
        conversation?._id; // Fallback: sử dụng conversation._id
      // debug removed

      if (!groupId) {
        console.error("Group ID not found");
        return;
      }

      // Sử dụng Socket.IO để đổi tên nhóm
      // debug removed
      const success = renameGroup(groupId, newGroupName.trim());
      // debug removed

      if (success) {
        // debug removed
        setEditNameOpen(false);
      } else {
        console.error("Failed to send rename request");
      }

      // TODO: Refresh conversation data or update local state
      // Có thể dispatch action để refresh conversation list
    } catch (error) {
      console.error("Error renaming group:", error);

      // Map backend error messages to Vietnamese
      let errorMessage = "Có lỗi xảy ra khi đổi tên nhóm";

      if (error.response?.data?.message) {
        const backendMessage = error.response.data.message;

        switch (backendMessage) {
          case "Group not found":
            errorMessage = "Không tìm thấy nhóm";
            break;
          case "You are not a member of this group":
            errorMessage = "Bạn không phải là thành viên của nhóm này";
            break;
          case "Name is required":
            errorMessage = "Tên nhóm là bắt buộc";
            break;
          case "Name cannot be empty":
            errorMessage = "Tên nhóm không được để trống";
            break;
          case "Name must be at least 3 characters long":
            errorMessage = "Tên nhóm phải có ít nhất 3 ký tự";
            break;
          case "Name must be less than 30 characters long":
            errorMessage = "Tên nhóm không được quá 30 ký tự";
            break;
          default:
            errorMessage = backendMessage;
        }
      }

      console.error("User-friendly error:", errorMessage);
      // TODO: Show error message to user (e.g., using toast notification)
    }
  };

  const handleChangeAvatar = () => {
    // TODO: Implement avatar change
    // debug removed
  };

  const handleDeleteGroup = () => {
    setConfirmDissolveOpen(true);
  };

  const confirmDissolveGroup = () => {
    const roomId = conversation?._id;
    if (!roomId) return;
    setConfirmDissolveOpen(false);
    dissolveGroup(roomId);
  };

  const handleShareGroup = () => {
    // TODO: Implement share group
    // debug removed
  };

  const handleLeaveGroup = () => {
    const roomId = conversation?._id;
    if (!roomId) return;
    leaveGroup(roomId);
  };

  const handleRemoveMemberFromGroup = (memberId) => {
    const roomId = conversation?._id;
    if (!roomId || !memberId) return;
    const ok = kickMember(roomId, memberId);
    if (ok) {
      setConfirmRemoveMember(null);
    }
  };

  const handleTransferToMember = (memberId) => {
    const roomId = conversation?._id;
    if (!roomId || !memberId) return;
    // Gửi yêu cầu chuyển quyền qua socket
    const ok = changeGroupOwner(roomId, memberId);
    if (ok) {
      setConfirmTransferOwnership(null);
    }
  };

  const handleConfirmRemoveMember = (member) => {
    setConfirmRemoveMember(member);
  };

  const handleConfirmTransferOwnership = (member) => {
    setConfirmTransferOwnership(member);
  };

  // Filter members based on search
  const filteredMembers = members.filter((member) =>
    member.fullName?.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: drawerPaperSx,
        }}
      >
        <SidebarContent>
          {/* Header */}
          <RowBetween sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Thông tin nhóm
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </RowBetween>

          {/* Group Avatar */}
          <AvatarWrapper>
            <Box sx={{ position: "relative" }}>
              <GroupAvatar src={groupAvatar}>
                {!groupAvatar && <CrownIcon />}
              </GroupAvatar>
              <AvatarActionButton onClick={handleChangeAvatar} size="small">
                <PhotoCameraIcon fontSize="small" />
              </AvatarActionButton>
            </Box>
          </AvatarWrapper>

          {/* Group Name */}
          <Box sx={{ mb: 3 }}>
            <NameRow>
              <Typography variant="subtitle1" fontWeight="bold">
                Tên nhóm
              </Typography>
              <IconButton onClick={handleEditName} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </NameRow>
            <Typography variant="body2" color="text.secondary">
              {groupName}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Members Count */}
          <MembersSection>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Thành viên ({members.length})
            </Typography>

            <Button
              variant="text"
              size="small"
              onClick={() => setShowMembersModal(true)}
              sx={{
                color: "primary.main",
                textTransform: "none",
                p: 0,
                minWidth: "auto",
              }}
            >
              Xem tất cả {members.length} thành viên
            </Button>
          </MembersSection>

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <ActionsColumn>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShareGroup}
              fullWidth
            >
              Chia sẻ nhóm
            </Button>

            {isOwner && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteGroup}
                  fullWidth
                  color="error"
                >
                  Xóa nhóm
                </Button>
              </>
            )}

            {!isOwner && (
              <Button
                variant="outlined"
                startIcon={<ExitIcon />}
                onClick={handleLeaveGroup}
                fullWidth
                color="error"
              >
                Rời nhóm
              </Button>
            )}
          </ActionsColumn>
        </SidebarContent>
      </Drawer>

      {/* Edit Group Name Dialog */}
      <Dialog
        open={editNameOpen}
        onClose={() => setEditNameOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa tên nhóm</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên nhóm mới"
            fullWidth
            variant="outlined"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditNameOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveName} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dissolve Group Dialog */}
      <ConfirmDialog
        open={confirmDissolveOpen}
        title="Giải tán nhóm"
        description="Bạn có chắc chắn muốn giải tán nhóm? Hành động này không thể hoàn tác."
        confirmText="Giải tán"
        confirmColor="error"
        cancelText="Hủy"
        onConfirm={confirmDissolveGroup}
        onClose={() => setConfirmDissolveOpen(false)}
      />


      {/* Confirm Remove Member Dialog */}
      <Dialog
        open={!!confirmRemoveMember}
        onClose={() => setConfirmRemoveMember(null)}
        maxWidth="sm"
        fullWidth
      >
            <DialogTitle>Xác nhận xóa thành viên</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Bạn có chắc chắn muốn xóa{" "}
            <strong>{confirmRemoveMember?.fullName}</strong> khỏi nhóm?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemoveMember(null)}>Hủy</Button>
          <Button
            onClick={() =>
              handleRemoveMemberFromGroup(
                confirmRemoveMember?._id || confirmRemoveMember?.id
              )
            }
            variant="contained"
            color="error"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Transfer Ownership Dialog */}
      <Dialog
        open={!!confirmTransferOwnership}
        onClose={() => setConfirmTransferOwnership(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận chuyển quyền trưởng nhóm</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Bạn có chắc chắn muốn chuyển quyền trưởng nhóm cho{" "}
            <strong>{confirmTransferOwnership?.fullName}</strong>?
          </Typography>
          <Typography
            variant="caption"
            color="warning.main"
            sx={{ mt: 1, display: "block" }}
          >
            Lưu ý: Bạn sẽ không còn là trưởng nhóm sau khi chuyển quyền.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmTransferOwnership(null)}>Hủy</Button>
          <Button
            onClick={() =>
              handleTransferToMember(
                confirmTransferOwnership?._id || confirmTransferOwnership?.id
              )
            }
            variant="contained"
            color="primary"
          >
            Chuyển quyền
          </Button>
        </DialogActions>
      </Dialog>

      {/* Members Modal */}
      <Dialog
        open={showMembersModal}
        onClose={() => {
          setShowMembersModal(false);
          setSearchMember("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">
              Thành viên nhóm ({members.length})
            </Typography>
            <IconButton
              onClick={() => {
                setShowMembersModal(false);
                setSearchMember("");
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Search for members */}
          <TextField
            size="small"
            placeholder="Tìm thành viên..."
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
            InputProps={{
              sx: { fontSize: "0.875rem" },
            }}
          />

          <List dense>
            {filteredMembers.map((member) => (
              <ListItem key={member._id || member.id} dense>
                <ListItemAvatar>
                  <Avatar src={member.avatar} sx={{ width: 40, height: 40 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={member.fullName}
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {String(member._id || member.id) === String(ownerId) ? "Chủ nhóm" : "Thành viên"}
                      </Typography>
                      {String(member._id || member.id) === String(ownerId) && (
                        <CrownIcon fontSize="small" color="primary" />
                      )}
                      <Typography variant="caption" color="text.secondary">
                      </Typography>
                    </Box>
                  }
                />
                {isOwner && String(member._id || member.id) !== String(ownerId) && (
                  <ListItemSecondaryAction>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Gán quyền trưởng nhóm">
                        <IconButton
                          size="small"
                          onClick={() => handleConfirmTransferOwnership(member)}
                          sx={{
                            color: "primary.main",
                            "&:hover": { backgroundColor: "primary.light" },
                          }}
                        >
                          <CrownIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa khỏi nhóm">
                        <IconButton
                          size="small"
                          onClick={() => handleConfirmRemoveMember(member)}
                          sx={{
                            color: "error.main",
                            "&:hover": { backgroundColor: "error.light" },
                          }}
                        >
                          <PersonRemoveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
            {searchMember && filteredMembers.length === 0 && (
              <ListItem dense>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", width: "100%" }}
                >
                  Không tìm thấy thành viên nào
                </Typography>
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowMembersModal(false);
              setSearchMember("");
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toastInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastInfo.severity}
          sx={{ width: "100%" }}
        >
          {toastInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
};

GroupSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  conversation: PropTypes.object,
  currentUserId: PropTypes.string,
};

export default GroupSidebar;
