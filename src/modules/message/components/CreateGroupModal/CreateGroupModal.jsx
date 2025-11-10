import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getFriends, searchFriends } from "@friend/api/friendAPI";
import { createGroup } from "@message/api/messageAPI";
import styles from "./CreateGroupModal.styles";

const CreateGroupModal = ({ open, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [error, setError] = useState("");

  const currentUser = useSelector((state) => state.auth.user);

  // Load friends list when modal opens
  useEffect(() => {
    if (open) {
      loadFriends();
    }
  }, [open]);

  // Load friends list
  const loadFriends = async () => {
    setLoadingFriends(true);
    try {
      const response = await getFriends();

      if (response.success) {
        // Handle different response structures
        let friendsArray = [];

        if (Array.isArray(response.data)) {
          friendsArray = response.data;
        } else if (response.data && Array.isArray(response.data.friends)) {
          friendsArray = response.data.friends;
        } else if (response.data && Array.isArray(response.data.data)) {
          friendsArray = response.data.data;
        } else if (response.data && typeof response.data === "object") {
          // If it's an object, try to find friends array
          const keys = Object.keys(response.data);

          for (const key of keys) {
            if (Array.isArray(response.data[key])) {
              friendsArray = response.data[key];
              break;
            }
          }
        }

        // No mock data in production - show empty state if no friends
        setFriendsList(friendsArray);
        setFilteredFriends(friendsArray);
      } else {
        setFriendsList([]);
        setFilteredFriends([]);
      }
    } catch (error) {
      console.error("Error loading friends:", error);
      setError("Không thể tải danh sách bạn bè");
      setFriendsList([]);
      setFilteredFriends([]);
    } finally {
      setLoadingFriends(false);
    }
  };

  // Filter friends when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFriends(friendsList);
      return;
    }

    // Ensure friendsList is an array before filtering
    if (!Array.isArray(friendsList)) {
      setFilteredFriends([]);
      return;
    }

    const filtered = friendsList.filter(
      (friend) =>
        friend?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFriends(filtered);
  }, [searchQuery, friendsList]);

  const handleToggleFriend = (friend) => {
    setSelectedFriends((prev) => {
      const isSelected = prev.find((selected) => selected.id === friend.id);

      if (isSelected) {
        return prev.filter((selected) => selected.id !== friend.id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleCreateGroup = async () => {
    // Validate group name
    if (!groupName.trim()) {
      setError("Vui lòng nhập tên nhóm");
      return;
    }

    if (groupName.trim().length < 3) {
      setError("Tên nhóm phải có ít nhất 3 ký tự");
      return;
    }

    if (groupName.trim().length > 50) {
      setError("Tên nhóm không được quá 50 ký tự");
      return;
    }

    if (selectedFriends.length < 1) {
      setError("Vui lòng chọn ít nhất 1 bạn bè để tạo nhóm");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await createGroup(groupName, [
        ...selectedFriends.map((f) => f.id),
      ]);

      if (response.success) {
        onGroupCreated(response.data);
        handleClose();
      } else {
        setError("Không thể tạo nhóm. Vui lòng thử lại.");
        console.error("Error creating group:", response.message);
      }
    } catch (error) {
      setError("Không thể tạo nhóm. Vui lòng thử lại.");
      console.error("Error creating group:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setSearchQuery("");
    setSelectedFriends([]);
    setFilteredFriends([]);
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: styles.dialogPaper,
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        <Box sx={styles.titleLeft}>
          <GroupIcon sx={styles.groupIcon} />
          <Typography variant="h6" fontWeight="bold">
            Tạo nhóm chat mới
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={styles.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={styles.dialogContent}>
        <Box sx={styles.contentContainer}>
          {/* Group Name Input */}
          <TextField
            fullWidth
            label="Tên nhóm"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            variant="outlined"
            sx={styles.inputSpacingLarge}
            placeholder="Nhập tên nhóm..."
          />

          {/* Search Friends */}
          <TextField
            fullWidth
            label="Tìm kiếm bạn bè"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            sx={styles.inputSpacingSmall}
            placeholder="Nhập tên hoặc email bạn bè..."
            InputProps={{
              startAdornment: <SearchIcon sx={styles.searchIcon} />,
            }}
          />

          {/* Friends List */}
          <Box sx={styles.sectionSpacing}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={styles.sectionTitle}
            >
              Danh sách bạn bè (
              {Array.isArray(filteredFriends) ? filteredFriends.length : 0}):
            </Typography>

            {loadingFriends ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            ) : Array.isArray(filteredFriends) &&
              filteredFriends.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery
                    ? "Không tìm thấy bạn bè nào"
                    : "Chưa có bạn bè nào"}
                </Typography>
              </Box>
            ) : (
              <List sx={styles.friendsList}>
                {Array.isArray(filteredFriends) &&
                  filteredFriends.map((friend) => {
                    const isSelected = selectedFriends.find(
                      (selected) => selected.id === friend.id
                    );
                    return (
                      <ListItem key={friend.id} dense>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!isSelected}
                              onChange={() => handleToggleFriend(friend)}
                              color="primary"
                            />
                          }
                          label=""
                          sx={styles.checkboxLabel}
                        />
                        <ListItemAvatar>
                          <Avatar
                            src={friend.profilePicture}
                            alt={friend.fullName}
                          >
                            {friend.fullName?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={friend.fullName}
                          secondary={friend.email}
                        />
                      </ListItem>
                    );
                  })}
              </List>
            )}
          </Box>

          {/* Selected Friends */}
          {selectedFriends.length > 0 && (
            <Box sx={styles.sectionSpacing}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={styles.sectionTitle}
              >
                Bạn bè đã chọn ({selectedFriends.length}):
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedFriends.map((friend) => (
                  <Chip
                    key={friend.id}
                    avatar={
                      <Avatar src={friend.profilePicture} alt={friend.fullName}>
                        {friend.fullName?.charAt(0)}
                      </Avatar>
                    }
                    label={friend.fullName}
                    onDelete={() => handleToggleFriend(friend)}
                    deleteIcon={<PersonRemoveIcon />}
                    sx={styles.selectedChip}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={styles.alertSpacing}>
              {error}
            </Alert>
          )}

          {/* Current User Info */}
          <Box sx={styles.currentUserBox}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Bạn sẽ là thành viên của nhóm
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={currentUser?.profilePicture}
                alt={currentUser?.fullName}
              >
                {currentUser?.fullName?.charAt(0)}
              </Avatar>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {currentUser?.fullName} (Bạn)
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={styles.dialogActions}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleCreateGroup}
          variant="contained"
          disabled={
            loading ||
            !groupName.trim() ||
            groupName.trim().length < 3 ||
            groupName.trim().length > 50 ||
            selectedFriends.length < 1
          }
          startIcon={loading ? <CircularProgress size={20} /> : <GroupIcon />}
        >
          {loading ? "Đang tạo..." : "Tạo nhóm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupModal;
