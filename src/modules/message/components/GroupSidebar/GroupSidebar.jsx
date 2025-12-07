import React, { useState, useRef } from "react";
// import { useSelector } from "react-redux";
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
  CircularProgress,
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
import { getFriends } from "@friend/api/friendAPI";
import { inviteToGroup as inviteToGroupAPI, updateGroupAvatar as updateGroupAvatarAPI } from "@message/api/messageAPI";

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

  // Invite modal state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [inviteSearch, setInviteSearch] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteToast, setInviteToast] = useState({ open: false, message: "", severity: "success" });

  // Socket hook
  const { emit, inviteMember, renameGroup, dissolveGroup, changeGroupOwner, leaveGroup, kickMember, toastInfo, handleCloseToast } =
    useMessageSocket(conversation);

  // const currentUser = useSelector((state) => state.auth.user);

  // Xác định ownerId từ conversation đã được adapter chuẩn hóa
  const ownerId = conversation?.groupOwnerId || conversation?.participant?.groupOwnerId || conversation?.participant?.ownerId || conversation?.participant?._id;
  const isOwner = (currentUserId && ownerId) ? String(currentUserId) === String(ownerId) : false;
  const groupName = conversation?.participant?.fullName || "Group Chat";
  const [localAvatar, setLocalAvatar] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);
  const groupAvatar = localAvatar || conversation?.participant?.avatar || null;
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

      // Debug conversation structure
      console.log('Conversation data for rename:', {
        conversationId: conversation?._id,
        isGroup: conversation?.isGroup,
        groupId: conversation?.groupId,
        groupIdType: typeof conversation?.groupId,
        hasParticipant: !!conversation?.participant
      });

      // Check if this is actually a group conversation
      if (!conversation?.isGroup) {
        console.error("This is not a group conversation");
        return;
      }

      // Use roomId (conversation._id) - backend expects roomId, not groupId
      const roomId = conversation?._id;

      console.log('Using roomId for rename:', roomId);

      if (!roomId) {
        console.error("Room ID not found");
        return;
      }

      // Call renameGroup with roomId (backend will find group by roomId)
      const success = await renameGroup(roomId, newGroupName.trim());
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const roomId = conversation?._id;
    if (!roomId) return;
    setAvatarUploading(true);
    try {
      const resp = await updateGroupAvatarAPI(roomId, file);
      const url = resp?.data?.group?.avatar || resp?.data?.avatar || resp?.data?.group?.avatarUrl;
      if (url) {
        setLocalAvatar(url);
        setInviteToast({ open: true, message: "Đã cập nhật ảnh nhóm", severity: "success" });
        // Server will broadcast real-time updates via SocketBus
      } else {
        setInviteToast({ open: true, message: "Cập nhật ảnh nhóm thành công", severity: "success" });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Không thể cập nhật ảnh nhóm";
      setInviteToast({ open: true, message: msg, severity: "error" });
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openInviteDialog = async () => {
    setInviteOpen(true);
    setInviteSearch("");
    setInviteError("");
    setInviteLoading(true);
    try {
      const res = await getFriends();
      let list = [];
      if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.data?.friends)) list = res.data.friends;
      else if (Array.isArray(res?.data?.data)) list = res.data.data;
      else if (res?.data && typeof res.data === "object") {
        for (const key of Object.keys(res.data)) {
          if (Array.isArray(res.data[key])) { list = res.data[key]; break; }
        }
      }

      // Normalize to { id, fullName, profilePicture }
      const normalized = (list || []).map((f) => ({
        id: f.id || f._id || f.userId || f.user?.id || f.user?._id,
        fullName: f.fullName || f.name || f.user?.fullName || f.user?.name,
        profilePicture: f.profilePicture || f.avatar || f.user?.profilePicture || f.user?.avatar || null,
      })).filter((f) => !!f.id);

      // Exclude current members
      const memberIds = new Set((conversation?.members || []).map((m) => String(m._id || m.id)));
      const filtered = normalized.filter((f) => !memberIds.has(String(f.id)));

      setFriendsList(filtered);
    } catch (e) {
      setFriendsList([]);
      setInviteError("Không thể tải danh sách bạn bè");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleInviteUser = async (targetUserId) => {
    const roomId = conversation?._id;
    if (!roomId || !targetUserId) return;
    try {
      await inviteToGroupAPI(roomId, targetUserId);
      setInviteToast({ open: true, message: "Đã mời vào nhóm", severity: "success" });
      // Gửi sự kiện socket để BE tạo message hệ thống + broadcast
      inviteMember(roomId, targetUserId);
      // Remove invited user from list
      setFriendsList((prev) => prev.filter((f) => String(f.id) !== String(targetUserId)));
    } catch (e) {
      const msg = e?.response?.data?.message || "Không thể mời vào nhóm";
      setInviteToast({ open: true, message: msg, severity: "error" });
    }
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
    openInviteDialog();
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
              <AvatarActionButton onClick={handleChangeAvatar} size="small" disabled={avatarUploading}>
                <PhotoCameraIcon fontSize="small" />
              </AvatarActionButton>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarFileSelected}
              />
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
              Mời bạn bè vào nhóm
            </Button>

            {isOwner && (
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteGroup}
                fullWidth
                color="error"
              >
                Xóa nhóm
              </Button>
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

      {/* Invite Friends Dialog */}
      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Mời bạn bè vào nhóm</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            placeholder="Tìm bạn bè..."
            value={inviteSearch}
            onChange={(e) => setInviteSearch(e.target.value)}
            sx={{ mb: 2, width: "100%" }}
            InputProps={{ sx: { fontSize: "0.875rem" } }}
          />
          {inviteLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List dense>
              {friendsList
                .filter((f) =>
                  (f.fullName || "").toLowerCase().includes(inviteSearch.toLowerCase())
                )
                .map((friend) => (
                  <ListItem key={friend.id} dense secondaryAction={
                    <Button variant="outlined" size="small" onClick={() => handleInviteUser(friend.id)}>
                      Mời
                    </Button>
                  }>
                    <ListItemAvatar>
                      <Avatar src={friend.profilePicture} sx={{ width: 40, height: 40 }} />
                    </ListItemAvatar>
                    <ListItemText primary={friend.fullName} />
                  </ListItem>
                ))}
              {!inviteLoading && friendsList.length === 0 && (
                <ListItem dense>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", width: "100%" }}>
                    {inviteError || "Không có bạn bè để mời"}
                  </Typography>
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteOpen(false)}>Đóng</Button>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexDirection: "column", alignItems: "flex-start" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {String(member._id || member.id) === String(ownerId) ? "Chủ nhóm" : "Thành viên"}
                        </Typography>
                        {String(member._id || member.id) === String(ownerId) && (
                          <CrownIcon fontSize="small" color="primary" />
                        )}
                      </Box>
                      {/* Debug info */}
                      <Typography variant="caption" color="warning.main">
                        isOwner: {String(isOwner)} | ownerId: {String(ownerId)} | currentUserId: {String(currentUserId)} | memberId: {String(member._id || member.id)}
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

      {/* Local Invite Toast */}
      <Snackbar
        open={inviteToast.open}
        autoHideDuration={4000}
        onClose={() => setInviteToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setInviteToast((prev) => ({ ...prev, open: false }))}
          severity={inviteToast.severity}
          sx={{ width: "100%" }}
        >
          {inviteToast.message}
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
